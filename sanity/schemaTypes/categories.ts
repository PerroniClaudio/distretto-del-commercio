import { BsCardList } from "react-icons/bs";

export default {
  name: "category",
  title: "Categorie",
  type: "document",
  icon: BsCardList,
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
