"use client";

import { PopulatedEvent } from "@/types/event";
import UpcomingEventItem from "./UpcomingEventItem";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  LinkList,
  Icon,
} from "design-react-kit";

interface UpcomingEventsListProps {
  events: PopulatedEvent[];
  title?: string;
  maxEvents?: number;
  showAllLink?: boolean;
  compact?: boolean;
  className?: string;
}

export default function UpcomingEventsList({ 
  events, 
  title = "Prossimi Eventi",
  maxEvents = 5,
  showAllLink = true,
  compact = false,
  className = ""
}: UpcomingEventsListProps) {
  // Filtra solo eventi futuri
  const upcomingEvents = events
    .filter(event => {
      if (!event.date) return false;
      return new Date(event.date) >= new Date();
    })
    .slice(0, maxEvents);

  if (upcomingEvents.length === 0) {
    return (
      <Card className={`upcoming-events-card ${className}`}>
        <CardHeader>
          <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
            <Icon
              className="icon-sm me-2"
              icon="it-calendar"
              color="secondary"
              padding={false}
            />
            {title}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <Icon
              className="icon-lg mb-3"
              icon="it-calendar"
              color="secondary"
              padding={false}
            />
            <p className="text-muted mb-0">
              Nessun evento in programma
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`upcoming-events-card ${className}`}>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
          <Icon
            className="icon-sm me-2"
            icon="it-calendar"
            color="secondary"
            padding={false}
          />
          {title}
        </CardTitle>
        
        {showAllLink && events.length > maxEvents && (
          <a 
            href="/eventi" 
            className="btn btn-outline-primary btn-xs"
          >
            Vedi tutti
            <Icon
              className="icon-xs ms-1"
              icon="it-arrow-right"
              padding={false}
            />
          </a>
        )}
      </CardHeader>
      
      <CardBody className="p-0">
        <LinkList>
          {upcomingEvents.map((event, index) => (
            <UpcomingEventItem
              key={event._id}
              event={event}
              compact={compact}
              showDate={true}
            />
          ))}
        </LinkList>
        
        {/* Footer con link a tutti gli eventi */}
        {showAllLink && (
          <div className="card-footer text-center">
            <a 
              href="/eventi" 
              className="btn btn-primary btn-sm"
            >
              <Icon
                className="icon-sm me-2"
                icon="it-calendar"
                padding={false}
              />
              Visualizza calendario completo
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  );
}