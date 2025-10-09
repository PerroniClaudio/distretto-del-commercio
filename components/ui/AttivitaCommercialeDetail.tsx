"use client";

import { Row, Col, Icon, Button } from "design-react-kit";
import Link from "next/link";
import type { AttivitaCommerciale } from "@/types/attivita-commerciale";
import Contact from "./Contact";
import { portableTextComponents } from "./PortableTextComponents";
import { PortableText } from "next-sanity";

// Tipo esteso per dati popolati dalla query GROQ
type PopulatedAttivitaCommerciale = Omit<AttivitaCommerciale, 'mainImage' | 'comune' | 'settori'> & {
  mainImage?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  comune?: {
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
  };
  settori?: Array<{
    _id: string;
    title: string;
    slug: {
      current: string;
    };
  }>;
  apertaAlPubblico: boolean;
};

interface AttivitaCommercialeDetailProps {
  attivita: PopulatedAttivitaCommerciale;
}

export default function AttivitaCommercialeDetail({ attivita }: AttivitaCommercialeDetailProps) {
  return (
    <>
      {/* Hero section */}
      {/* <div className="it-hero-wrapper it-dark it-overlay">
        <div className="img-responsive-wrapper">
          <div className="img-responsive">
            <div className="img-wrapper">
                {attivita.comune?.image?.asset?.url ? (
                  <img
                    src={attivita.comune.image.asset.url}
                    title={attivita.comune.title}
                    alt={attivita.comune.title}
                  />
                ) : (
                  <></>
                )}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="it-hero-text-wrapper bg-dark">
                <h1 className="no_toc">{attivita.title}</h1>
                <p className="d-none d-lg-block font-sans">
                  {attivita.comune?.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Content section */}
      <div className="container my-5">
        <Row>
          <Col md={8}>
            <div className="card-wrapper card-space">
              <div className="card card-bg">
                <div className="card-body">
                  <h1 className="fs-2">{attivita.title}</h1>
                  {attivita?.mainImage?.asset?.url && 
                    <img
                      src={attivita.mainImage.asset.url}
                      title={attivita.mainImage.alt}
                      alt={attivita.mainImage.alt}
                      className="img-fluid mb-4"
                      style={{ maxHeight: 300, objectFit: "contain" }}
                    />
                  }
                  <h5 className="card-title">Descrizione</h5>
                  <PortableText value={attivita.description ?? []} components={portableTextComponents} />

                  {attivita?.contacts && attivita.contacts.length > 0 && (
                    <div>
                      <h5 className="card-title">Contatti</h5>
                      <div className="d-flex flex-column gap-3">
                        {/* Per ora li metto così, poi si può pensare a una versione ristretta dei contatti, modificando l'elemento esistente. */}
                        {attivita.contacts.map((contatto, index) => (
                          <Contact key={index} contact={contatto} />
                        ))}
                      </div>
                    </div>
                  )}
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

                  {/* Indicatore pubblico/privato */}
                  <div>
                    <span className={`badge ${
                      attivita.apertaAlPubblico 
                        ? 'bg-success' 
                        : 'bg-secondary'
                    }`}>
                      {attivita.apertaAlPubblico ? 'Aperta al pubblico' : 'Attività privata'}
                    </span>
                  </div>

                  {Array.isArray(attivita.settori) && attivita.settori.length > 0 && (
                    <div className="mt-3">
                      <h6>Settori</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {attivita.settori.map((settore, index) => (
                          <span 
                            key={settore._id || index} 
                            className="badge bg-primary"
                          >
                            {settore.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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