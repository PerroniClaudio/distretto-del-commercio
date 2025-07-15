import { PopulatedEvent } from "@/types/event";
import Link from "next/link";

interface EventCardProps {
  event: PopulatedEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate >= new Date() : false;

  return (
    <div className={`card border-bottom-card ${!isUpcoming ? 'opacity-75' : ''}`}>
      {event.image && (
        <div className="img-responsive-wrapper">
          <div className="img-responsive">
            <img
              src={event.image.asset.url}
              alt={event.image.alt || event.title}
              className="card-img-top"
            />
          </div>
        </div>
      )}
      
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title">
            <Link href={`/eventi/${event.slug?.current}`} className="text-decoration-none">
              {event.title}
            </Link>
          </h5>
          
          {!isUpcoming && (
            <span className="badge bg-secondary">Passato</span>
          )}
        </div>
        
        {eventDate && (
          <div className="d-flex align-items-center mb-2 text-muted">
            <svg className="icon icon-sm me-2">
              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-calendar"></use>
            </svg>
            <span>
              {eventDate.toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        
        {eventDate && (
          <div className="d-flex align-items-center mb-2 text-muted">
            <svg className="icon icon-sm me-2">
              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-clock"></use>
            </svg>
            <span>
              {eventDate.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
        
        {event.location && (
          <div className="d-flex align-items-center mb-2 text-muted">
            <svg className="icon icon-sm me-2">
              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-pin"></use>
            </svg>
            <span>{event.location}</span>
          </div>
        )}
        
        {event.comune && (
          <div className="d-flex align-items-center mb-3 text-muted">
            <svg className="icon icon-sm me-2">
              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-pa"></use>
            </svg>
            <span>{event.comune.title}</span>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center">
          {event.category && (
            <span className="badge bg-primary">{event.category.title}</span>
          )}
          
          <Link 
            href={`/eventi/${event.slug?.current}`}
            className="btn btn-outline-primary btn-sm"
          >
            Dettagli
            <svg className="icon icon-sm ms-1">
              <use href="/bootstrap-italia/dist/svg/sprites.svg#it-arrow-right"></use>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}