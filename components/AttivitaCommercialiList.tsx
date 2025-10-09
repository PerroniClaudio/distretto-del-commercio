"use client";

import { Card, CardBody, CardText, CardTitle, Col, Row, Button, Icon, CardImg } from "design-react-kit";
import Link from "next/link";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AttivitaCommerciale } from '@/types/attivita-commerciale';
import { PortableTextBlock, toPlainText } from "next-sanity";

// Estendo il tipo per includere l'immagine del comune
type AttivitaCommercialeWithComuneImage = AttivitaCommerciale & {
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
};

interface Settore {
  _id: string;
  title: string;
}

interface Comune {
  _id: string;
  title: string;
  image?: {
    asset?: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  slug: { current: string };
}

interface Props {
  attivitaCommerciali: AttivitaCommercialeWithComuneImage[];
  settori: Settore[];
  comuni: Comune[];
}

// Componente interno che utilizza useSearchParams
function AttivitaCommercialiListContent({ 
  attivitaCommerciali, 
  settori, 
  comuni 
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // const [textSearch, setTextSearch] = useState<string>("");
  const [selectedSettore, setSelectedSettore] = useState<string>(
    searchParams.get("settore") || ""
  );
  const [selectedComune, setSelectedComune] = useState<string>(
    searchParams.get("comune") || ""
  );
  
  // const [filteredAttivita, setFilteredAttivita] = useState<AttivitaCommerciale[]>(attivitaCommerciali);

  const getDescriptionPreview = (description?: PortableTextBlock[]) => {
    if (!description || description.length === 0) return '';
    
    const plainText = toPlainText(description);
    return plainText.length > 100 
      ? plainText.substring(0, 100) + '...' 
      : plainText;
  };

  // Aggiorna l'URL quando cambiano i filtri
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSettore) params.set("settore", selectedSettore);
    if (selectedComune) params.set("comune", selectedComune);
    
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "", { scroll: false });
  }, [selectedSettore, selectedComune, router]);

  // Funzione per gestire il click su un settore
  const handleSettoreClick = (settoreTitle: string) => {
    setSelectedSettore(selectedSettore === settoreTitle ? "" : settoreTitle);
  };

  // Funzione per gestire il click su un comune
  const handleComuneClick = (comuneTitle: string) => {
    setSelectedComune(selectedComune === comuneTitle ? "" : comuneTitle);
  };

  const filteredAttivita = useMemo(() => {
    return attivitaCommerciali.filter((attivita) => {
      // Filtro per settore
      if (selectedSettore && selectedSettore !== '') {
        const hasSettore = attivita.settori?.some(settore => settore.title === selectedSettore);
        if (!hasSettore) return false;
      }
      
      // Filtro per comune
      if (selectedComune && selectedComune !== '') {
        if (attivita.comune?.title !== selectedComune) return false;
      }
      
      // Filtro per testo
      // if (textSearch) {
      //   const searchText = textSearch.toLowerCase();
      //   const titleMatch = attivita.title.toLowerCase().includes(searchText);
      //   const descriptionMatch = attivita.description?.toLowerCase().includes(searchText);
      //   if (!titleMatch && !descriptionMatch) return false;
      // }
      
      return true;
    });
  // }, [attivitaCommerciali, selectedSettore, selectedComune, textSearch]);
  }, [attivitaCommerciali, selectedSettore, selectedComune]);

  return (
    <Row>
      {/* Colonna sinistra con i filtri */}
      <Col md={3}>
        <div className="sidebar-wrapper">
             {/* Filtro per comune */}
          <div className="filter-section">
            <h4 className="filter-title">Comuni</h4>
            <div className="link-list-wrapper">
              <ul className="link-list">
                <li>
                  <a 
                    href="#" 
                    className={`list-item ${!selectedComune ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedComune("");
                    }}
                  >
                    <span>Tutti i comuni</span>
                    {!selectedComune && <Icon icon="it-check" size="sm" />}
                  </a>
                </li>
                {comuni.sort((a, b) => {
                  if (a.slug.current === "pessano-con-bornago") return -1;
                  if (b.slug.current === "pessano-con-bornago") return 1;
                  return 0;
                }).map((comune) => (
                  <li key={comune._id}>
                    <a 
                      href="#" 
                      className={`list-item ${selectedComune === comune.title ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleComuneClick(comune.title);
                      }}
                    >
                      <span>{comune.title}</span>
                      {selectedComune === comune.title && <Icon icon="it-check" size="sm" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Filtro per settore */}
          <div className="filter-section mb-4">
            <h4 className="filter-title">Settori</h4>
            <div className="link-list-wrapper">
              <ul className="link-list">
                <li>
                  <a 
                    href="#" 
                    className={`list-item ${!selectedSettore ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSettore("");
                    }}
                  >
                    <span>Tutti i settori</span>
                    {!selectedSettore && <Icon icon="it-check" size="sm" />}
                  </a>
                </li>
                {settori.map((settore) => (
                  <li key={settore._id}>
                    <a 
                      href="#" 
                      className={`list-item ${selectedSettore === settore.title ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSettoreClick(settore.title);
                      }}
                    >
                      <span>{settore.title}</span>
                      {selectedSettore === settore.title && <Icon icon="it-check" size="sm" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Col>

      {/* Colonna destra con le attività commerciali */}
      <Col md={9}>
        {/* Intestazione con filtri attivi */}
        <div className="mb-4">
          <h2>Attività Commerciali</h2>
          {(selectedSettore || selectedComune) && (
            <div className="filter-summary mt-2">
              <p className="font-weight-semibold">
                Filtri attivi:
                {selectedSettore && (
                  <span className="badge badge-primary mx-1">{selectedSettore}</span>
                )}
                {selectedComune && (
                  <span className="badge badge-secondary mx-1">{selectedComune}</span>
                )}
                <Button 
                  color="link" 
                  size="sm" 
                  className="p-0 ml-2"
                  onClick={() => {
                    setSelectedSettore("");
                    setSelectedComune("");
                  }}
                >
                  Rimuovi filtri
                </Button>
              </p>
            </div>
          )}
        </div>

        {/* Lista attività */}
        {filteredAttivita.length === 0 ? (
          <div className="alert alert-info">
            Nessuna attività commerciale trovata con i filtri selezionati.
          </div>
        ) : (
          <Row>
            {filteredAttivita.map((attivita) => (
              <Col key={attivita._id} md={6} lg={4} className="mb-4">
                <Card className="card-bg">
                  {attivita.mainImage?.asset?.url ? (
                    <CardImg
                      className="img-fluid attivita-card-image"
                      src={attivita.mainImage.asset.url}
                      alt={attivita.mainImage.alt || attivita.title || "Immagine dell'attività"}
                      width={480}
                      height={270}
                    />
                  ) : attivita.comune?.image?.asset?.url ? (
                    <CardImg
                      className="img-fluid attivita-card-image"
                      src={attivita.comune.image.asset.url}
                      alt={attivita.comune.image.alt || `Immagine di ${attivita.comune.title}` || "Immagine del comune"}
                      width={480}
                      height={270}
                    />
                  ) : (
                    <div className="placeholder-image bg-light d-flex align-items-center justify-content-center text-dark fw-bold text-center p-3" style={{ height: "200px", wordWrap: "break-word", wordBreak: "break-word" }}>
                      <span className="fs-5">{attivita.title}</span>
                    </div>
                  )}
                  <CardBody>
                    <CardTitle tag="h5">{attivita.title}</CardTitle>
                    <div className="category-top">
                      {Array.isArray(attivita.settori) && attivita.settori.length > 0 && 
                        attivita.settori.map((settore) => (
                          // <span key={settore._id} className="category">{settore.title}</span>
                          <span key={settore._id} className="badge bg-primary me-1">{settore.title}</span>
                        )
                      )}
                      {attivita.comune?.title && (
                        <span className="badge bg-secondary">{attivita?.comune?.title}</span>
                      )}
                    </div>
                    <CardText>
                      {/* {attivita.description?.substring(0, 100)}{attivita.description && attivita.description.length > 100 ? '...' : ''} */}
                      {getDescriptionPreview(attivita.description)}
                    </CardText>
                    <Link href={`/attivita-commerciali/${attivita.slug.current}`} passHref>
                      <Button color="primary" outline className="mt-2">
                        Scopri di più
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
}

// Componente di fallback durante il caricamento
function AttivitaCommercialiListFallback() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </div>
      <p className="mt-2">Caricamento attività commerciali...</p>
    </div>
  );
}

// Componente principale che avvolge il contenuto in un Suspense boundary
export default function AttivitaCommercialiList(props: Props) {
  return (
    <Suspense fallback={<AttivitaCommercialiListFallback />}>
      <AttivitaCommercialiListContent {...props} />
    </Suspense>
  );
}