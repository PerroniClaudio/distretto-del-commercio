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
      of: [{ type: "block" }],
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