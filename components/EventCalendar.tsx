"use client";

import { useState, useMemo } from "react";
import { PopulatedEvent } from "@/types/event";
import { Icon } from "design-react-kit";

interface EventCalendarProps {
  events: PopulatedEvent[];
}

const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
];

const DAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<PopulatedEvent | null>(null);

  const { calendarDays, eventsMap } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Primo giorno del mese
    const firstDay = new Date(year, month, 1);
    // Ultimo giorno del mese
    const lastDay = new Date(year, month + 1, 0);

    // Giorni da mostrare nel calendario
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const eventsMap = new Map<string, PopulatedEvent[]>();

    // Mappa eventi per data
    events.forEach(event => {
      if (event.date) {
        const eventDate = new Date(event.date);
        const dateKey = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;

        if (!eventsMap.has(dateKey)) {
          eventsMap.set(dateKey, []);
        }
        eventsMap.get(dateKey)!.push(event);
      }
    });

    // Genera giorni del calendario
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { calendarDays: days, eventsMap };
  }, [currentDate, events]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventsForDay = (date: Date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventsMap.get(dateKey) || [];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="calendar-container">
      {/* Header del calendario */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigateMonth(-1)}
        >
          <Icon 
            icon="it-chevron-left"
          />
        </button>

        <h3 className="mb-0">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigateMonth(1)}
        >
           <Icon 
            icon="it-chevron-right"
          />
        </button>
      </div>

      {/* Griglia del calendario */}
      <div className="calendar-grid">
        {/* Header giorni della settimana */}
        <div className="calendar-header row g-0">
          {DAYS.map(day => (
            <div key={day} className="col text-center py-2 fw-bold text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Giorni del calendario */}
        <div className="calendar-body">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
            <div key={weekIndex} className="row g-0">
              {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                const dayEvents = getEventsForDay(date);
                const isCurrentMonthDay = isCurrentMonth(date);
                const isTodayDay = isToday(date);

                return (
                  <div
                    key={dayIndex}
                    className={`col calendar-day ${!isCurrentMonthDay ? 'text-muted' : ''} ${isTodayDay ? 'today' : ''}`}
                  >
                    <div className="day-content p-2 h-100">
                      <div className="day-number mb-1">
                        {date.getDate()}
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="events-preview">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              className="event-dot mb-1 p-1 rounded text-truncate cursor-pointer"
                              style={{ fontSize: '0.75rem', backgroundColor: 'var(--bs-primary-bg-subtle)' }}
                              onClick={() => setSelectedEvent(event)}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              +{dayEvents.length - 2} altri
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal per dettagli evento */}
      {selectedEvent && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedEvent.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedEvent(null)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedEvent.image && (
                  <img
                    src={selectedEvent.image.asset.url}
                    alt={selectedEvent.image.alt || selectedEvent.title}
                    className="img-fluid mb-3 rounded"
                  />
                )}

                <div className="mb-3">
                  <strong>Data:</strong> {' '}
                  {selectedEvent.date && new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>

                {selectedEvent.location && (
                  <div className="mb-3">
                    <strong>Luogo:</strong> {selectedEvent.location}
                  </div>
                )}

                {selectedEvent.comune && (
                  <div className="mb-3">
                    <strong>Comune:</strong> {selectedEvent.comune.title}
                  </div>
                )}

                {selectedEvent.category && (
                  <div className="mb-3">
                    <span className="badge bg-primary">{selectedEvent.category.title}</span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedEvent(null)}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}