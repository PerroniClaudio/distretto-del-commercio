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
  TabContent,
  TabPane,
  TabContainer,
  TabNav,
  TabNavItem,
  TabNavLink,
} from "design-react-kit";
import { PortableText } from "next-sanity";
import PostCard from "./ui/PostCard";
import EventCard from "./ui/EventCard";
import Contact from "./ui/Contact";
import Link from "next/link";

interface EnteContentProps {
  ente: {
    _id: string;
    title: string;
    slug: { current: string };
    description?: any;
    image?: {
      asset?: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    contacts?: Array<{
      title?: string;
      type: 'email' | 'phone' | 'fax' | 'whatsapp' | 'website' | 'instagram' | 'facebook';
      value: string;
    }>;
  };
  news: any[];
  events: any[];
  newsCount: number;
  eventsCount: number;
  enteSlug: string;
}

export default function EnteContent({ 
  ente, 
  news, 
  events, 
  newsCount, 
  eventsCount, 
  enteSlug 
}: EnteContentProps) {
  // Filtra eventi futuri e passati
  const upcomingEvents = events.filter((event) => {
    if (!event.date) return false;
    return new Date(event.date) >= new Date();
  });

  const pastEvents = events.filter((event) => {
    if (!event.date) return false;
    return new Date(event.date) < new Date();
  });

  return (
    <>
      {/* Hero dell'ente */}
      <Hero overlay="dark">
        <HeroBackground
          src={ente.image?.asset?.url || `https://picsum.photos/1920/1080`}
          alt={ente.title}
          title={ente.title}
        />
        <HeroBody>
          {/* <HeroCategory>Ente</HeroCategory> */}
          <HeroTitle tag="h1">{ente.title}</HeroTitle>
          <p className="d-none d-lg-block font-sans-serif fs-5">
            Scopri tutte le notizie e gli eventi di {ente.title}.
            Resta aggiornato sulle iniziative e le attività dell'ente.
          </p>
        </HeroBody>
      </Hero>

      <Container className="my-5">
        {/* Breadcrumb */}
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
              <span>Enti</span>
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
              {ente.title}
            </BreadcrumbItem>
          </Breadcrumb>
        </section>

        {/* Descrizione */}
        {ente.description && (
          <div className="it-page-section mb-5">
            <PortableText value={ente.description} />
          </div>
        )}

        {/* Statistiche rapide */}
        <Row className="mb-5">
          <Col md={4}>
            <Card className="text-center border-primary">
              <CardBody>
                <Icon
                  className="icon-lg mb-3"
                  color="secondary"
                  icon="it-file"
                />
                <h4 className="fw-bold">{newsCount}</h4>
                <p className="text-muted mb-0">Notizie pubblicate</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-success">
              <CardBody>
                <Icon
                  className="icon-lg mb-3"
                  color="secondary"
                  icon="it-calendar"
                />
                <h4 className="fw-bold">{upcomingEvents.length}</h4>
                <p className="text-muted mb-0">Eventi in programma</p>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center border-secondary">
              <CardBody>
                <Icon
                  className="icon-lg mb-3"
                  color="secondary"
                  icon="it-clock"
                />
                <h4 className="fw-bold">{pastEvents.length}</h4>
                <p className="text-muted mb-0">Eventi passati</p>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <TabContainer defaultActiveKey="1">
          <TabNav className="nav-tabs-icon-lg">
            <TabNavItem>
              <TabNavLink eventKey="1">
                <span>
                  <Icon aria-hidden className="icon-lg" icon="it-file" />
                  <span>Notizie ({newsCount})</span>
                </span>
              </TabNavLink>
            </TabNavItem>
            <TabNavItem>
              <TabNavLink eventKey="2">
                <span>
                  <Icon aria-hidden className="icon-lg" icon="it-calendar" />
                  <span>Eventi ({eventsCount})</span>
                </span>
              </TabNavLink>
            </TabNavItem>
            <TabNavItem>
              <TabNavLink eventKey="3">
                <span>
                  <Icon aria-hidden className="icon-lg" icon="it-telephone" />
                  <span>Contatti</span>
                </span>
              </TabNavLink>
            </TabNavItem>
          </TabNav>
          <TabContent>
            <TabPane className="p-4" eventKey="1">
              {news.length === 0 ? (
                <Card className="text-center py-5">
                  <CardBody>
                    <Icon
                      className="icon-lg mb-3"
                      color="secondary"
                      icon="it-file"
                    />
                    <h5>Nessuna notizia disponibile</h5>
                    <p className="text-muted">
                      Non ci sono ancora notizie pubblicate per {ente.title}.
                    </p>
                    <Button color="primary" href="/notizie">
                      <Icon className="icon-sm me-2" icon="it-arrow-right" />
                      Vedi tutte le notizie
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Notizie di {ente.title}</h3>
                    <Button color="outline-primary" size="sm" href={`/notizie?ente=${enteSlug}`}>
                      <Icon
                        className="icon-sm me-2"
                        icon="it-external-link"
                      />
                      Tutte le notizie
                    </Button>
                  </div>

                  <Row>
                    {news.map((post) => (
                      <Col key={post._id} md={6} lg={4} className="mb-4">
                        <PostCard post={post} />
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </TabPane>
            <TabPane className="p-4" eventKey="2">
              {events.length === 0 ? (
                <Card className="text-center py-5">
                  <CardBody>
                    <Icon
                      className="icon-lg mb-3"
                      color="secondary"
                      icon="it-calendar"
                    />
                    <h5>Nessun evento disponibile</h5>
                    <p className="text-muted">
                      Non ci sono eventi programmati per {ente.title}.
                    </p>
                    <Button color="primary" href="/eventi">
                      <Icon
                        className="icon-sm me-2"
                        icon="it-arrow-right"
                      />
                      Vedi tutti gli eventi
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Eventi di {ente.title}</h3>
                    <Button color="outline-primary" size="sm" href={`/eventi?ente=${enteSlug}`}>
                      <Icon
                        className="icon-sm me-2"
                        icon="it-external-link"
                      />
                      Tutti gli eventi
                    </Button>
                  </div>

                  {/* Eventi in programma */}
                  {upcomingEvents.length > 0 && (
                    <>
                      <h4 className="mb-3 text-success">
                        <Icon
                          className="icon-sm me-2"
                          color="success"
                          icon="it-calendar"
                        />
                        Prossimi Eventi
                      </h4>
                      <Row className="mb-5">
                        {upcomingEvents.map((event) => (
                          <Col key={event._id} md={6} lg={4} className="mb-4">
                            <EventCard event={event} />
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}

                  {/* Eventi passati */}
                  {pastEvents.length > 0 && (
                    <>
                      <h4 className="mb-3 text-secondary">
                        <Icon
                          className="icon-sm me-2"
                          color="secondary"
                          icon="it-clock"
                        />
                        Eventi Passati
                      </h4>
                      <Row>
                        {pastEvents.map((event) => (
                          <Col key={event._id} md={6} lg={4} className="mb-4">
                            <EventCard event={event} />
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                </>
              )}
            </TabPane>
            <TabPane className="p-4" eventKey="3">
              {!ente.contacts || ente.contacts.length === 0 ? (
                <Card className="text-center py-5">
                  <CardBody>
                    <Icon
                      className="icon-lg mb-3"
                      color="secondary"
                      icon="it-telephone"
                    />
                    <h5>Nessun contatto disponibile</h5>
                    <p className="text-muted">
                      Non ci sono contatti disponibili per {ente.title}.
                    </p>
                  </CardBody>
                </Card>
              ) : (
                <>
                  <h3 className="mb-4">Contatti di {ente.title}</h3>
                  <div className="d-flex flex-column gap-3">
                    {ente.contacts.map((contatto, index) => (
                      <Contact key={index} contact={contatto} />
                    ))}
                  </div>
                </>
              )}
            </TabPane>
          </TabContent>
        </TabContainer>

        {/* Azioni */}
        <div className="d-flex gap-2 mt-5">
          <Button size="sm" onClick={() => window.history.back()}>
            <Icon icon="it-arrow-left" className="me-1" />
            Indietro
          </Button>
        </div>
      </Container>
    </>
  );
}