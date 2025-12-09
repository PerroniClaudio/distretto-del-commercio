// Querying with "sanityFetch" will keep content automatically updated
// Using client.fetch directly for compatibility with next-sanity 11.x
import { client } from './client'

// Simple fallback implementation for compatibility
export const sanityFetch = async ({ query, params = {} }: { query: string; params?: any }) => {
  const data = await client.fetch(query, params);
  return { data };
};

// Empty component since VisualEditing/SanityLive is handled differently in v11
export const SanityLive = () => null;
