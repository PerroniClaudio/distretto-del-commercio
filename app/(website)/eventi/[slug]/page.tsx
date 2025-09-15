import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import EventContent from "@/components/ui/EventContent";
import { EVENT_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  const eventQuery = `*[_type == "event" && slug.current == $slug && ${EVENT_VISIBILITY_CONDITIONS}][0] {
    _id,
    title,
    slug,
    date,
    dateEnd,
    location,
    description[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    category->{title},
    comune->{
      title,
      image{
        asset->{
          _id,
          url
        },
        alt
      }
    },
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
    },
    enti[]->{
      _id,
      title,
      slug,
      image{
        asset->{
          _id,
          url
        },
        alt
      }
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