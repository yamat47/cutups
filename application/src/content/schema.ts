// The content schema, written once. The site's collections (src/content.config.ts)
// and the validate script (scripts/validate.ts) both import it, so `z` comes from
// astro/zod rather than astro:content, which only resolves inside Astro.
import { z } from "astro/zod";

// The kinds a play is composed of, each a directory under content/components.
export const KINDS = ["formation", "motion", "run", "pass", "action"] as const;
export type Kind = (typeof KINDS)[number];

export const CONTENT = {
  plays: { dir: "content/plays", pattern: "*.md" },
  components: { dir: "content/components", pattern: "*/*.md" },
} as const;

/** The value of `game.away` or `game.home` when the footage does not show the team. */
export const UNKNOWN_TEAM = "unknown";

// File names are slugs too: Astro derives a collection id by slugifying the path,
// so a file name that is not already a slug would get a different id on the site.
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slug = z.string().regex(SLUG, "a slug is lower-case words joined by hyphens");

// One part is written without brackets and several as a list; both come out as a list.
const slugs = z
  .union([slug, z.array(slug).min(1)])
  .transform((value) => (Array.isArray(value) ? value : [value]));

export const componentSchema = z.strictObject({
  kind: z.enum(KINDS),
  title: z.string().min(1),
  aliases: z.array(z.string().min(1)).default([]),
  variant_of: slug.nullable().default(null),
});

export const playSchema = z.strictObject({
  title: z.string().min(1),
  phase: z.enum(["offense", "defense", "kick"]),
  game: z
    .strictObject({
      season: z.int(),
      away: z.string().min(1),
      home: z.string().min(1),
      level: z.enum(["nfl", "ncaa", "other"]),
      offense: z.string().min(1),
    })
    .refine((game) => game.offense === game.away || game.offense === game.home, {
      message: "game.offense is one of game.away and game.home",
      path: ["offense"],
    }),
  components: z
    .partialRecord(z.enum(KINDS), slugs)
    .refine((components) => Object.values(components).some((value) => value !== undefined), {
      message: "components is empty; a play has at least one part",
    }),
  builds_on: slug.nullable().default(null),
  video: z.strictObject({
    url: z.url(),
    author: z.string().min(1),
    kind: z.enum(["diagram+film", "film", "diagram", "talk"]),
    caption: z.string().nullable().default(null),
    transcript: z.string().nullable().default(null),
  }),
});

export type Component = z.output<typeof componentSchema>;
export type Play = z.output<typeof playSchema>;

/** The platform whose official embed shows the video, or null when the site has none for its host. */
export function platformOf(url: string): "instagram" | "x" | null {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "instagram.com") return "instagram";
  if (host === "x.com" || host === "twitter.com") return "x";
  return null;
}
