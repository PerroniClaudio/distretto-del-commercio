import AttivitaCommercialiList from "@/components/AttivitaCommercialiList";
import AttivitaCommercialiHero from "@/components/ui/AttivitaCommercialiHero";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Attività Commerciali",
  description: "Esplora le attività commerciali del distretto",
};

export default async function AttivitaCommercialiPage() {
  // Query per ottenere tutte le attività commerciali
  const attivitaQuery = `*[_type == "attivita_commerciale"] {
    _id,
    title,
    slug,
    description,
    mainImage{
      asset->{
        _id,
        url
      },
      alt
    },
    indirizzo,
    comune->{
      _id,
      title,
      slug
    },
    settori[]->{
      _id,
      title,
      slug
    },
    apertaAlPubblico
  }`;

  // Query per ottenere tutti i settori e comuni per i filtri
  const settoriQuery = `*[_type == "settore"] | order(title asc) {
    _id,
    title
  }`;
  
  const comuniQuery = `*[_type == "comune"] | order(title asc) {
    _id,
    title
  }`;

  const [
    { data: attivitaCommerciali },
    { data: settori },
    { data: comuni }
  ] = await Promise.all([
    sanityFetch({ query: attivitaQuery }),
    sanityFetch({ query: settoriQuery }),
    sanityFetch({ query: comuniQuery })
  ]);

  return (
    <>
      <AttivitaCommercialiHero />
      <div className="container my-5">
        <AttivitaCommercialiList 
          attivitaCommerciali={attivitaCommerciali} 
          settori={settori} 
          comuni={comuni}
        />
      </div>
    </>
  );
}