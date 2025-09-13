import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

interface Ente {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

const entiQuery = `*[_type == "ente"] | order(title asc) {
  _id,
  title,
  slug
}`;

export function useEnti() {
  const [enti, setEnti] = useState<Ente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEnti() {
      try {
        setLoading(true);
        const data = await client.fetch(entiQuery);
        setEnti(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel caricamento degli enti');
        console.error('Errore nel fetch degli enti:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEnti();
  }, []);

  return { enti, loading, error };
}