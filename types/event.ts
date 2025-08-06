import { Event } from "@/sanity/types";

// Tipo basato su Event ma con le reference popolate dalla query GROQ
export type PopulatedEvent = Omit<Event, "category" | "comune" | "image" | "files"> & {
  category?: { title: string };
  comune?: { title: string };
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  files?: Array<{
    asset?: {
      url: string;
      originalFilename?: string;
    };
    title?: string;
    _key: string;
  }>;
};