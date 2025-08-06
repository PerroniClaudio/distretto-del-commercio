import { useEffect, useState } from "react";
import { client } from "../sanity/lib/client";

interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const query = `*[_type == "category"]{
          _id,
          title,
          slug
        }`;
        const data = await client.fetch(query);
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Errore nel caricamento delle categorie"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
