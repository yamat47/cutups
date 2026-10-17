// The site's URLs, in one place (docs/plan.md, "Site").
import type { Kind } from "../content/schema.ts";
import type { PartRef } from "./relations.ts";

export const playHref = (slug: string) => `/plays/${slug}/`;
export const kindHref = (kind: Kind) => `/${kind}/`;
export const partHref = ({ kind, slug }: PartRef) => `/${kind}/${slug}/`;
