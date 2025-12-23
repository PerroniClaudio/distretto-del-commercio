import PostList from "@/components/PostList";
import HeroSection from "@/components/ui/HeroSection";
import { sanityFetch } from "@/sanity/lib/live";
import EventCard from "@/components/ui/EventCard";
import { PopulatedEvent } from "@/types/event";
import Link from "next/link";
import { EVENT_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";

// Le informazioni devono aggiornarsi dinamicamente. O così o usando il revalidate in sanityFetch
export const dynamic = "force-dynamic";

export default async function Home() {
  // Query per ottenere gli eventi
  const eventsQuery = `*[_type == "event" &&
    ${EVENT_VISIBILITY_CONDITIONS}
  ] | order(date asc) {
    _id,
    title,
    slug,
    date,
    dateEnd,
    location,
    description,
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
    enti[]->{
      _id,
      title,
      slug
    }
  }`;

  const { data: events } = await sanityFetch({
    query: eventsQuery,
  }) as { data: PopulatedEvent[] };
  const now = new Date();
  const isOngoing = (event: PopulatedEvent) => {
    if (!event.date || !event.dateEnd) return false;
    const start = new Date(event.date);
    const end = new Date(event.dateEnd);

    return start <= now && end >= now;
  };
  const upcomingEvents = events
    .filter((event: PopulatedEvent) => {
      if (!event.date) return false;
      const start = new Date(event.date);
      const end = event.dateEnd ? new Date(event.dateEnd) : null;

      if (start >= now) return true;
      if (end && start <= now && end >= now) return true;

      return false;
    })
    .sort((a, b) => {
      const aOngoing = isOngoing(a);
      const bOngoing = isOngoing(b);

      if (aOngoing !== bOngoing) return aOngoing ? -1 : 1;

      const aStart = a.date ? new Date(a.date).getTime() : 0;
      const bStart = b.date ? new Date(b.date).getTime() : 0;

      return aStart - bStart;
    });

  return (
    <div>
      <HeroSection />
      <div className="container my-5">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="mb-4">Ultime notizie</h2>
          </div>
          <div className="col-12">
            <PostList />
          </div>
          <div className="col-12 text-center mt-3">
            <Link href="/notizie" className="btn btn-primary">
              Vedi tutte le notizie
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Prossimi Eventi</h2>
          </div>

          {upcomingEvents
            .slice(0, 6)
            .map((event: PopulatedEvent) => (
              <div key={event._id} className="col-md-4 mb-4">
                <EventCard event={event} />
              </div>
            ))}

          <div className="col-12 text-center mt-3">
            <Link href="/eventi" className="btn btn-primary">
              Vedi tutti gli eventi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
