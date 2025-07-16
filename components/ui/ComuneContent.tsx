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
import { Comune } from "@/types/comune";
import { PopulatedPost } from "@/types/post";
import { PopulatedEvent } from "@/types/event";
import PostCard from "./PostCard";
import EventCard from "./EventCard";
import Link from "next/link";


interface ComuneContentProps {
  data: {
    comune: Comune;
    posts: PopulatedPost[];
    events: PopulatedEvent[];
  };
}

function ComuneContent({ data }: ComuneContentProps) {
  const { comune, posts, events } = data;
  // Filtra eventi futuri e passati
  const upcomingEvents = events.filter(event => {
    if (!event.date) return false;
    return new Date(event.date) >= new Date();
  });

  const pastEvents = events.filter(event => {
    if (!event.date) return false;
    return new Date(event.date) < new Date();
  });

  return (
    <>
      {/* Hero del comune */}
      <Hero overlay="dark">
        <HeroBackground
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt={`Comune di ${comune.title}`}
          title={`Comune di ${comune.title}`}
        />
        <HeroBody>
          <HeroCategory>Comune</HeroCategory>
          <HeroTitle tag="h1">{comune.title}</HeroTitle>
          <p className="d-none d-lg-block lead">
            Scopri tutte le notizie e gli eventi del comune di {comune.title}. 
            Resta aggiornato sulle iniziative locali e le attività del territorio.
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
              <span>Comuni</span>
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
              {comune.title}
            </BreadcrumbItem>
          </Breadcrumb>
        </section>

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
                <h4 className="fw-bold">{posts.length}</h4>
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
                  <Icon
                    aria-hidden
                    className="icon-lg"
                    icon="it-file"
                  />
                  <span>
                    Notizie ({posts.length})
                  </span>
                </span>
              </TabNavLink>
            </TabNavItem>
            <TabNavItem>
              <TabNavLink eventKey="2">
                <span>
                  <Icon
                    aria-hidden
                    className="icon-lg"
                    icon="it-calendar"
                  />
                  <span>
                  Eventi ({events.length})
                  </span>
                </span>
              </TabNavLink>
            </TabNavItem>
          </TabNav>
          <TabContent>
            <TabPane
              className="p-4"
              eventKey="1"
            >
              {posts.length === 0 ? (
                  <Card className="text-center py-5">
                    <CardBody>
                      <Icon
                        className="icon-lg mb-3"
                        color="secondary"
                        icon="it-file"
                      />
                      <h5>Nessuna notizia disponibile</h5>
                      <p className="text-muted">
                        Non ci sono ancora notizie pubblicate per il comune di {comune.title}.
                      </p>
                      <Button color="primary" href="/notizie">
                        <Icon
                          className="icon-sm me-2"
                          icon="it-arrow-right"
                        />
                        Vedi tutte le notizie
                      </Button>
                    </CardBody>
                  </Card>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3>Notizie di {comune.title}</h3>
                      <Button color="outline-primary" size="sm" href="/notizie">
                        <Icon
                          className="icon-sm me-2"
                          icon="it-external-link"
                        />
                        Tutte le notizie
                      </Button>
                    </div>
                    
                    <Row>
                      {posts.map((post) => (
                        <Col key={post._id} md={6} lg={4} className="mb-4">
                          <PostCard post={post} />
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
            </TabPane>
            <TabPane
              className="p-4"
              eventKey="2"
            >
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
                        Non ci sono eventi programmati per il comune di {comune.title}.
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
                      <h3>Eventi di {comune.title}</h3>
                      <Button color="outline-primary" size="sm" href="/eventi">
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

export default ComuneContent;