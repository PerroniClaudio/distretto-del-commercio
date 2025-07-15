import EventList from "./EventList";

interface EventsShowcaseProps {
  title?: string;
  view?: 'calendar' | 'grid' | 'both';
  className?: string;
}

export default function EventsShowcase({ 
  title = "Eventi", 
  view = 'both',
  className = ""
}: EventsShowcaseProps) {
  return (
    <section className={`events-showcase py-5 ${className}`}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h2 className="display-5 fw-bold">{title}</h2>
            <p className="lead text-muted">
              Scopri tutti gli eventi in programma nel nostro territorio
            </p>
          </div>
        </div>
        
        <EventList view={view} />
      </div>
    </section>
  );
}