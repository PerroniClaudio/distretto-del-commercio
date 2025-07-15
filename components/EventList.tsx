import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedEvent } from "@/types/event";
import EventCalendar from "./EventCalendar";
import EventCard from "./ui/EventCard";

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
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Calendario Eventi</h2>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12 col-lg-8">
          <EventCalendar events={events} />
        </div>
        
        <div className="col-12 col-lg-4 mt-4 mt-lg-0">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Prossimi Eventi</h5>
            </div>
            <div className="card-body">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted">Nessun evento in programma.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {upcomingEvents
                    .slice(0, 5)
                    .map((event: PopulatedEvent) => (
                      <div key={event._id} className="list-group-item px-0">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{event.title}</h6>
                          <small className="text-muted">
                            {event.date && new Date(event.date).toLocaleDateString('it-IT', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </small>
                        </div>
                        
                        {event.location && (
                          <p className="mb-1 text-muted">
                            <svg className="icon icon-sm me-1">
                              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-pin"></use>
                            </svg>
                            {event.location}
                          </p>
                        )}
                        
                        {event.comune && (
                          <small className="text-muted">{event.comune.title}</small>
                        )}
                        
                        {event.category && (
                          <div className="mt-2">
                            <span className="badge bg-primary-light text-primary">
                              {event.category.title}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sezione griglia eventi */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Tutti gli Eventi</h3>
        </div>
        
        {events.length === 0 ? (
          <div className="col-12">
            <p className="text-muted text-center py-3">Nessun evento disponibile.</p>
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
  );
}

export default EventList;