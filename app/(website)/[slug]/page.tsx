import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";

const query = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{title, content}`
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const data = await client.fetch(
    query,
    { slug },
    isEnabled
      ? {
          perspective: "previewDrafts",
          useCdn: false,
          stega: true,
        }
      : undefined
  );

  if (!data) {
    return <h1>Pagina non trovata</h1>;
  }

  return <h1>{data.title}</h1>;
}
