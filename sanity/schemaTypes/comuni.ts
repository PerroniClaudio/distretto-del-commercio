import { FaBuildingColumns } from "react-icons/fa6";

export default {
  name: "comune",
  title: "Comuni",
  type: "document",
  icon: FaBuildingColumns,
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
  ],
};
