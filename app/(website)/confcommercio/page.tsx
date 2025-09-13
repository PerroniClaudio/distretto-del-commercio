import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import EnteContent from "@/components/EnteContent";

// Query per ottenere l'ente Confcommercio
const confcommercioQuery = `*[_type == "ente" && title match "Confcommercio*"][0] {
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

// Query per contare notizie associate a Confcommercio
const newsCountQuery = `count(*[_type == "post" && references($enteId) && publishedAt <= now() && (publishedTo > now() || !defined(publishedTo)) && hidden != true])`;

// Query per contare eventi associati a Confcommercio
const eventsCountQuery = `count(*[_type == "event" && references($enteId) && publishedFrom <= now() && (publishedTo > now() || !defined(publishedTo)) && hidden != true])`;

// Query per notizie associate a Confcommercio
const newsQuery = `*[_type == "post" && references($enteId) && publishedAt <= now() && (publishedTo > now() || !defined(publishedTo)) && hidden != true] | order(publishedAt desc) [0...6] {
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
  }
}`;

// Query per eventi associati a Confcommercio
const eventsQuery = `*[_type == "event" && references($enteId) && publishedFrom <= now() && (publishedTo > now() || !defined(publishedTo)) && hidden != true] | order(date asc) [0...6] {
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
  }
}`;

export const metadata: Metadata = {
  title: "Confcommercio",
  description: "Informazioni, notizie ed eventi di Confcommercio",
};

export default async function ConfcommercioPage() {
  // Recupera i dati dell'ente Confcommercio
  const { data: confcommercio } = await sanityFetch({
    query: confcommercioQuery,
  });

  if (!confcommercio) {
    notFound();
  }

  // Recupera conteggi e dati
  const [
    { data: newsCount },
    { data: eventsCount },
    { data: news },
    { data: events }
  ] = await Promise.all([
    sanityFetch({ 
      query: newsCountQuery, 
      params: { enteId: confcommercio._id } 
    }),
    sanityFetch({ 
      query: eventsCountQuery, 
      params: { enteId: confcommercio._id } 
    }),
    sanityFetch({ 
      query: newsQuery, 
      params: { enteId: confcommercio._id } 
    }),
    sanityFetch({ 
      query: eventsQuery, 
      params: { enteId: confcommercio._id } 
    })
  ]);

  return (
    <EnteContent
      ente={confcommercio}
      news={news}
      events={events}
      newsCount={newsCount}
      eventsCount={eventsCount}
      enteSlug="confcommercio"
    />
  );
}