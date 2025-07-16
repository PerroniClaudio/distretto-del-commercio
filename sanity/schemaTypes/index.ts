import { type SchemaTypeDefinition } from "sanity";

import post from "./post";
import category from "./categories";
import comuni from "./comuni";
import events from "./events";
import staticPage from "./staticPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, category, comuni, events, staticPage],
};
