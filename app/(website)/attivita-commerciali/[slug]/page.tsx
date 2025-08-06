import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import AttivitaCommercialeDetail from "@/components/ui/AttivitaCommercialeDetail";
import type { AttivitaCommerciale } from "@/sanity/types";

// Tipo esteso per dati popolati dalla query GROQ
type PopulatedAttivitaCommerciale = Omit<AttivitaCommerciale, 'mainImage' | 'comune' | 'settore'> & {
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  comune?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
  settore?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAttivitaCommerciale(slug: string): Promise<PopulatedAttivitaCommerciale | null> {
  const query = `*[_type == "attivita_commerciale" && slug.current == $slug][0] {
    _id,
    title,
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
    settore->{
      _id,
      title,
      slug
    }
  }`;

  const { data: attivita } = await sanityFetch({
    query: query,
    params: { slug },
  });

  return attivita || null;
}

export default async function AttivitaCommercialePage({ params }: PageProps) {
  const { slug } = await params;
  const attivita = await getAttivitaCommerciale(slug);

  if (!attivita) {
    notFound();
  }

  return <AttivitaCommercialeDetail attivita={attivita} />;
}