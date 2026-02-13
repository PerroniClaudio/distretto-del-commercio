import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
// Questo client va usato solo per operazioni backend (API) che richiedono mutazioni.
export const editorClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_VIEWER_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
  },
});
