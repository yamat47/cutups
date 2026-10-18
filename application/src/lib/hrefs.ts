// The site's URLs, in one place (docs/plan.md, "Site").
import type { PartRef } from "./relations.ts";

export const playHref = (slug: string) => `/plays/${slug}/`;
export const partHref = ({ kind, slug }: PartRef) => `/${kind}/${slug}/`;
