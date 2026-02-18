import { client } from "@/sanity/lib/client";
import { editorClient } from "@/sanity/lib/editorClient";

export type SanitySocialPost = {
  _id: string;
  title?: string;
  excerpt?: string;
  slug?: string;
  imageUrl?: string;
  facebookPostId?: string;
  facebookMediaId?: string;
  instagramMediaId?: string;
};

export type SanitySocialEvent = {
  _id: string;
  title?: string;
  socialDescription?: string;
  slug?: string;
  date?: string;
  dateEnd?: string;
  imageUrl?: string;
  facebookPostId?: string;
  facebookMediaId?: string;
  instagramMediaId?: string;
};

type MetaGraphError = {
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
};

const DEFAULT_GRAPH_VERSION = "v22.0";
const SANITY_POST_SOCIAL_QUERY = `*[_type == "post" && _id == $postId][0]{
  _id,
  title,
  excerpt,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  facebookPostId,
  facebookMediaId,
  instagramMediaId
}`;

const SANITY_EVENT_SOCIAL_QUERY = `*[_type == "event" && _id == $eventId][0]{
  _id,
  title,
  socialDescription,
  "slug": slug.current,
  date,
  dateEnd,
  "imageUrl": image.asset->url,
  facebookPostId,
  facebookMediaId,
  instagramMediaId
}`;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSiteUrl(): string | null {
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;

  if (!siteUrl) {
    return null;
  }

  return siteUrl.replace(/\/+$/, "");
}

function getGraphVersion(): string {
  return process.env.META_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
}

function getFacebookCommentPrivacyValue(): string {
  // Requirement: comments enabled only for mentioned profiles/pages.
  return "TAGGED_ONLY";
}

function getMetaErrorMessage(
  payload: MetaGraphError,
  fallback: string,
): string {
  if (!payload?.error) {
    return fallback;
  }

  const parts = [
    payload.error.message,
    payload.error.type,
    typeof payload.error.code === "number"
      ? `code=${payload.error.code}`
      : undefined,
    typeof payload.error.error_subcode === "number"
      ? `subcode=${payload.error.error_subcode}`
      : undefined,
    payload.error.fbtrace_id ? `trace=${payload.error.fbtrace_id}` : undefined,
  ].filter(Boolean);

  if (parts.length === 0) {
    return fallback;
  }

  return parts.join(" | ");
}

function buildPostPublicUrl(post: SanitySocialPost): string | null {
  if (!post.slug) {
    return null;
  }
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return null;
  }
  return `${siteUrl}/notizie/${post.slug}`;
}

function buildCaption(post: SanitySocialPost, maxLength: number): string {
  const excerpt = post.excerpt?.trim();
  const fallbackTitle = post.title?.trim() || "Nuovo aggiornamento";
  const mainText = excerpt || fallbackTitle;
  const postUrl = buildPostPublicUrl(post);
  const composed = postUrl ? `${mainText}\n\n${postUrl}` : mainText;

  if (composed.length <= maxLength) {
    return composed;
  }

  return composed.slice(0, maxLength - 1).trimEnd() + "…";
}

function formatDateOnly(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isSameCalendarDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

function buildEventDateSentence(event: SanitySocialEvent): string {
  const startDateOnly = formatDateOnly(event.date);
  if (!startDateOnly) {
    return "";
  }

  const hasEndDate = Boolean(event.dateEnd);
  if (!hasEndDate) {
    return `L'evento si terrà il giorno ${startDateOnly}.`;
  }

  const start = new Date(event.date as string);
  const end = new Date(event.dateEnd as string);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || isSameCalendarDay(start, end)) {
    return `L'evento si terrà il giorno ${startDateOnly}.`;
  }

  const endDateOnly = formatDateOnly(event.dateEnd);
  if (!endDateOnly) {
    return `L'evento si terrà il giorno ${startDateOnly}.`;
  }

  return `L'evento si terrà dal giorno ${startDateOnly} al giorno ${endDateOnly}.`;
}

function buildEventPublicUrl(event: SanitySocialEvent): string | null {
  if (!event.slug) {
    return null;
  }
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return null;
  }
  return `${siteUrl}/eventi/${event.slug}`;
}

function buildEventCaption(event: SanitySocialEvent, maxLength: number): string {
  const baseDescription = event.socialDescription?.trim() || event.title?.trim() || "Nuovo evento";
  const dateSentence = buildEventDateSentence(event);
  const eventUrl = buildEventPublicUrl(event);

  const parts = [baseDescription];
  if (dateSentence) {
    parts.push(dateSentence);
  }
  if (eventUrl) {
    parts.push(eventUrl);
  }

  const composed = parts.join("\n\n");
  if (composed.length <= maxLength) {
    return composed;
  }

  return composed.slice(0, maxLength - 1).trimEnd() + "…";
}

async function fetchGraph(
  endpoint: string,
  params: Record<string, string>,
  fallbackError: string,
) {
  const body = new URLSearchParams(params);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = (await response.json()) as Record<string, unknown> &
    MetaGraphError;

  if (!response.ok) {
    throw new Error(getMetaErrorMessage(json, fallbackError));
  }

  return json;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorCode(error: unknown): number | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }
  const match = error.message.match(/code=(\d+)/);
  if (!match) {
    return undefined;
  }
  return Number(match[1]);
}

function getErrorSubcode(error: unknown): number | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }
  const match = error.message.match(/subcode=(\d+)/);
  if (!match) {
    return undefined;
  }
  return Number(match[1]);
}

export async function getSanityPostForSocial(
  postId: string,
): Promise<SanitySocialPost> {
  const post = await client.fetch<SanitySocialPost | null>(
    SANITY_POST_SOCIAL_QUERY,
    { postId },
  );

  if (!post?._id) {
    throw new Error(`Sanity post not found for id: ${postId}`);
  }

  if (!post.imageUrl) {
    throw new Error("The selected post has no main image attached.");
  }

  return post;
}

export async function getSanityEventForSocial(
  eventId: string,
): Promise<SanitySocialEvent> {
  const event = await client.fetch<SanitySocialEvent | null>(
    SANITY_EVENT_SOCIAL_QUERY,
    { eventId },
  );

  if (!event?._id) {
    throw new Error(`Sanity event not found for id: ${eventId}`);
  }

  if (!event.imageUrl) {
    throw new Error("The selected event has no main image attached.");
  }

  return event;
}

export async function publishPostToFacebook(post: SanitySocialPost) {
  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const facebookPageId = getRequiredEnv("FACEBOOK_PAGE_ID");

  const endpoint = `https://graph.facebook.com/${graphVersion}/${facebookPageId}/photos`;

  return fetchGraph(
    endpoint,
    {
      access_token: accessToken,
      url: post.imageUrl || "",
      caption: buildCaption(post, 2000),
      comment_privacy_value: getFacebookCommentPrivacyValue(),
    },
    "Facebook publish failed",
  );
}

export async function publishPostToInstagram(post: SanitySocialPost) {
  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const instagramUserId = getRequiredEnv("INSTAGRAM_USER_ID");

  const createMediaEndpoint = `https://graph.facebook.com/${graphVersion}/${instagramUserId}/media`;
  const createMediaResponse = (await fetchGraph(
    createMediaEndpoint,
    {
      access_token: accessToken,
      image_url: post.imageUrl || "",
      caption: buildCaption(post, 2200),
    },
    "Instagram media creation failed",
  )) as { id?: string };

  if (!createMediaResponse?.id) {
    throw new Error("Instagram media creation failed: missing creation id.");
  }

  const publishEndpoint = `https://graph.facebook.com/${graphVersion}/${instagramUserId}/media_publish`;
  let publishResponse: Record<string, unknown> | null = null;

  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      publishResponse = (await fetchGraph(
        publishEndpoint,
        {
          access_token: accessToken,
          creation_id: createMediaResponse.id,
        },
        "Instagram publish failed",
      )) as Record<string, unknown>;
      break;
    } catch (error) {
      const code = getErrorCode(error);
      const subcode = getErrorSubcode(error);
      const isMediaNotReady = code === 9007 || subcode === 2207027;

      if (!isMediaNotReady || attempt === 6) {
        throw error;
      }

      await sleep(2000 * attempt);
    }
  }

  if (!publishResponse) {
    throw new Error(
      "Instagram publish failed: no response from media_publish.",
    );
  }

  const mediaId =
    typeof (publishResponse as { id?: string })?.id === "string"
      ? (publishResponse as { id?: string }).id
      : undefined;

  if (!mediaId) {
    throw new Error("Instagram publish failed: missing media id.");
  }

  const disableCommentsEndpoint = `https://graph.facebook.com/${graphVersion}/${mediaId}`;
  await fetchGraph(
    disableCommentsEndpoint,
    {
      access_token: accessToken,
      comment_enabled: "false",
    },
    "Instagram publish succeeded but disabling comments failed",
  );

  return publishResponse;
}

export async function publishEventToFacebook(event: SanitySocialEvent) {
  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const facebookPageId = getRequiredEnv("FACEBOOK_PAGE_ID");

  const endpoint = `https://graph.facebook.com/${graphVersion}/${facebookPageId}/photos`;

  return fetchGraph(
    endpoint,
    {
      access_token: accessToken,
      url: event.imageUrl || "",
      caption: buildEventCaption(event, 2000),
      comment_privacy_value: getFacebookCommentPrivacyValue(),
    },
    "Facebook event publish failed",
  );
}

export async function publishEventToInstagram(event: SanitySocialEvent) {
  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const instagramUserId = getRequiredEnv("INSTAGRAM_USER_ID");

  const createMediaEndpoint = `https://graph.facebook.com/${graphVersion}/${instagramUserId}/media`;
  const createMediaResponse = (await fetchGraph(
    createMediaEndpoint,
    {
      access_token: accessToken,
      image_url: event.imageUrl || "",
      caption: buildEventCaption(event, 2200),
    },
    "Instagram event media creation failed",
  )) as { id?: string };

  if (!createMediaResponse?.id) {
    throw new Error("Instagram event media creation failed: missing creation id.");
  }

  const publishEndpoint = `https://graph.facebook.com/${graphVersion}/${instagramUserId}/media_publish`;
  let publishResponse: Record<string, unknown> | null = null;

  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      publishResponse = (await fetchGraph(
        publishEndpoint,
        {
          access_token: accessToken,
          creation_id: createMediaResponse.id,
        },
        "Instagram event publish failed",
      )) as Record<string, unknown>;
      break;
    } catch (error) {
      const code = getErrorCode(error);
      const subcode = getErrorSubcode(error);
      const isMediaNotReady = code === 9007 || subcode === 2207027;

      if (!isMediaNotReady || attempt === 6) {
        throw error;
      }

      await sleep(2000 * attempt);
    }
  }

  if (!publishResponse) {
    throw new Error("Instagram event publish failed: no response from media_publish.");
  }

  const mediaId =
    typeof (publishResponse as { id?: string })?.id === "string"
      ? (publishResponse as { id?: string }).id
      : undefined;

  if (!mediaId) {
    throw new Error("Instagram event publish failed: missing media id.");
  }

  const disableCommentsEndpoint = `https://graph.facebook.com/${graphVersion}/${mediaId}`;
  await fetchGraph(
    disableCommentsEndpoint,
    {
      access_token: accessToken,
      comment_enabled: "false",
    },
    "Instagram event publish succeeded but disabling comments failed",
  );

  return publishResponse;
}

export async function updateEventOnFacebook(event: SanitySocialEvent) {
  if (!event.facebookMediaId) {
    throw new Error("Cannot update Facebook event post: missing facebookMediaId.");
  }

  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const endpoint = `https://graph.facebook.com/${graphVersion}/${event.facebookMediaId}`;

  return fetchGraph(
    endpoint,
    {
      access_token: accessToken,
      caption: buildEventCaption(event, 2000),
      comment_privacy_value: getFacebookCommentPrivacyValue(),
    },
    "Facebook event update failed",
  );
}

export async function updateEventOnInstagram(event: SanitySocialEvent) {
  if (!event.instagramMediaId) {
    throw new Error("Cannot update Instagram event post: missing instagramMediaId.");
  }

  const graphVersion = getGraphVersion();
  const accessToken = getRequiredEnv("META_ACCESS_TOKEN");
  const endpoint = `https://graph.facebook.com/${graphVersion}/${event.instagramMediaId}`;

  return fetchGraph(
    endpoint,
    {
      access_token: accessToken,
      caption: buildEventCaption(event, 2200),
      comment_enabled: "false",
    },
    "Instagram event update failed",
  );
}

type SocialPublishPatch = {
  facebookPostId?: string;
  facebookMediaId?: string;
  instagramMediaId?: string;
  socialSyncStatus?: "published" | "updated" | "error";
  socialPublishedAt?: string;
  socialLastError?: string;
};

export function extractFacebookIds(result: Record<string, unknown>) {
  const mediaId = typeof result?.id === "string" ? result.id : undefined;
  const postId =
    typeof result?.post_id === "string" ? result.post_id : undefined;
  return { facebookPostId: postId, facebookMediaId: mediaId };
}

export function extractInstagramMediaId(result: Record<string, unknown>) {
  return typeof result?.id === "string" ? result.id : undefined;
}

export async function patchSanitySocialData(
  documentId: string,
  patch: SocialPublishPatch,
) {
  if (!process.env.SANITY_EDITOR_TOKEN) {
    return;
  }

  const setPatch: Record<string, string> = {};
  const unsetPatch: string[] = [];

  if (patch.facebookPostId) setPatch.facebookPostId = patch.facebookPostId;
  if (patch.facebookMediaId) setPatch.facebookMediaId = patch.facebookMediaId;
  if (patch.instagramMediaId)
    setPatch.instagramMediaId = patch.instagramMediaId;
  if (patch.socialSyncStatus)
    setPatch.socialSyncStatus = patch.socialSyncStatus;
  if (patch.socialPublishedAt)
    setPatch.socialPublishedAt = patch.socialPublishedAt;

  if (
    typeof patch.socialLastError === "string" &&
    patch.socialLastError.trim().length > 0
  ) {
    setPatch.socialLastError = patch.socialLastError.trim();
  } else {
    unsetPatch.push("socialLastError");
  }

  let mutation = editorClient.patch(documentId);
  if (Object.keys(setPatch).length > 0) {
    mutation = mutation.set(setPatch);
  }
  if (unsetPatch.length > 0) {
    mutation = mutation.unset(unsetPatch);
  }
  await mutation.commit();
}
