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

  const { data: event } = await sanityFetch({
    query: eventQuery,
    params: { slug },
  });

  if (!event) {
    notFound();
  }

  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate >= new Date() : false;

  return <EventContent event={event} />;
}