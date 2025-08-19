"use client";

import { PopulatedEvent } from "@/types/event";
import Link from "next/link";

import {
  Card,
  CardBody,
  CardImg,
  CardTitle,
  Icon,
} from "design-react-kit";
import { getDateStringFromTo } from "@/lib/eventUtils";

interface EventCardProps {
  event: PopulatedEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate >= new Date() : false;

  return (
    <Card className={`card-bg border-bottom-card ${!isUpcoming ? 'opacity-75' : ''}`}>
      {/* Header con titolo e badge stato */}


      {/* Immagine evento */}
      <CardImg
        className="img-fluid event-card-image"
        src={event.image?.asset?.url || event.comune?.image?.asset?.url || "https://picsum.photos/1920/1080"}
        alt={event.image?.alt || event.comune?.image?.alt || event.title}
        width={480}
        height={270}
      />

      <CardBody>
        <div className="d-flex flex-column justify-content-between h-100">
          <div>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <CardTitle tag="h5" className="mb-0">
                <Link href={`/eventi/${event.slug?.current}`} className="text-decoration-none">
                  {event.title}
                </Link>
              </CardTitle>

              {!isUpcoming && (
                <span className="badge bg-secondary">Passato</span>
              )}
            </div>
            {/* Card text non può contenere div */}
            {/* <CardText className="font-sans-serif"> */}
            <div>
              {/* Data completa */}
              {eventDate && (
                <div className="d-flex align-items-center mb-2 text-muted">
                  <Icon
                    className="icon-sm me-2"
                    color="secondary"
                    icon="it-calendar"
                    padding={false}
                  />
                  <span>
                    {/* {eventDate.toLocaleDateString('it-IT', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} */}
                    {getDateStringFromTo(event)}
                  </span>
                </div>
              )}

              {/* Orario */}
              {/* {eventDate && (
                <div className="d-flex align-items-center mb-2 text-muted">
                  <Icon
                    className="icon-sm me-2"
                    color="secondary"
                    icon="it-clock"
                    padding={false}
                  />
                  <span>
                    {eventDate.toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )} */}

              {/* Luogo */}
              {event.location && (
                <div className="d-flex align-items-center mb-2 text-muted">
                  <Icon
                    className="icon-sm me-2"
                    color="secondary"
                    icon="it-pin"
                    padding={false}
                  />
                  <span>{event.location}</span>
                </div>
              )}

              {/* Comune */}
              {event.comune && (
                <div className="d-flex align-items-center mb-3 text-muted">
                  <Icon
                    className="icon-sm me-2"
                    color="secondary"
                    icon="it-pa"
                    padding={false}
                  />
                  <span>{event.comune.title}</span>
                </div>
              )}

              {event.category && (
                <span className="badge bg-primary">{event.category.title}</span>
              )}
            </div>
            {/* </CardText> */}
          </div>

          {/* Footer con categoria e link */}
          <div className="d-flex justify-content-end align-items-center mt-3">


            <Link
              href={`/eventi/${event.slug?.current}`}
              className="btn btn-outline-primary btn-sm"
            >
              Dettagli
              <Icon
                className="icon-sm ms-1"
                icon="it-arrow-right"
                padding={false}
              />
            </Link>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}