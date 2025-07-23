"use client";

import { Row, Col, Icon, Button } from "design-react-kit";
import Link from "next/link";

interface AttivitaCommerciale {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  indirizzo?: {
    via?: string;
    civico?: string;
    cap?: string;
  };
  comune?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
  settore?: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  };
}

interface AttivitaCommercialeDetailProps {
  attivita: AttivitaCommerciale;
}

export default function AttivitaCommercialeDetail({ attivita }: AttivitaCommercialeDetailProps) {
  return (
    <>
      {/* Hero section */}
      <div className="it-hero-wrapper it-dark it-overlay it-bottom-overlapping-content">
        <div className="img-responsive-wrapper">
          <div className="img-responsive">
            <div className="img-wrapper">
              {attivita.mainImage?.asset?.url ? (
                <img
                  src={attivita.mainImage.asset.url}
                  title={attivita.title}
                  alt={attivita.mainImage.alt || attivita.title}
                />
              ) : (
                <img
                  src="/images/attivita-commerciali-hero.jpg"
                  title={attivita.title}
                  alt={attivita.title}
                />
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-hero-text-wrapper bg-dark">
                <span className="it-category">{attivita.settore?.title}</span>
                <h1 className="no_toc">{attivita.title}</h1>
                <p className="d-none d-lg-block">
                  {attivita.comune?.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container my-5">
        <Row>
          <Col md={8}>
            <div className="card-wrapper card-space">
              <div className="card card-bg">
                <div className="card-body">
                  <h5 className="card-title">Descrizione</h5>
                  <p className="card-text">{attivita.description}</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="card-wrapper card-space">
              <div className="card card-bg">
                <div className="card-body">
                  <h5 className="card-title">Informazioni</h5>
                  
                  <div className="mt-3">
                    <h6>Indirizzo</h6>
                    <p>
                      {attivita.indirizzo?.via} {attivita.indirizzo?.civico}<br />
                      {attivita.indirizzo?.cap} {attivita.comune?.title}
                    </p>
                  </div>
                  
                  <div className="mt-3">
                    <h6>Settore</h6>
                    <p>{attivita.settore?.title}</p>
                  </div>
                  
                  <div className="mt-4">
                    <Link href="/attivita-commerciali" passHref>
                      <Button color="outline-primary" size="sm">
                        <Icon icon="it-arrow-left" /> Torna all&apos;elenco
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}