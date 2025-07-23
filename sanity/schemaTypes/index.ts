import { type SchemaTypeDefinition } from "sanity";

import post from "./post";
import category from "./categories";
import comuni from "./comuni";
import events from "./events";
import staticPage from "./staticPage";
import settore from "./settore";
import attivitaCommerciali from "./attivita_commerciali";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, events, attivitaCommerciali, category, comuni, settore, staticPage],
};
