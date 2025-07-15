import { sanityFetch } from "@/sanity/lib/live";
import { PopulatedEvent } from "@/types/event";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import EventActions from "@/components/ui/EventActions";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  const eventQuery = `*[_type == "event" && slug.current == $slug][0] {
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

  const { data: event } = await sanityFetch({
    query: eventQuery,
    params: { slug },
  });

  if (!event) {
    notFound();
  }

  const eventDate = event.date ? new Date(event.date) : null;
  const isUpcoming = eventDate ? eventDate >= new Date() : false;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/eventi">Eventi</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {event.title}
              </li>
            </ol>
          </nav>

          {/* Header evento */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1 className="display-4">{event.title}</h1>
              {!isUpcoming && (
                <span className="badge bg-secondary fs-6">Evento Passato</span>
              )}
            </div>

            {/* Meta informazioni */}
            <div className="row mb-4">
              {eventDate && (
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <svg className="icon icon-lg me-3">
                      <use href="/bootstrap-italia/dist/svg/sprites.svg#it-calendar"></use>
                    </svg>
                    <div>
                      <div className="fw-bold">
                        {eventDate.toLocaleDateString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div>
                        {eventDate.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <svg className="icon icon-lg me-3">
                      <use href="/bootstrap-italia/dist/svg/sprites.svg#it-pin"></use>
                    </svg>
                    <div>
                      <div className="fw-bold">Luogo</div>
                      <div>{event.location}</div>
                    </div>
                  </div>
                </div>
              )}

              {event.comune && (
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center text-muted">
                    <svg className="icon icon-lg me-3">
                      <use href="/bootstrap-italia/dist/svg/sprites.svg#it-pa"></use>
                    </svg>
                    <div>
                      <div className="fw-bold">Comune</div>
                      <div>{event.comune.title}</div>
                    </div>
                  </div>
                </div>
              )}

              {event.category && (
                <div className="col-12 col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <svg className="icon icon-lg me-3 text-muted">
                      <use href="/bootstrap-italia/dist/svg/sprites.svg#it-tag"></use>
                    </svg>
                    <div>
                      <div className="fw-bold text-muted">Categoria</div>
                      <span className="badge bg-primary">{event.category.title}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Immagine evento */}
          {event.image && (
            <div className="mb-5">
              <div className="img-responsive-wrapper">
                <div className="img-responsive">
                  <img
                    src={event.image.asset.url}
                    alt={event.image.alt || event.title}
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Descrizione evento */}
          {event.description && (
            <div className="mb-5">
              <h3 className="mb-3">Descrizione</h3>
              <div className="lead">
                <PortableText value={event.description} />
              </div>
            </div>
          )}

          {/* Azioni */}
          <EventActions isUpcoming={isUpcoming} />
        </div>
      </div>
    </div>
  );
}