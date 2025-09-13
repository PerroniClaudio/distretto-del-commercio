import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import EnteContent from "@/components/EnteContent";
import { EVENT_VISIBILITY_CONDITIONS, NEWS_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";

// Query per ottenere un ente specifico tramite slug
const enteQuery = `*[_type == "ente" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  image {
    asset -> {
      _id,
      url
    },
    alt
  },
  contacts
}`;

// Query per notizie associate all'ente
const newsQuery = `*[_type == "post" && references($enteId) && ${NEWS_VISIBILITY_CONDITIONS}] | order(publishedAt desc) [0...6] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  image {
    asset -> {
      _id,
      url
    },
    alt
  },
  category[] -> {
    title
  },
  enti[] -> {
    _id,
    title,
    slug
  }
}`;

// Query per eventi associati all'ente
const eventsQuery = `*[_type == "event" && references($enteId) && ${EVENT_VISIBILITY_CONDITIONS}] | order(date asc) [0...6] {
  _id,
  title,
  slug,
  date,
  dateEnd,
  location,
  description,
  image {
    asset -> {
      _id,
      url
    },
    alt
  },
  category -> {
    title
  },
  enti[] -> {
    _id,
    title,
    slug
  }
}`;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: ente } = await sanityFetch({
    query: enteQuery,
    params: { slug: params.slug },
  });

  if (!ente) {
    return {
      title: "Ente non trovato",
    };
  }

  return {
    title: ente.title,
    description: `Informazioni, notizie ed eventi di ${ente.title}`,
  };
}

export default async function EntePage({ params }: PageProps) {
  // Recupera i dati dell'ente
  const { data: ente } = await sanityFetch({
    query: enteQuery,
    params: { slug: params.slug },
  });

  if (!ente) {
    notFound();
  }

  // Recupera conteggi e dati
  const [
    { data: news },
    { data: events }
  ] = await Promise.all([
    sanityFetch({ 
      query: newsQuery, 
      params: { enteId: ente._id } 
    }),
    sanityFetch({ 
      query: eventsQuery, 
      params: { enteId: ente._id } 
    })
  ]);

  return (
    <EnteContent
      ente={ente}
      news={news}
      events={events}
      enteSlug={params.slug}
    />
  );
}