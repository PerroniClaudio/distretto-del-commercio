import { NextResponse } from "next/server";
import {
  extractFacebookIds,
  getSanityPostForSocial,
  patchSanitySocialData,
  publishPostToFacebook,
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
    const facebookResult = await publishPostToFacebook(post);
    const facebookIds = extractFacebookIds(facebookResult);

    await patchSanitySocialData(post._id, {
      ...facebookIds,
      socialSyncStatus: "published",
      socialPublishedAt: new Date().toISOString(),
      socialLastError: "",
    });

    return NextResponse.json({
      success: true,
      channel: "facebook",
      sanityPostId: post._id,
      result: facebookResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error while publishing to Facebook",
      },
      { status: 500 }
    );
  }
}
