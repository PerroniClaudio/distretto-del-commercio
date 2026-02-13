import { NextResponse } from "next/server";
import {
  extractFacebookIds,
  extractInstagramMediaId,
  getSanityPostForSocial,
  patchSanitySocialData,
  publishPostToFacebook,
  publishPostToInstagram,
} from "@/lib/social/meta";

type PublishBody = {
  sanityPostId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PublishBody;
    const sanityPostId = body?.sanityPostId?.trim();

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
        error: error instanceof Error ? error.message : "Unknown error while publishing to social channels",
      },
      { status: 500 }
    );
  }
}
