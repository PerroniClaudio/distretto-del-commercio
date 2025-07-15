import { useState, useEffect } from 'react';
import { PopulatedEvent } from '@/types/event';

export function useEvents() {
  const [events, setEvents] = useState<PopulatedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Errore nel caricamento degli eventi');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event => {
    if (!event.date) return false;
    return new Date(event.date) >= new Date();
  });

  const pastEvents = events.filter(event => {
    if (!event.date) return false;
    return new Date(event.date) < new Date();
  });

  return {
    events,
    upcomingEvents,
    pastEvents,
    loading,
    error,
  };
}