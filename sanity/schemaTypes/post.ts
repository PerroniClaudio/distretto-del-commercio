import { DocumentTextIcon } from "@sanity/icons";

export default {
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    {
      name: "title",
      title: "Titolo",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Un identificatore unico per il post, usato negli URL.",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "category",
      title: "Categoria",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "comuni",
      title: "Comuni",
      type: "array",
      of: [{ type: "reference", to: [{ type: "comune" }] }],
    },
    {
      name: "excerpt",
      title: "Estratto",
      type: "text",
      description: "Breve descrizione del post, usata per i riassunti.",
    },
    {
      name: "content",
      title: "Contenuto",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "publishedAt",
      title: "Data di pubblicazione (da questa data si vedrà sul sito). Se non specificata il post non sarà visibile.",
      type: "datetime",
    },
    {
      name: "publishedTo",
      title: "Data di fine pubblicazione (non sarà visibile dopo questa data), se non specificata rimarrà visibile indefinitamente.",
      type: "datetime",
    },
    {
      name: "image",
      title: "Immagine",
      type: "image",
      options: {
        hotspot: true, // Enables image cropping and focal point selection
      },
    },
    {
      name: 'files',
      title: 'Files',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Titolo',
            },
          ],
        },
      ],
    },
    {
      name: "hidden",
      title: "Nascosto",
      type: "boolean",
      initialValue: false,
      description: "Se selezionato, il post non sarà visibile sul sito.",
    },
  ],
};
