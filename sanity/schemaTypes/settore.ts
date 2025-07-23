import { FaIndustry } from "react-icons/fa";

export default {
  name: "settore",
  title: "Settori",
  type: "document",
  icon: FaIndustry,
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
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};