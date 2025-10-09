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
        const query = `*[_type == "comune"] | order(
          title asc
        ){
          _id,
          title,
          slug
        }`;
        let data = await client.fetch(query);
        data = data?.sort((a: Comune, b: Comune) => {
          if (a.slug.current === "pessano-con-bornago") return -1;
          if (b.slug.current === "pessano-con-bornago") return 1;
          return 0;
        });
        setComuni(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Errore nel caricamento dei comuni" + (err as any)?.toString()
        );
      } finally {
        setLoading(false);
      }
    }

    fetchComuni();
  }, []);

  return { comuni, loading, error };
}
