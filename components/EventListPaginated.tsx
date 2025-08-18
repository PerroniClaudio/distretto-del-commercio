"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { PopulatedEvent } from "@/types/event";
import EventCard from "./ui/EventCard";
import { Button, Icon } from "design-react-kit";
import { useComuni } from "@/hooks/useComuni";
import { useSearchParams } from "next/navigation";

const EVENTS_PER_PAGE = 6;

interface EventListPaginatedProps {
  events: PopulatedEvent[];
}

function EventListPaginatedContent({ events }: EventListPaginatedProps) {
  const [filteredEvents, setFilteredEvents] = useState<PopulatedEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<string>(() => {
    // Imposta la data attuale come default
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState<string>("");
  const [selectedComune, setSelectedComune] = useState<string>("");

  const searchParams = useSearchParams();
  const { comuni, loading: loadingComuni, error: errorComuni } = useComuni();

  const totalEvents = filteredEvents.length;
  const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);

  // Funzione per filtrare gli eventi (memorizzata con useCallback)
  const filterEvents = useCallback(() => {
    let filtered = [...events];

    // Filtro per data "da"
    if (dateFrom) {
      filtered = filtered.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        const fromDate = new Date(dateFrom);
        // Se l'evento ha una data di fine, controlla che la data "da" non sia successiva alla data di fine
        if (event.dateEnd) {
          const eventEndDate = new Date(event.dateEnd);
          return eventDate >= fromDate || eventEndDate >= fromDate;
        }
        return eventDate >= fromDate;
      });
    }

    // Filtro per data "a" (data compresa)
    if (dateTo) {
      filtered = filtered.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        const toDate = new Date(dateTo);
        // Imposta l'orario della data "a" alla fine del giorno per includere tutti gli eventi di quel giorno
        toDate.setHours(23, 59, 59, 999);
        return eventDate <= toDate;
      });
    }

    // Filtro per comune
    if (selectedComune) {
      filtered = filtered.filter((event) =>
        event.comune?.title
          ?.toLowerCase()
          .includes(selectedComune.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset alla prima pagina quando cambiano i filtri
  }, [events, dateFrom, dateTo, selectedComune]);

  // Applica i filtri quando cambiano i parametri
  useEffect(() => {
    filterEvents();
  }, [events, dateFrom, dateTo, selectedComune, filterEvents]);

  // Inizializza i filtri dai parametri URL
  useEffect(() => {
    const comune = searchParams.get("comune");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (comune) setSelectedComune(comune);
    if (from) setDateFrom(from);
    if (to) setDateTo(to);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll verso l'alto quando cambia pagina
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calcola gli eventi da mostrare nella pagina corrente
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Aggiusta l'inizio se siamo vicini alla fine
    if (endPage - startPage + 1 < maxVisiblePages && totalPages > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Pulsante "Prima pagina"
    pages.push(
      <li
        key="first"
        className={`page-item ${
          currentPage === 1 || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage !== 1 && totalPages > 1
              ? handlePageChange(1)
              : undefined
          }
          disabled={currentPage === 1 || totalPages <= 1}
          aria-label="Prima pagina">
          <div className="double-chevron">
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-left"
              padding={false}
            />
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-left"
              padding={false}
            />
          </div>
        </Button>
      </li>
    );

    // Pulsante "Precedente"
    pages.push(
      <li
        key="prev"
        className={`page-item ${
          currentPage <= 1 || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage > 1 && totalPages > 1
              ? handlePageChange(currentPage - 1)
              : undefined
          }
          disabled={currentPage <= 1 || totalPages <= 1}
          aria-label="Pagina precedente">
          <Icon
            className="icon-sm me-2"
            color="secondary"
            icon="it-chevron-left"
            padding={false}
          />
        </Button>
      </li>
    );

    // Ellipsis iniziale se necessario
    if (startPage > 1 && totalPages > 1) {
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="">...</span>
          </li>
        );
      }
    }

    // Pagine visibili (sempre almeno la pagina 1)
    const actualEndPage = totalPages === 0 ? 1 : endPage;
    for (let i = startPage; i <= actualEndPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? "active" : ""}`}>
          <Button
            color={`${i === currentPage ? "secondary" : "primary"}`}
            size="xs"
            className=""
            onClick={() => (totalPages > 1 ? handlePageChange(i) : undefined)}
            disabled={totalPages <= 1}
            aria-current={i === currentPage ? "page" : undefined}>
            {i}
          </Button>
        </li>
      );
    }

    // Ellipsis finale se necessario
    if (endPage < totalPages && totalPages > 1) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="">...</span>
          </li>
        );
      }
    }

    // Pulsante "Successivo"
    pages.push(
      <li
        key="next"
        className={`page-item ${
          currentPage >= totalPages || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage < totalPages && totalPages > 1
              ? handlePageChange(currentPage + 1)
              : undefined
          }
          disabled={currentPage >= totalPages || totalPages <= 1}
          aria-label="Pagina successiva">
          <Icon
            className="icon-sm me-2"
            color="secondary"
            icon="it-chevron-right"
            padding={false}
          />
        </Button>
      </li>
    );

    // Pulsante "Ultima pagina"
    pages.push(
      <li
        key="last"
        className={`page-item ${
          currentPage === totalPages || totalPages <= 1 ? "disabled" : ""
        }`}>
        <Button
          size="xs"
          className=""
          onClick={() =>
            currentPage !== totalPages && totalPages > 1
              ? handlePageChange(totalPages)
              : undefined
          }
          disabled={currentPage === totalPages || totalPages <= 1}
          aria-label="Ultima pagina">
          <div className="double-chevron">
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-right"
              padding={false}
            />
            <Icon
              className="icon-sm me-2"
              color="secondary"
              icon="it-chevron-right"
              padding={false}
            />
          </div>
        </Button>
      </li>
    );

    return (
      <nav aria-label="Navigazione pagine eventi" className="mt-4">
        <ul className="pagination justify-content-center">{pages}</ul>
      </nav>
    );
  };

  return (
    <div>
      {/* Filtri */}
      <div className="event-filters-wrapper mb-4">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <label htmlFor="dateFrom" className="form-label">
              Data da
            </label>
            <input
              id="dateFrom"
              type="date"
              className="form-control"
              value={dateFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateFrom(e.target.value)
              }
              placeholder="Seleziona data di inizio"
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <label htmlFor="dateTo" className="form-label">
              Data a
            </label>
            <input
              id="dateTo"
              type="date"
              className="form-control"
              value={dateTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateTo(e.target.value)
              }
              placeholder="Seleziona data di fine"
              min={dateFrom} // La data "a" non può essere precedente alla data "da"
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-3">
            <label htmlFor="selectedComune" className="form-label">
              Filtra per comune
            </label>
            <select
              id="selectedComune"
              className="form-select"
              value={selectedComune}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedComune(e.target.value)
              }>
              <option value="">Tutti i comuni</option>
              {loadingComuni && <option disabled>Caricamento comuni...</option>}
              {errorComuni && (
                <option disabled>Errore nel caricamento comuni</option>
              )}
              {comuni &&
                comuni.map((comune) => (
                  <option key={comune._id} value={comune.title}>
                    {comune.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-3 d-flex align-items-end">
            <Button
              color="outline-primary"
              size="sm"
              onClick={() => {
                setDateFrom(new Date().toISOString().split("T")[0]);
                setDateTo("");
                setSelectedComune("");
              }}
              className="w-100">
              <Icon
                className="icon-sm me-2"
                color="black"
                icon="it-refresh"
                padding={false}
              />
              Reset filtri
            </Button>
          </div>
        </div>
      </div>

      {/* Lista eventi */}
      <div className="event-list mt-4">
        {currentEvents.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              {filteredEvents.length === 0
                ? "Nessun evento trovato con i filtri selezionati."
                : "Nessun evento in questa pagina."}
            </p>
          </div>
        ) : (
          <>
            <div className="events-grid row">
              {currentEvents.map((event: PopulatedEvent) => (
                <div key={event._id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {/* Info paginazione */}
            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
              <small className="text-muted">
                Visualizzando {startIndex + 1}-{Math.min(endIndex, totalEvents)}{" "}
                di {totalEvents} eventi
              </small>
              <small className="text-muted">
                Pagina {currentPage} di {totalPages || 1}
              </small>
            </div>

            {/* Paginazione */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

// Componente di fallback durante il caricamento
function EventListPaginatedFallback() {
  return (
    <div className="text-center py-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </div>
      <p className="mt-2">Caricamento eventi...</p>
    </div>
  );
}

// Componente principale che avvolge il contenuto in un Suspense boundary
export default function EventListPaginated({
  events,
}: EventListPaginatedProps) {
  return (
    <Suspense fallback={<EventListPaginatedFallback />}>
      <EventListPaginatedContent events={events} />
    </Suspense>
  );
}
