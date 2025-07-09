import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";

const query = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{title}`
);

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(
    `*[_type == "page" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { isEnabled } = await draftMode();

  const data = await client.fetch<{ title: string } | null>(
    query,
    { slug },
    {
      perspective: isEnabled ? "previewDrafts" : "published",
      stega: isEnabled,
    }
  );

  if (!data) {
    notFound();
  }

  return <h1>{data.title}</h1>;
}
