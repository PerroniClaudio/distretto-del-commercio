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
      title: "Data",
      type: "datetime",
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
      of: [{ type: "block" }],
    },
    {
      name: "image",
      title: "Immagine",
      type: "image",
      options: {
        hotspot: true, // Enables image cropping and focal point selection
      },
    },
  ],
};
