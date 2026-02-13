import { DocumentTextIcon } from "@sanity/icons";

export default {
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: "socialMeta",
      title: "Metadati Social (tecnico)",
      options: { collapsible: true, collapsed: true },
    },
  ],
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
      name: "enti",
      title: "Enti",
      type: "array",
      of: [{ type: "reference", to: [{ type: "ente" }] }],
      validation: (Rule: any) => Rule.unique(),
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
            },
            {
              name: "caption",
              title: "Didascalia",
              type: "string",
            },
          ],
        },
      ],
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
    {
      name: "facebookPostId",
      title: "Facebook Post ID",
      type: "string",
      readOnly: true,
      fieldset: "socialMeta",
      description: "ID tecnico del post pubblicato su Facebook (gestito automaticamente).",
    },
    {
      name: "facebookMediaId",
      title: "Facebook Media ID",
      type: "string",
      readOnly: true,
      fieldset: "socialMeta",
      description: "ID tecnico del media pubblicato su Facebook (gestito automaticamente).",
    },
    {
      name: "instagramMediaId",
      title: "Instagram Media ID",
      type: "string",
      readOnly: true,
      fieldset: "socialMeta",
      description: "ID tecnico del contenuto pubblicato su Instagram (gestito automaticamente).",
    },
    {
      name: "socialPublishedAt",
      title: "Data pubblicazione social",
      type: "datetime",
      readOnly: true,
      fieldset: "socialMeta",
      description: "Timestamp dell'ultima pubblicazione social automatica.",
    },
    {
      name: "socialSyncStatus",
      title: "Stato sincronizzazione social",
      type: "string",
      readOnly: true,
      fieldset: "socialMeta",
      options: {
        list: [
          { title: "Bozza", value: "draft" },
          { title: "Pubblicato", value: "published" },
          { title: "Aggiornato", value: "updated" },
          { title: "Errore", value: "error" },
        ],
      },
      description: "Stato tecnico della sincronizzazione social.",
    },
    {
      name: "socialLastError",
      title: "Ultimo errore social",
      type: "text",
      rows: 3,
      readOnly: true,
      fieldset: "socialMeta",
      description: "Ultimo errore ricevuto durante publish/update social.",
    },
  ],
};
