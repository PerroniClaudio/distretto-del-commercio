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

// Estendo il tipo per includere l'immagine negli enti
type PopulatedEventWithEntiImage = PopulatedEvent & {
  enti?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    image?: {
      asset?: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
  }>;
};

interface EventCardProps {
  event: PopulatedEventWithEntiImage;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate >= new Date() : false;

  return (
    <Card className={`card-bg border-bottom-card ${!isUpcoming ? 'opacity-75' : ''}`}>
      {/* Header con titolo e badge stato */}


      {/* Immagine evento */}
      {event.image?.asset?.url ? (
        <CardImg
          className="img-fluid event-card-image"
          src={event.image.asset.url}
          alt={event.image.alt || event.title}
          width={480}
          height={270}
        />
      ) : event.comune?.image?.asset?.url ? (
        <CardImg
          className="img-fluid event-card-image"
          src={event.comune.image.asset.url}
          alt={event.comune.image.alt || `Immagine di ${event.comune.title}`}
          width={480}
          height={270}
        />
      ) : event.enti?.[0]?.image?.asset?.url ? (
        <CardImg
          className="img-fluid event-card-image"
          src={event.enti[0].image.asset.url}
          alt={event.enti[0].image.alt || `Immagine di ${event.enti[0].title}` || "Immagine dell'ente"}
          width={480}
          height={270}
        />
      ) : (
        <div 
          className="placeholder-image bg-light d-flex align-items-center justify-content-center text-dark fw-bold text-center p-3" 
          style={{ 
            aspectRatio: "4/3",
            wordWrap: "break-word", 
            wordBreak: "break-word" 
          }}
        >
          <span className="fs-5">{event.title}</span>
        </div>
      )}

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
              
              {/* Enti */}
              {event.enti && event.enti?.length > 0 && (
                <div className="d-flex align-items-center mb-3 text-muted">
                  <Icon
                    className="icon-sm me-2"
                    color="secondary"
                    icon="it-pa"
                    padding={false}
                  />
                  <span>{event.enti.map(ente => ente.title).join(', ')}</span>
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