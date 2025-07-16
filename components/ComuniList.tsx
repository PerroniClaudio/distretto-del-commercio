import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Icon,
  Badge,
  Hero,
  HeroBackground,
  HeroBody,
  HeroCategory,
  HeroTitle,
} from "design-react-kit";
import { Comune } from "@/types/comune";
import Link from "next/link";

interface ComuniListProps {
  comuni: Array<Comune & { postsCount: number; eventsCount: number }>;
}

export default function ComuniList({ comuni }: ComuniListProps) {
  const totalPosts = comuni.reduce((sum, comune) => sum + comune.postsCount, 0);
  const totalEvents = comuni.reduce((sum, comune) => sum + comune.eventsCount, 0);

  return (
    <>
      {/* Hero */}
      <Hero overlay="dark">
        <HeroBackground
          src="https://images.unsplash.com/photo-1486299267070-83823f5448dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Comuni del Distretto del Commercio"
          title="Comuni del Distretto"
        />
        <HeroBody>
          <HeroCategory>Distretto del Commercio</HeroCategory>
          <HeroTitle tag="h1">I Nostri Comuni</HeroTitle>
          <p className="d-none d-lg-block lead">
            Esplora i comuni che fanno parte del nostro distretto del commercio. 
            Scopri le notizie, gli eventi e le iniziative di ogni territorio.
          </p>
          
          {/* Statistiche nell'hero */}
          <div className="row mt-4 pt-3 border-top border-light border-opacity-25">
            <div className="col-6 col-md-3">
              <div className="text-center">
                <div className="h3 fw-bold text-white mb-1">{comuni.length}</div>
                <small className="text-light opacity-75">Comuni</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-center">
                <div className="h3 fw-bold text-white mb-1">{totalPosts}</div>
                <small className="text-light opacity-75">Notizie</small>
              </div>
            </div>
            <div className="col-6 col-md-3 mt-3 mt-md-0">
              <div className="text-center">
                <div className="h3 fw-bold text-white mb-1">{totalEvents}</div>
                <small className="text-light opacity-75">Eventi</small>
              </div>
            </div>
            <div className="col-6 col-md-3 mt-3 mt-md-0">
              <div className="text-center">
                <div className="h3 fw-bold text-white mb-1">
                  <Icon
                    className="icon-lg"
                    icon="it-pa"
                    color="white"
                    padding={false}
                  />
                </div>
                <small className="text-light opacity-75">Territorio</small>
              </div>
            </div>
          </div>
        </HeroBody>
      </Hero>

      <Container className="my-5">
        {/* Introduzione */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto text-center">
            <h2 className="mb-3">Comuni del Distretto</h2>
            <p className="lead text-muted">
              Il nostro distretto del commercio comprende {comuni.length} comuni, 
              ognuno con le proprie caratteristiche e iniziative. Clicca su un comune 
              per scoprire le sue notizie ed eventi.
            </p>
          </Col>
        </Row>

        {/* Lista comuni */}
        {comuni.length === 0 ? (
          <Row>
            <Col>
              <Card className="text-center py-5">
                <CardBody>
                  <Icon
                    className="icon-lg mb-3"
                    color="secondary"
                    icon="it-pa"
                  />
                  <h5>Nessun comune disponibile</h5>
                  <p className="text-muted">
                    Non ci sono comuni configurati nel sistema.
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : (
          <Row>
            {comuni.map((comune) => (
              <Col key={comune._id} md={6} lg={4} className="mb-4">
                <Link 
                  href={`/comuni/${comune.slug.current}`}
                  className="text-decoration-none"
                >
                  <Card className="h-100 border-primary comune-card">
                    <CardBody className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-3">
                        <Icon
                          className="icon-lg me-3"
                          color="primary"
                          icon="it-pa"
                        />
                        <CardTitle tag="h5" className="mb-0">
                          {comune.title}
                        </CardTitle>
                      </div>
                      
                      <div className="flex-grow-1">
                        <p className="text-muted mb-3">
                          Scopri tutte le notizie e gli eventi del comune di {comune.title}.
                        </p>
                      </div>
                      
                      {/* Statistiche del comune */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <Icon
                            className="icon-sm me-1"
                            color="secondary"
                            icon="it-file"
                          />
                          <small className="text-muted">
                            {comune.postsCount} notizie
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <Icon
                            className="icon-sm me-1"
                            color="secondary"
                            icon="it-calendar"
                          />
                          <small className="text-muted">
                            {comune.eventsCount} eventi
                          </small>
                        </div>
                      </div>
                      
                      {/* Badge di attività */}
                      <div className="d-flex gap-2">
                        {comune.postsCount > 0 && (
                          <Badge color="primary" className="badge-sm">
                            {comune.postsCount} notizie
                          </Badge>
                        )}
                        {comune.eventsCount > 0 && (
                          <Badge color="success" className="badge-sm">
                            {comune.eventsCount} eventi
                          </Badge>
                        )}
                        {comune.postsCount === 0 && comune.eventsCount === 0 && (
                          <Badge color="secondary" className="badge-sm">
                            Nessun contenuto
                          </Badge>
                        )}
                      </div>
                      
                      {/* Link di azione */}
                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex align-items-center text-primary">
                          <span className="me-2">Esplora</span>
                          <Icon
                            className="icon-sm"
                            icon="it-arrow-right"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}