import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
// Questo client ha permessi di scrittura, quindi va usato solo per operazioni in backend (API)
export const editorClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_EDITOR_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});
