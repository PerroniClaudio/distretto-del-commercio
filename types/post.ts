import { Post } from "@/sanity/types";

// Tipo basato su Post ma con le reference popolate dalla query GROQ
export type PopulatedPost = Omit<Post, "category" | "comuni" | "image"> & {
  category?: Array<{ title: string }>;
  comuni?: Array<{ title: string }>;
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
};
