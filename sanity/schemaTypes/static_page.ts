import { DocumentIcon } from "@sanity/icons";

export default {
  name: "static_page",
  title: "Pagina Statica",
  type: "document",
  icon: DocumentIcon,
  fields: [
    {
      name: "title",
      title: "Titolo",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Un identificatore unico per la pagina, usato negli URL (es: privacy-policy, cookie-policy).",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "content",
      title: "Contenuto",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Testo alternativo",
              type: "string",
              description: "Importante per l'accessibilità e SEO",
              initialValue: "", // Valore iniziale per evitare undefined
            },
            {
              name: "caption",
              title: "Didascalia",
              type: "string",
              initialValue: "", // Valore iniziale per evitare undefined
            },
          ],
          preview: {
            select: {
              alt: "alt",
              caption: "caption",
              asset: "asset"
            },
            prepare(selection: any): any {
              const { alt, caption, asset } = selection;
              return {
              title: alt || caption || "Immagine",
              subtitle: caption || alt || undefined,
              media: asset
              };
            }
          }
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Data di pubblicazione",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "lastModified",
      title: "Ultima modifica",
      type: "datetime",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
  },
};