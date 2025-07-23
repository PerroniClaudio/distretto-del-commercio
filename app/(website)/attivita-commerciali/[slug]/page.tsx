import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import AttivitaCommercialeDetail from "@/components/ui/AttivitaCommercialeDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface AttivitaCommerciale {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  indirizzo?: {
    via?: string;
    civico?: string;
    cap?: string;
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
}

async function getAttivitaCommerciale(slug: string): Promise<AttivitaCommerciale | null> {
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