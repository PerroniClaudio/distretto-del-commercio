import { NextRequest, NextResponse } from "next/server";
import {
  extractFacebookIds,
  extractInstagramMediaId,
  getSanityEventForSocial,
  getSanityPostForSocial,
  patchSanitySocialData,
  publishEventToFacebook,
  publishEventToInstagram,
  publishPostToFacebook,
  publishPostToInstagram,
  updateEventOnFacebook,
  updateEventOnInstagram,
} from "@/lib/social/meta";

type SanityWebhookBody = {
  _id?: string;
  sanityPostId?: string;
  sanityEventId?: string;
  documentId?: string;
  _type?: string;
};

type SupportedWebhookType = "post" | "event";

function getWebhookPostId(body: SanityWebhookBody): string | null {
  const value = body?.sanityPostId || body?.sanityEventId || body?._id || body?.documentId;
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getWebhookType(body: SanityWebhookBody): SupportedWebhookType | null {
  if (body?._type === "post") {
    return "post";
  }
  if (body?._type === "event") {
    return "event";
  }
  return null;
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

  const webhookType = getWebhookType(body);
  if (!webhookType) {
    return NextResponse.json({ success: true, skipped: true, reason: "Unsupported document type" });
  }

  const sanityDocumentId = getWebhookPostId(body);
  if (!sanityDocumentId) {
    return NextResponse.json(
      { success: false, error: "Missing document id. Provide one of: sanityPostId, sanityEventId, _id, documentId" },
      { status: 400 }
    );
  }

  if (webhookType === "event") {
    try {
      const event = await getSanityEventForSocial(sanityDocumentId);

      const isAlreadyPublished = Boolean(event.facebookMediaId) && Boolean(event.instagramMediaId);
      if (isAlreadyPublished) {
        const [facebookUpdateResult, instagramUpdateResult] = await Promise.all([
          updateEventOnFacebook(event),
          updateEventOnInstagram(event),
        ]);
        const facebookIds = extractFacebookIds(facebookUpdateResult);
        const instagramMediaId = extractInstagramMediaId(instagramUpdateResult);

        await patchSanitySocialData(event._id, {
          ...facebookIds,
          instagramMediaId,
          socialSyncStatus: "updated",
          socialPublishedAt: new Date().toISOString(),
          socialLastError: "",
        });

        return NextResponse.json({
          success: true,
          type: "event",
          mode: "updated",
          sanityEventId: event._id,
          channels: ["facebook", "instagram"],
          facebook: facebookUpdateResult,
          instagram: instagramUpdateResult,
        });
      }

      const [facebookResult, instagramResult] = await Promise.all([
        publishEventToFacebook(event),
        publishEventToInstagram(event),
      ]);

      const facebookIds = extractFacebookIds(facebookResult);
      const instagramMediaId = extractInstagramMediaId(instagramResult);

      await patchSanitySocialData(event._id, {
        ...facebookIds,
        instagramMediaId,
        socialSyncStatus: "published",
        socialPublishedAt: new Date().toISOString(),
        socialLastError: "",
      });

      return NextResponse.json({
        success: true,
        type: "event",
        mode: "published",
        sanityEventId: event._id,
        channels: ["facebook", "instagram"],
        facebook: facebookResult,
        instagram: instagramResult,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown event webhook publish error";
      try {
        await patchSanitySocialData(sanityDocumentId, {
          socialSyncStatus: "error",
          socialLastError: message,
        });
      } catch {
        // Ignore secondary patch errors to avoid masking the primary failure.
      }

      return NextResponse.json({ success: false, error: message, sanityEventId: sanityDocumentId }, { status: 500 });
    }
  }

  try {
    const post = await getSanityPostForSocial(sanityDocumentId);

    if (post.facebookPostId && post.instagramMediaId) {
      const [facebookUpdateResult, instagramUpdateResult] = await Promise.all([
        publishPostToFacebook(post),
        publishPostToInstagram(post),
      ]);
      const facebookIds = extractFacebookIds(facebookUpdateResult);
      const instagramMediaId = extractInstagramMediaId(instagramUpdateResult);

      await patchSanitySocialData(post._id, {
        ...facebookIds,
        instagramMediaId,
        socialSyncStatus: "updated",
        socialPublishedAt: new Date().toISOString(),
        socialLastError: "",
      });

      return NextResponse.json({
        success: true,
        mode: "updated",
        sanityPostId: post._id,
        channels: ["facebook", "instagram"],
        facebook: facebookUpdateResult,
        instagram: instagramUpdateResult,
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
      await patchSanitySocialData(sanityDocumentId, {
        socialSyncStatus: "error",
        socialLastError: message,
      });
    } catch {
      // Ignore secondary patch errors to avoid masking the primary failure.
    }

    return NextResponse.json({ success: false, error: message, sanityPostId: sanityDocumentId }, { status: 500 });
  }
}
