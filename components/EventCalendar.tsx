"use client";

import { useState, useMemo, useRef } from "react";
import { PopulatedEvent } from "@/types/event";
import { Icon, UncontrolledTooltip } from "design-react-kit";
import Link from "next/link";

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
    const eventsMap = new Map<string, Array<{event: PopulatedEvent, level: number}>>();

    // Crea lista di tutti gli eventi con i loro range di date
    const eventRanges = events
      .filter(event => event.date)
      .map(event => {
        const eventStartDate = new Date(event.date!);
        const eventEndDate = event.dateEnd ? new Date(event.dateEnd) : eventStartDate;
        return {
          event,
          startDate: eventStartDate,
          endDate: eventEndDate,
          level: -1 // Sarà assegnato dinamicamente
        };
      })
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Mappa per tracciare quali eventi sono attivi in ogni livello per ogni giorno
    const activeLevels = new Map<string, Map<number, string>>(); // dateKey -> level -> eventId
    
    // Processa ogni evento e assegna il livello dinamicamente
    eventRanges.forEach(eventRange => {
      let assignedLevel = -1;
      
      // Trova il primo livello disponibile al momento dell'inizio dell'evento
      const startDateKey = `${eventRange.startDate.getFullYear()}-${eventRange.startDate.getMonth()}-${eventRange.startDate.getDate()}`;
      
      if (!activeLevels.has(startDateKey)) {
        activeLevels.set(startDateKey, new Map());
      }
      
      const startDayLevels = activeLevels.get(startDateKey)!;
      
      // Trova il primo livello libero
      for (let level = 0; level < 10; level++) {
        if (!startDayLevels.has(level)) {
          assignedLevel = level;
          break;
        }
      }
      
      // Assegna questo livello all'evento per tutta la sua durata
      eventRange.level = assignedLevel;
      const currentDate = new Date(eventRange.startDate);
      
      while (currentDate <= eventRange.endDate) {
        const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
        
        if (!activeLevels.has(dateKey)) {
          activeLevels.set(dateKey, new Map());
        }
        
        activeLevels.get(dateKey)!.set(assignedLevel, eventRange.event._id);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Mappa eventi per data con i loro livelli
    eventRanges.forEach(eventRange => {
      const currentEventDate = new Date(eventRange.startDate);
      
      while (currentEventDate <= eventRange.endDate) {
        const dateKey = `${currentEventDate.getFullYear()}-${currentEventDate.getMonth()}-${currentEventDate.getDate()}`;

        if (!eventsMap.has(dateKey)) {
          eventsMap.set(dateKey, []);
        }
        
        eventsMap.get(dateKey)!.push({
          event: eventRange.event,
          level: eventRange.level
        });

        currentEventDate.setDate(currentEventDate.getDate() + 1);
      }
    });

    // Ordina gli eventi per livello in ogni giorno
    eventsMap.forEach((dayEvents) => {
      dayEvents.sort((a, b) => a.level - b.level);
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
                    style={{ minHeight: '120px', maxHeight: '120px' }}
                  >
                    <div className="day-content p-2 h-100 d-flex flex-column">
                      <div className="day-number mb-1 flex-shrink-0">
                        {date.getDate()}
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="events-preview flex-grow-1 overflow-hidden">
                          {/* Calcola il numero massimo di livelli per questo giorno */}
                          {(() => {
                            const maxLevel = Math.max(...dayEvents.map(e => e.level), -1);
                            const levelSlots = Array.from({ length: maxLevel + 1 }, (_, levelIndex) => {
                              const eventAtLevel = dayEvents.find(e => e.level === levelIndex);
                              return eventAtLevel || null;
                            });

                            const truncateText = (text: string) => {
                              return text.length > 13 ? text.substring(0, 13) + '...' : text;
                            };

                            return levelSlots.slice(0, 3).map((eventWithLevel, levelIndex) => {
                              // Determina lo stato dell'evento per questo giorno
                              let eventState = {
                                isStart: false,
                                isEnd: false,
                                isContinuation: false
                              };

                              if (eventWithLevel) {
                                const eventStartDate = new Date(eventWithLevel.event.date!);
                                const eventEndDate = eventWithLevel.event.dateEnd ? new Date(eventWithLevel.event.dateEnd) : eventStartDate;
                                
                                // Normalizza le date per confronto (solo giorno, senza ora)
                                const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                                const startDay = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
                                const endDay = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
                                
                                eventState.isStart = currentDay.getTime() === startDay.getTime();
                                eventState.isEnd = currentDay.getTime() === endDay.getTime();
                                eventState.isContinuation = currentDay.getTime() > startDay.getTime() && currentDay.getTime() < endDay.getTime();
                              }

                              // Determina la classe CSS in base allo stato
                              const getEventClass = () => {
                                if (!eventWithLevel) return '';
                                
                                if (eventState.isStart && eventState.isEnd) {
                                  return 'event-start-end';
                                } else if (eventState.isStart) {
                                  return 'event-start';
                                } else if (eventState.isEnd) {
                                  return 'event-end';
                                } else if (eventState.isContinuation) {
                                  return 'event-continue';
                                }
                                return '';
                              };

                              // Crea un ID univoco per il tooltip
                              const eventId = eventWithLevel ? `event-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${levelIndex}-${eventWithLevel.event._id}` : undefined;
                              
                              return (
                                <div
                                  key={`level-${levelIndex}`}
                                  className="event-slot mb-1 flex-shrink-0"
                                  style={{ height: '1.5rem' }}
                                >
                                  {eventWithLevel ? (
                                    <>
                                      <div
                                        id={eventId}
                                        className={`event-dot p-1 text-truncate cursor-pointer w-100 ${getEventClass()}`}
                                        data-event-id={eventWithLevel.event._id}
                                        onClick={() => setSelectedEvent(eventWithLevel.event)}
                                        onMouseEnter={(e) => {
                                          // Evidenzia tutti gli event-dot con lo stesso event-id
                                          const eventId = e.currentTarget.getAttribute('data-event-id');
                                          const allEventDots = document.querySelectorAll(`[data-event-id="${eventId}"]`);
                                          allEventDots.forEach(dot => dot.classList.add('event-highlighted'));
                                        }}
                                        onMouseLeave={(e) => {
                                          // Rimuovi evidenziazione da tutti gli event-dot con lo stesso event-id
                                          const eventId = e.currentTarget.getAttribute('data-event-id');
                                          const allEventDots = document.querySelectorAll(`[data-event-id="${eventId}"]`);
                                          allEventDots.forEach(dot => dot.classList.remove('event-highlighted'));
                                        }}
                                        // title={eventWithLevel.event.title}
                                      >
                                        {truncateText(eventWithLevel.event.title || '')}
                                      </div>
                                      {eventId && (
                                        <UncontrolledTooltip
                                          placement="top"
                                          target={eventId}
                                        >
                                          {eventWithLevel.event.title}
                                        </UncontrolledTooltip>
                                      )}
                                    </>
                                  ) : (
                                    <div style={{ height: '100%' }}></div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                          
                          {dayEvents.length > 3 && (
                            <div className="text-muted flex-shrink-0" style={{ fontSize: '0.7rem' }}>
                              +{dayEvents.length - 3} altri
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
                    className="img-fluid mb-3 rounded event-modal-image"
                  />
                )}

                <div className="mb-3">
                  <strong>Data:</strong> {' '}
                  {selectedEvent.date && (
                    <>
                      {new Date(selectedEvent.date).toLocaleDateString('it-IT', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {selectedEvent.dateEnd && (
                        <>
                          {' - '}
                          {new Date(selectedEvent.dateEnd).toLocaleDateString('it-IT', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </>
                      )}
                    </>
                  )}
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
                <Link
                  href={`/eventi/${selectedEvent.slug?.current}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  Dettagli
                  <Icon
                    className="icon-sm ms-1"
                    icon="it-arrow-right"
                    padding={false}
                  />
                </Link>
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