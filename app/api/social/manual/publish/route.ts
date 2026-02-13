import { NextResponse } from "next/server";
import {
  extractFacebookIds,
  extractInstagramMediaId,
  getSanityPostForSocial,
  patchSanitySocialData,
  publishPostToFacebook,
  publishPostToInstagram,
} from "@/lib/social/meta";

type ManualPublishBody = {
  sanityPostId?: string;
  secret?: string;
};

function isAuthorized(secret?: string): boolean {
  const expected = process.env.META_MANUAL_POSTING_SECRET;
  if (!expected) {
    return false;
  }
  return (secret || "") === expected;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ManualPublishBody;
    const sanityPostId = body?.sanityPostId?.trim();

    if (!isAuthorized(body?.secret)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!sanityPostId) {
      return NextResponse.json(
        { success: false, error: "Missing required body field: sanityPostId" },
        { status: 400 }
      );
    }

    const post = await getSanityPostForSocial(sanityPostId);
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
      channels: ["facebook", "instagram"],
      sanityPostId: post._id,
      facebook: facebookResult,
      instagram: instagramResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error while publishing manually",
      },
      { status: 500 }
    );
  }
}
