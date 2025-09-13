"use client";

import { getDateStringFromTo } from "@/lib/eventUtils";
import { PopulatedEvent } from "@/types/event";

import {
  Icon,
  LinkListItem,
  Badge,
} from "design-react-kit";

interface UpcomingEventItemProps {
  event: PopulatedEvent;
  showDate?: boolean;
  compact?: boolean;
}

export default function UpcomingEventItem({
  event,
  showDate = true,
  compact = false
}: UpcomingEventItemProps) {
  const eventDate = event.date ? new Date(event.date) : null;

  return (
    <LinkListItem
      href={`/eventi/${event.slug?.current}`}
      className={`upcoming-event-item w-100 ${compact ? 'py-2' : 'py-3'}`}
    >
      <div className="d-flex w-100 justify-content-between align-items-start">
        <div className="flex-grow-1">
          {/* Titolo evento */}
          <h6 className="mb-1 fw-semibold text-primary">
            {event.title}
          </h6>

          {/* Data e ora */}
          {eventDate && showDate && (
            <div className="d-flex align-items-center mb-1 text-secondary small">
              <Icon
                className="icon-xs me-1"
                icon="it-calendar"
                color="secondary"
                padding={false}
              />
              <span>
                {getDateStringFromTo(event)}
              </span>
            </div>
          )}

          {/* Luogo */}
          {event.location && !compact && (
            <div className="d-flex align-items-center mb-1 text-secondary small">
              <Icon
                className="icon-xs me-1"
                icon="it-pin"
                color="secondary"
                padding={false}
              />
              <span className="">{event.location}</span>
            </div>
          )}

          {/* Comune */}
          {event.comune && !compact && (
            <div className="d-flex align-items-center mb-2 text-secondary small">
              <Icon
                className="icon-xs me-1"
                icon="it-pa"
                color="secondary"
                padding={false}
              />
              <span>{event.comune.title}</span>
            </div>
          )}
          
          {/* Enti */}
          {event.enti && event.enti?.length > 0 && !compact && (
            <div className="d-flex align-items-center mb-2 text-secondary small">
              <Icon
                className="icon-xs me-1"
                icon="it-pa"
                color="secondary"
                padding={false}
              />
              <span>{event.enti.map(ente => ente.title).join(', ')}</span>
            </div>
          )}

          {/* Categoria */}
          {event.category && (
            <div className="mt-2">
              <Badge
                color="primary"
                className="badge-sm"
                pill
              >
                {event.category.title}
              </Badge>
            </div>
          )}
        </div>

        {/* Data compatta a destra */}
        {eventDate && !showDate && (
          <div className="text-end text-secondary small ms-2">
            <div className="fw-bold">
              {eventDate.toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'short'
              })}
            </div>
            <div>
              {eventDate.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        )}
      </div>
    </LinkListItem>
  );
}