import { Event } from "@/sanity/types";
import { PortableTextBlock } from "next-sanity";

// Tipo basato su Event ma con le reference popolate dalla query GROQ
export type PopulatedEvent = Omit<Event, "category" | "comune" | "image" | "files" | "enti"> & {
  category?: { title: string };
  comune?: { 
    title: string;
    image?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
  };
  image?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  files?: Array<{
    asset?: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
    title?: string;
    _key: string;
    _type: "file";
  }>;
  description?: PortableTextBlock[];
  enti?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    image?: {
      asset?: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
  }>;
};