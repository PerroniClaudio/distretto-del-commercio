"use client";

import {
    Container,
    Row,
    Col,
    Button,
    Icon,
    Breadcrumb,
    BreadcrumbItem,
    Hero,
    HeroBackground,
    HeroBody,
    HeroCategory,
    HeroTitle,
    Card,
    CardBody,
    Badge,
} from "design-react-kit";
import { PortableText } from "next-sanity";
import { PopulatedEvent } from "@/types/event";
import Link from "next/link";

interface EventContentProps {
    event: PopulatedEvent;
}

function EventContent({ event }: EventContentProps) {
    const eventDate = event.date ? new Date(event.date) : null;
    const isUpcoming = eventDate ? eventDate >= new Date() : false;

    return (
        <>
            {/* Hero con immagine principale e titolo */}
            {event.image && (
                <Hero overlay="dark">
                    <HeroBackground
                        src={event.image.asset.url}
                        alt={event.image.alt || event.title || "Immagine dell'evento"}
                        title={event.title}
                    />
                    <HeroBody>
                        <HeroCategory>
                            {isUpcoming ? "Evento in programma" : "Evento passato"}
                        </HeroCategory>

                        {/* Titolo principale */}
                        <HeroTitle tag="h1">{event.title}</HeroTitle>

                        {/* Informazioni principali nell'hero */}
                        <div className="d-none d-lg-block">
                            {eventDate && (
                                <div className="d-flex align-items-center mb-2 text-white">
                                    <Icon
                                        className="icon-sm me-2"
                                        color="white"
                                        icon="it-calendar"
                                    />
                                    <span className="fw-semibold m-0">
                                        {eventDate.toLocaleDateString('it-IT', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                        {' alle '}
                                        {eventDate.toLocaleTimeString('it-IT', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            )}

                            {event.location && (
                                <div className="d-flex align-items-center text-white">
                                    <Icon
                                        className="icon-sm me-2"
                                        color="white"
                                        icon="it-pin"
                                    />
                                    <span className="m-0">{event.location}</span>
                                </div>
                            )}
                        </div>
                    </HeroBody>
                </Hero>
            )}

            <Container className="my-5">
                <section>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <Icon
                                aria-hidden
                                className="align-top me-1"
                                color="secondary"
                                icon="it-link"
                                size="sm"
                            />
                            <Link href="/">Home</Link>
                            <span className="separator">/</span>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Icon
                                aria-hidden
                                className="align-top me-1"
                                color="secondary"
                                icon="it-link"
                                size="sm"
                            />
                            <Link href="/eventi">Eventi</Link>
                            <span className="separator">/</span>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>
                            <Icon
                                aria-hidden
                                className="align-top me-1"
                                color="secondary"
                                icon="it-link"
                                size="sm"
                            />
                            {event.title}
                        </BreadcrumbItem>
                    </Breadcrumb>
                </section>

                <Row>
                    <Col lg={8}>
                        {/* Informazioni evento per mobile */}
                        <div className="d-lg-none mb-4">
                            <Card className="border-0 bg-light">
                                <CardBody>
                                    {eventDate && (
                                        <div className="d-flex align-items-center mb-2">
                                            <Icon
                                                className="icon-sm me-2"
                                                color="primary"
                                                icon="it-calendar"
                                            />
                                            <span className="fw-semibold">
                                                {eventDate.toLocaleDateString('it-IT', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                                {' alle '}
                                                {eventDate.toLocaleTimeString('it-IT', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {event.location && (
                                        <div className="d-flex align-items-center">
                                            <Icon
                                                className="icon-sm me-2"
                                                color="primary"
                                                icon="it-pin"
                                            />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        {/* Badge per categoria e comune */}
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {!isUpcoming && (
                                <Badge color="secondary" className="fs-6">
                                    Evento Passato
                                </Badge>
                            )}

                            {event.category && (
                                <Badge color="primary" className="fs-6">
                                    {event.category.title}
                                </Badge>
                            )}

                            {event.comune && (
                                <Badge color="info" className="fs-6">
                                    {event.comune.title}
                                </Badge>
                            )}
                        </div>

                        {/* Contenuto dell'evento */}
                        {event.description && (
                            <article className="mb-5">
                                <div className="content-body">
                                    <PortableText value={event.description} />
                                </div>
                            </article>
                        )}

                        {/* Azioni */}
                        <div className="d-flex gap-2 flex-wrap">
                            <Button size="sm" onClick={() => window.history.back()}>
                                <Icon icon="it-arrow-left" className="me-1" />
                                Indietro
                            </Button>

                            {isUpcoming && (
                                <Button color="primary" size="sm">
                                    <Icon icon="it-bookmark" className="me-1" />
                                    Aggiungi al calendario
                                </Button>
                            )}

                            <Button color="outline-primary" size="sm" href="/eventi">
                                <Icon icon="it-calendar" className="me-1" />
                                Altri eventi
                            </Button>
                        </div>
                    </Col>

                    {/* Sidebar con informazioni aggiuntive */}
                    <Col lg={4}>
                        <div className="position-sticky" style={{ top: '2rem' }}>
                            <Card className="border-primary">
                                <CardBody>
                                    <h5 className="card-title d-flex align-items-center mb-3">
                                        <Icon
                                            className="icon-sm me-2"
                                            color="primary"
                                            icon="it-info-circle"
                                        />
                                        Dettagli Evento
                                    </h5>

                                    {/* Data e ora */}
                                    {eventDate && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <Icon
                                                    className="icon-sm me-2"
                                                    color="secondary"
                                                    icon="it-calendar"
                                                />
                                                <strong>Data e Ora</strong>
                                            </div>
                                            <div className="ms-4">
                                                <div>{eventDate.toLocaleDateString('it-IT', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</div>
                                                <div className="text-muted">
                                                    {eventDate.toLocaleTimeString('it-IT', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Luogo */}
                                    {event.location && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <Icon
                                                    className="icon-sm me-2"
                                                    color="secondary"
                                                    icon="it-pin"
                                                />
                                                <strong>Luogo</strong>
                                            </div>
                                            <div className="ms-4">{event.location}</div>
                                        </div>
                                    )}

                                    {/* Comune */}
                                    {event.comune && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <Icon
                                                    className="icon-sm me-2"
                                                    color="secondary"
                                                    icon="it-pa"
                                                />
                                                <strong>Comune</strong>
                                            </div>
                                            <div className="ms-4">{event.comune.title}</div>
                                        </div>
                                    )}

                                    {/* Categoria */}
                                    {event.category && (
                                        <div className="mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <Icon
                                                    className="icon-sm me-2"
                                                    color="secondary"
                                                    icon="it-folder"
                                                />
                                                <strong>Categoria</strong>
                                            </div>
                                            <div className="ms-4">
                                                <Badge color="primary">{event.category.title}</Badge>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stato evento */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <Icon
                                                className="icon-sm me-2"
                                                color="secondary"
                                                icon="it-clock"
                                            />
                                            <strong>Stato</strong>
                                        </div>
                                        <div className="ms-4">
                                            <Badge color={isUpcoming ? "success" : "secondary"}>
                                                {isUpcoming ? "In programma" : "Concluso"}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Azioni rapide */}
                                    {isUpcoming && (
                                        <div className="mt-4 pt-3 border-top">
                                            <Button color="primary" size="sm" className="w-100 mb-2">
                                                <Icon icon="it-bookmark" className="me-1" />
                                                Aggiungi al calendario
                                            </Button>
                                            <Button color="outline-primary" size="sm" className="w-100">
                                                <Icon icon="it-share" className="me-1" />
                                                Condividi evento
                                            </Button>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default EventContent;