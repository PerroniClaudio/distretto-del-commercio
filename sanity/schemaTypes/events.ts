import { CalendarIcon } from "@sanity/icons";

export default {
  name: "event",
  title: "Eventi",
  type: "document",
  icon: CalendarIcon,
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
      description: "Un identificatore unico per l'evento, usato negli URL.",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "category",
      title: "Categoria",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "comune",
      title: "Comune",
      type: "reference",
      to: [{ type: "comune" }],
    },
    {
      name: "enti",
      title: "Enti",
      type: "array",
      of: [{ type: "reference", to: [{ type: "ente" }] }],
      validation: (Rule: any) => Rule.unique(),
    },
    {
      name: "date",
      title: "Data di inizio",
      type: "datetime",
      description: "Data e ora di inizio dell'evento.",
    },
    {
      name: "dateEnd",
      title: "Data di fine",
      type: "datetime",
      description: "Data e ora di fine dell'evento.",
    },
    {
      name: "publishedFrom",
      title: "Data di pubblicazione",
      type: "datetime",
      description: "Data e ora di pubblicazione dell'evento (da questa data si vedrà sul sito). Se non specificata, l'evento sarà visibile immediatamente.",
    },
    {
      name: "publishedTo",
      title: "Data di fine pubblicazione",
      type: "datetime",
      description: "Data e ora di fine pubblicazione dell'evento (da questa data non si vedrà più sul sito). Se non specificata, l'evento rimarrà visibile indefinitamente.",
    },
    {
      name: "location",
      title: "Luogo",
      type: "string",
    },
    {
      name: "description",
      title: "Descrizione",
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
      name: "socialDescription",
      title: "Descrizione social",
      type: "text",
      rows: 3,
      description: "Testo breve per i social (max 200 caratteri).",
      validation: (Rule: any) => Rule.max(200).warning("Massimo 200 caratteri."),
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
      name: "files",
      title: "Allegati",
      type: "array",
      of: [
        {
          type: "file",
          fields: [
            {
              name: "title",
              title: "Titolo",
              type: "string",
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
      description: "Se selezionato, l'evento non sarà visibile sul sito.",
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
