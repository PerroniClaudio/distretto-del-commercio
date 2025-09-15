import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedEvent } from "@/types/event";
import EventCalendar from "./EventCalendar";
import EventCard from "./ui/EventCard";
import UpcomingEventsList from "./ui/UpcomingEventsList";
import EventListPaginated from "./EventListPaginated";
import { EVENT_VISIBILITY_CONDITIONS } from "@/lib/queryUtils";


interface EventListProps {
  view?: 'calendar' | 'grid' | 'both';
}

async function EventList({ view = 'both' }: EventListProps) {
  const eventsQuery = `*[
    _type == "event" &&
    ${EVENT_VISIBILITY_CONDITIONS}
  ] | order(date asc) {
    _id,
    title,
    slug,
    date,
    dateEnd,
    publishedFrom,
    publishedTo,
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

  const { data: events } = await sanityFetch({
    query: eventsQuery,
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
      
      {/* Sezione griglia eventi con filtri e paginazione */}
      <div className="container mb-5">
        <div className="row">
          <div className="col-12">
            <h3 className="mb-4 text-center">Tutti gli Eventi</h3>
          </div>
        </div>
        <EventListPaginated events={events} />
      </div>

    </div>
  );
}

export default EventList;