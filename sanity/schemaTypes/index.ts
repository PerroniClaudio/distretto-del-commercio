import { type SchemaTypeDefinition } from "sanity";

import post from "./post";
import category from "./categories";
import comuni from "./comuni";
import events from "./events";
import staticPage from "./static_page";
import settore from "./settore";
import attivitaCommerciale from "./attivita_commerciali";
import enti from "./enti";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, events, attivitaCommerciale, category, comuni, settore, staticPage, enti],
};
