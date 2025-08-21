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
    List,
    ListItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    LinkList,
    LinkListItem
} from "design-react-kit";
import { PortableText } from "next-sanity";
import { PopulatedEvent } from "@/types/event";
import Link from "next/link";
import { getDateStringFromTo } from "@/lib/eventUtils";
import { portableTextComponents } from "./PortableTextComponents";
import { useEffect } from "react";

interface EventContentProps {
    event: PopulatedEvent;
}

// type FileItem = NonNullable<PopulatedEvent['files']>[number];
type FileItem = {
  asset?: {
    _id: string;
    url: string;
    originalFilename?: string;
  };
  title?: string;
  _key: string;
  _type: "file";
};

function EventContent({ event }: EventContentProps) {
    const eventDate = event.date ? new Date(event.date) : null;
    const isUpcoming = eventDate ? eventDate >= new Date() : false;

    const handleDownload = (fileItem: FileItem) => {
        if (fileItem.asset?.url) {
        const link = document.createElement('a');
        link.href = fileItem.asset.url;
        link.download = fileItem.asset.originalFilename || 'file';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        }
    };

    const getCalendarUrl = () => {
        if (!eventDate) return '';

        // Formato data per ICS (YYYYMMDDTHHMMSSZ)
        const formatDateForICS = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        };

        // Data di fine (assumiamo 2 ore dal momento che non esiste il campo nell'evento)
        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

        const startDateICS = formatDateForICS(eventDate);
        const endDateICS = formatDateForICS(endDate);

        // Contenuto del file ICS
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Distretto del Commercio//Event//IT',
            'BEGIN:VEVENT',
            `DTSTART:${startDateICS}`,
            `DTEND:${endDateICS}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description ? 'Evento del Distretto del Commercio' : ''}`,
            `LOCATION:${event.location || ''}`,
            `UID:event-${event._id}@distretto-commercio.it`,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        // Crea data URL per il file ICS
        const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
        return dataUrl;
    };

    const getGoogleCalendarUrl = () => {
        if (!eventDate) return '';

        const formatDateForGoogle = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        };

        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
        const startDateFormatted = formatDateForGoogle(eventDate);
        const endDateFormatted = formatDateForGoogle(endDate);

        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: event.title || '',
            dates: `${startDateFormatted}/${endDateFormatted}`,
            details: event.description ? 'Evento del Distretto del Commercio' : '',
            location: event.location || '',
            trp: 'false'
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const getOutlookUrl = () => {
        if (!eventDate) return '';

        const formatDateForOutlook = (date: Date) => {
            return date.toISOString();
        };

        const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

        // Per mobile, usiamo outlook.live.com che ha migliore supporto app
        const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            // URL per mobile (può aprire l'app Outlook mobile)
            const params = new URLSearchParams({
                subject: event.title || '',
                startdt: formatDateForOutlook(eventDate),
                enddt: formatDateForOutlook(endDate),
                body: event.description ? 'Evento del Distretto del Commercio' : '',
                location: event.location || ''
            });
            return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
        } else {
            // URL per desktop - outlook.office.com funziona meglio
            const params = new URLSearchParams({
                path: '/calendar/action/compose',
                rru: 'addevent',
                subject: event.title || '',
                startdt: formatDateForOutlook(eventDate),
                enddt: formatDateForOutlook(endDate),
                body: event.description ? 'Evento del Distretto del Commercio' : '',
                location: event.location || ''
            });
            return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
        }
    };

    return (
        <>
            {/* Hero con immagine principale e titolo */}
            {(event?.image || event?.comune?.image) && (
                <Hero overlay="dark">
                    <HeroBackground
                        src={event?.image?.asset?.url || event?.comune?.image?.asset?.url || ""}
                        alt={event?.image?.alt || event?.comune?.image?.alt || event.title || "Immagine dell'evento"}
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
                        {event.description && event.description.length > 0 && (
                            <article className="mb-5">
                                <div className="content-body">
                                    <h2 className="mb-4">{event.title}</h2>
                                    <PortableText value={event.description} components={portableTextComponents} />
                                </div>
                            </article>
                        )}

                        {/* Sezione Allegati */}
                        {event.files && event.files.length > 0 && (
                        <section className="mb-5 border-top pt-4">
                            <h3 className="h4 mb-3">
                            <Icon icon="it-clip" className="me-2" />
                            Allegati
                            </h3>
                            <div className="d-flex flex-column gap-2">
                            <List>
                                {event.files.map((fileItem) => (
                                <ListItem key={fileItem._key}>
                                    <div className="file-list-item">
                                    <Button
                                        size="xs"
                                        className="flex-shrink-0 mb-2 btn-secondary"
                                        onClick={() => handleDownload(fileItem)}>
                                        <Icon icon="it-download" className="me-1 white" />
                                        Scarica
                                    </Button>
                                    {/* <Icon icon="it-file" className="icon-sm me-2" /> */}
                                    <span>{fileItem.title || fileItem.asset?.originalFilename || "File senza nome"}</span>
                                    </div>
                                </ListItem>
                                ))}
                            </List>
                            </div>
                        </section>
                        )}

                        {/* Azioni */}
                        <div className="d-flex gap-2 flex-wrap">
                            <Button size="sm" onClick={() => window.history.back()}>
                                <Icon icon="it-arrow-left" className="me-1" />
                                Indietro
                            </Button>

                            {isUpcoming && (
                                <Dropdown direction="up">
                                    <DropdownToggle color="primary" className="btn-sm">
                                        <Icon icon="it-bookmark" className="me-1" />
                                        Aggiungi al calendario
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-end -mt-4">
                                        <LinkList>
                                            <LinkListItem 
                                                href={getGoogleCalendarUrl()}
                                                className="w-100"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Icon icon="it-external-link" className="me-2" />
                                                Google Calendar
                                            </LinkListItem>
                                            <LinkListItem
                                                href={getOutlookUrl()}
                                                className="w-100"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Icon icon="it-external-link" className="me-2" />
                                                Outlook
                                            </LinkListItem>
                                            <LinkListItem
                                                href={getCalendarUrl()}
                                                className="w-100"
                                                download={`evento-${event.title?.replace(/[^a-zA-Z0-9]/g, '-')}.ics`}
                                            >
                                                <Icon icon="it-download" className="me-2" />
                                                File ICS (Apple, altri)
                                            </LinkListItem>
                                        </LinkList>
                                    </DropdownMenu>
                                </Dropdown>
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
                                                {getDateStringFromTo(event)}
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
                                            {/* <Button 
                                                color="primary" 
                                                size="sm" 
                                                className="w-100 mb-2"
                                                href={getCalendarUrl()}
                                            >
                                                <Icon icon="it-bookmark" className="me-1" />
                                                Aggiungi al calendario
                                            </Button> */}
                                            <Dropdown className="w-100 mb-2" direction="up">
                                                <DropdownToggle color="primary" className="w-100 btn-sm">
                                                    <Icon icon="it-bookmark" className="me-1" />
                                                    Aggiungi al calendario
                                                </DropdownToggle>
                                                <DropdownMenu className="w-100">
                                                    <LinkList>
                                                        <LinkListItem 
                                                            href={getGoogleCalendarUrl()}
                                                            className="w-100"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Icon icon="it-external-link" className="me-2" />
                                                            Google Calendar
                                                        </LinkListItem>
                                                        <LinkListItem
                                                            href={getOutlookUrl()}
                                                            className="w-100"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Icon icon="it-external-link" className="me-2" />
                                                            Outlook
                                                        </LinkListItem>
                                                        <LinkListItem
                                                            href={getCalendarUrl()}
                                                            className="w-100"
                                                            download={`evento-${event.title?.replace(/[^a-zA-Z0-9]/g, '-')}.ics`}
                                                        >
                                                            <Icon icon="it-download" className="me-2" />
                                                            File ICS (Apple, altri)
                                                        </LinkListItem>
                                                    </LinkList>
                                                </DropdownMenu>
                                            </Dropdown>
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