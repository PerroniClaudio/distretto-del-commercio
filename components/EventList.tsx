import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedEvent } from "@/types/event";
import EventCalendar from "./EventCalendar";
import EventCard from "./ui/EventCard";
import UpcomingEventsList from "./ui/UpcomingEventsList";
import EventsHero from "./ui/EventsHero";

interface EventListProps {
  view?: 'calendar' | 'grid' | 'both';
}

async function EventList({ view = 'both' }: EventListProps) {
  const eventsQuery = `*[_type == "event"] | order(date asc) {
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

  const { data: events } = await sanityFetch({
    query: eventsQuery,
  });

  const upcomingEvents = events.filter((event: PopulatedEvent) => {
    if (!event.date) return false;
    return new Date(event.date) >= new Date();
  });

  if (view === 'calendar') {
    return (
      <div className="events-section">
        <EventCalendar events={events} />
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="events-section">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Eventi</h2>
          </div>
        </div>
        
        {events.length === 0 ? (
          <div className="col-12">
            <p className="text-muted text-center py-5">Nessun evento in programma.</p>
          </div>
        ) : (
          <div className="row">
            {events.map((event: PopulatedEvent) => (
              <div key={event._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="events-section">
      {/* Hero Section */}
   
      
      {/* Sezione Calendario e Prossimi Eventi */}
      <div className="container my-5" id="calendario">
        <div className="row">
          <div className="col-12 col-lg-8">
            <EventCalendar events={events} />
          </div>
          
          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <UpcomingEventsList 
              events={events}
              title="Prossimi Eventi"
              maxEvents={5}
              showAllLink={false}
              compact={false}
            />
          </div>
        </div>
      </div>
      
      {/* Sezione griglia eventi */}
      <div className="container mb-5">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-4 text-center">Tutti gli Eventi</h3>
          </div>
          
          {events.length === 0 ? (
            <div className="col-12">
              <p className="text-muted text-center py-5">Nessun evento disponibile.</p>
            </div>
          ) : (
            events.map((event: PopulatedEvent) => (
              <div key={event._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <EventCard event={event} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default EventList;