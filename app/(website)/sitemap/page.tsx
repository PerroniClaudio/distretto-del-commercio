import Sitemap from "@/components/Sitemap";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mappa del Sito | Distretto del Commercio",
  description: "Esplora tutte le pagine, notizie, eventi e contenuti disponibili sul nostro sito.",
};

export default function SitemapPage() {
  return <Sitemap />;
}