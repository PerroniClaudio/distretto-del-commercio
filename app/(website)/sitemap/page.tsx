import Sitemap from "@/components/Sitemap";
import { Metadata } from "next";

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mappa del Sito | Distretto del Commercio",
  description: "Esplora tutte le pagine, notizie, eventi e contenuti disponibili sul nostro sito.",
};

export default function SitemapPage() {
  return <Sitemap />;
}