import { NextResponse } from "next/server";
import {
  extractInstagramMediaId,
  getSanityPostForSocial,
  patchSanitySocialData,
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
    const instagramResult = await publishPostToInstagram(post);
    const instagramMediaId = extractInstagramMediaId(instagramResult);

    await patchSanitySocialData(post._id, {
      instagramMediaId,
      socialSyncStatus: "published",
      socialPublishedAt: new Date().toISOString(),
      socialLastError: "",
    });

    return NextResponse.json({
      success: true,
      channel: "instagram",
      sanityPostId: post._id,
      result: instagramResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error while publishing to Instagram",
      },
      { status: 500 }
    );
  }
}
