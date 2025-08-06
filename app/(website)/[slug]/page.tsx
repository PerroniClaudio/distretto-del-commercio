import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";


const staticPageQuery = defineQuery(
  `*[_type == "static_page" && slug.current == $slug][0]{title, content}`
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  const data = await client.fetch(
    staticPageQuery,
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
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Pagina non trovata</h1>
        <p>La pagina che stai cercando non esiste.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      {data.content && (
        <div className="prose max-w-none">
          <PortableText value={data.content} />
        </div>
      )}
    </div>
  );
}
