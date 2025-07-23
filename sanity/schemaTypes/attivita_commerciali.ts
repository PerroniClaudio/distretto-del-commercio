import { FaStore } from "react-icons/fa";

export default {
  name: "attivita_commerciale",
  title: "Attività Commerciali",
  type: "document",
  icon: FaStore,
  fields: [
    {
      name: "title",
      title: "Nome",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "description",
      title: "Descrizione",
      type: "text",
    },
    {
      name: "mainImage",
      title: "Foto",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "indirizzo",
      title: "Indirizzo",
      type: "object",
      fields: [
        {
          name: "via",
          title: "Via/Piazza",
          type: "string",
        },
        {
          name: "civico",
          title: "Numero Civico",
          type: "string",
        },
        {
          name: "cap",
          title: "CAP",
          type: "string",
        },
      ],
    },
    {
      name: "comune",
      title: "Comune",
      type: "reference",
      to: [{ type: "comune" }],
    },
    {
      name: "settore",
      title: "Settore",
      type: "reference",
      to: [{ type: "settore" }],
    },
  ],
  
};