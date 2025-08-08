import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import ComuneContent from "@/components/ui/ComuneContent";
import { Comune } from "@/types/comune";
import { PopulatedPost } from "@/types/post";
import { PopulatedEvent } from "@/types/event";
import { EVENT_VISIBILITY_CONDITIONS, NEWS_VISIBILITY_CONDITIONS } from "@/lib/eventUtils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ComuneData {
  comune: Comune;
  posts: PopulatedPost[];
  events: PopulatedEvent[];
}

async function getComuneData(slug: string): Promise<ComuneData | null> {
  // Query per il comune
  const comuneQuery = `*[_type == "comune" && slug.current == $slug][0] {
    _id,
    title,
    slug
  }`;

  const { data: comune } = await sanityFetch({
    query: comuneQuery,
    params: { slug },
  });

  if (!comune) {
    return null;
  }

  // Query per i post del comune
  const postsQuery = `*[_type == "post" && references($comuneId) && ${NEWS_VISIBILITY_CONDITIONS}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    category[]->{title},
    comuni[]->{title},
    publishedAt,
    image{
      asset->{
        _id,
        url
      },
      alt
    }
  }`;

  const { data: posts } = await sanityFetch({
    query: postsQuery,
    params: { comuneId: comune._id },
  });

  // Query per gli eventi del comune
  const eventsQuery = `*[_type == "event" && references($comuneId) && ${EVENT_VISIBILITY_CONDITIONS}] | order(date asc) {
    _id,
    title,
    slug,
    date,
    dateEnd,
    location,
    description,
    category->{title},
    comune->{title},
    image{
      asset->{
        _id,
        url
      },
      alt
    }
  }`;

  const { data: events } = await sanityFetch({
    query: eventsQuery,
    params: { comuneId: comune._id },
  });

  return {
    comune,
    posts: posts || [],
    events: events || [],
  };
}

export default async function ComunePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getComuneData(slug);

  if (!data) {
    notFound();
  }

  return <ComuneContent data={data} />;
}