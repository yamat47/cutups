import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { CONTENT, componentSchema, playSchema } from "./content/schema.ts";

export const collections = {
  plays: defineCollection({
    loader: glob({ pattern: CONTENT.plays.pattern, base: CONTENT.plays.dir }),
    schema: playSchema,
  }),
  // The id of a part is `{kind}/{slug}`, which is its path under content/components.
  components: defineCollection({
    loader: glob({ pattern: CONTENT.components.pattern, base: CONTENT.components.dir }),
    schema: componentSchema,
  }),
};
