import { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";

interface Comune {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export function useComuni() {
  const [comuni, setComuni] = useState<Comune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComuni() {
      try {
        setLoading(true);
        const query = `*[_type == "comune"]{
          _id,
          title,
          slug
        }`;
        const data = await client.fetch(query);
        setComuni(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Errore nel caricamento dei comuni"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchComuni();
  }, []);

  return { comuni, loading, error };
}
