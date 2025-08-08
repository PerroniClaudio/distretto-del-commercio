import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import EventContent from "@/components/ui/EventContent";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  const eventQuery = `*[_type == "event" && slug.current == $slug][0] {
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
    },
    files[]{
      asset->{
        url,
        originalFilename
      },
      title,
      _key
    }
  }`;

  const { data: event } = await sanityFetch({
    query: eventQuery,
    params: { slug },
  });

  if (!event) {
    notFound();
  }

  return <EventContent event={event} />;
}