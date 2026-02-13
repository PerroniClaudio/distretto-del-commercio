import { NextRequest, NextResponse } from "next/server";
import {
  extractFacebookIds,
  extractInstagramMediaId,
  getSanityPostForSocial,
  patchSanitySocialData,
  publishPostToFacebook,
  publishPostToInstagram,
} from "@/lib/social/meta";

type SanityWebhookBody = {
  _id?: string;
  sanityPostId?: string;
  documentId?: string;
  _type?: string;
};

function getWebhookPostId(body: SanityWebhookBody): string | null {
  const value = body?.sanityPostId || body?._id || body?.documentId;
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }

  const headerSecret =
    req.headers.get("x-sanity-webhook-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return headerSecret === secret;
}

function isMetaAutopostingEnabled(): boolean {
  return (process.env.META_AUTOPOSTING_ENABLED || "").toLowerCase() === "true";
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized webhook request" }, { status: 401 });
  }

  if (!isMetaAutopostingEnabled()) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "META_AUTOPOSTING_ENABLED is not true",
    });
  }

  let body: SanityWebhookBody;
  try {
    body = (await req.json()) as SanityWebhookBody;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (body?._type && body._type !== "post") {
    return NextResponse.json({ success: true, skipped: true, reason: "Document is not of type post" });
  }

  const sanityPostId = getWebhookPostId(body);
  if (!sanityPostId) {
    return NextResponse.json(
      { success: false, error: "Missing post id. Provide one of: sanityPostId, _id, documentId" },
      { status: 400 }
    );
  }

  try {
    const post = await getSanityPostForSocial(sanityPostId);

    if (post.facebookPostId && post.instagramMediaId) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: "Post already published on both channels",
        sanityPostId: post._id,
      });
    }

    const [facebookResult, instagramResult] = await Promise.all([
      publishPostToFacebook(post),
      publishPostToInstagram(post),
    ]);

    const facebookIds = extractFacebookIds(facebookResult);
    const instagramMediaId = extractInstagramMediaId(instagramResult);

    await patchSanitySocialData(post._id, {
      ...facebookIds,
      instagramMediaId,
      socialSyncStatus: "published",
      socialPublishedAt: new Date().toISOString(),
      socialLastError: "",
    });

    return NextResponse.json({
      success: true,
      sanityPostId: post._id,
      channels: ["facebook", "instagram"],
      facebook: facebookResult,
      instagram: instagramResult,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook publish error";
    try {
      await patchSanitySocialData(sanityPostId, {
        socialSyncStatus: "error",
        socialLastError: message,
      });
    } catch {
      // Ignore secondary patch errors to avoid masking the primary failure.
    }

    return NextResponse.json({ success: false, error: message, sanityPostId }, { status: 500 });
  }
}
