import PostList from "@/components/PostList";
import HeroSection from "@/components/ui/HeroSection";
import { sanityFetch } from "@/sanity/lib/live";
import EventCard from "@/components/ui/EventCard";
import { PopulatedEvent } from "@/types/event";
import Link from "next/link";
import { EVENT_VISIBILITY_CONDITIONS } from "@/lib/utils";

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
  }) as { data: PopulatedEvent[] };

  return (
    <div>
      <HeroSection />
      <div className="container my-5">
        <div className="row mb-5">
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

          {events
            .filter((event: PopulatedEvent) => event.date ? new Date(event.date) >= new Date() : false)
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
