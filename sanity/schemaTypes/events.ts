import { CalendarIcon } from "@sanity/icons";

export default {
  name: "event",
  title: "Eventi",
  type: "document",
  icon: CalendarIcon,
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
  ],
};
