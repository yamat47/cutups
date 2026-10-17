// The checks the schema (src/content/schema.ts) cannot make: references between
// files, the Markdown body, which is not frontmatter, and warnings, which zod has
// no level for.
import {
  PLAY_KINDS,
  SLUG,
  UNKNOWN_TEAM,
  platformOf,
  type Component,
  type Play,
} from "../content/schema.ts";

export interface Finding {
  level: "error" | "warning";
  file: string;
  message: string;
}

export const error = (file: string, message: string): Finding => ({
  level: "error",
  file,
  message,
});
export const warning = (file: string, message: string): Finding => ({
  level: "warning",
  file,
  message,
});

export interface ParsedPlay {
  file: string;
  slug: string;
  data: Play;
  body: string;
}

export interface ParsedComponent {
  file: string;
  /** The directory the file sits in, which must agree with `data.kind`. */
  kind: string;
  slug: string;
  data: Component;
  body: string;
}

export const PLAY_HEADINGS = ["このプレーの何が面白いか", "展開", "守備の読み"] as const;
export const COMPONENT_HEADINGS = ["何か", "見分け方"] as const;

function missingHeadings(file: string, body: string, required: readonly string[]): Finding[] {
  const found = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]!.trim());
  return required
    .filter((heading) => !found.includes(heading))
    .map((heading) => error(file, `missing heading "${heading}"`));
}

export function validate(plays: ParsedPlay[], components: ParsedComponent[]): Finding[] {
  const findings: Finding[] = [];

  const known = new Set(components.map(({ kind, slug }) => `${kind}/${slug}`));
  const exists = (kind: string, slug: string) => known.has(`${kind}/${slug}`);

  for (const { file, kind, slug, data, body } of components) {
    if (!SLUG.test(slug)) {
      findings.push(error(file, "the file name is not a slug"));
    }
    if (data.kind !== kind) {
      findings.push(error(file, `kind: ${data.kind} does not match the directory ${kind}`));
    }
    if (data.variant_of === slug) {
      findings.push(error(file, "variant_of points at the part itself"));
    } else if (data.variant_of !== null && !exists(kind, data.variant_of)) {
      findings.push(
        error(
          file,
          `variant_of: ${data.variant_of} does not exist under content/components/${kind}/`,
        ),
      );
    }
    findings.push(...missingHeadings(file, body, COMPONENT_HEADINGS));
  }

  const playSlugs = new Set(plays.map((play) => play.slug));

  for (const { file, slug, data, body } of plays) {
    if (!SLUG.test(slug)) {
      findings.push(error(file, "the file name is not a slug"));
    }
    for (const kind of PLAY_KINDS) {
      for (const slug of data.components[kind] ?? []) {
        if (!exists(kind, slug)) {
          findings.push(
            error(
              file,
              `components.${kind}: ${slug} does not exist under content/components/${kind}/`,
            ),
          );
        }
      }
    }
    if (!exists("coverage", data.vs.coverage)) {
      findings.push(
        error(
          file,
          `vs.coverage: ${data.vs.coverage} does not exist under content/components/coverage/`,
        ),
      );
    }
    if (data.vs.confidence === "low") {
      findings.push(warning(file, "vs.confidence is low"));
    }
    if (data.builds_on !== null && !playSlugs.has(data.builds_on)) {
      findings.push(warning(file, `builds_on: ${data.builds_on} does not exist (yet)`));
    }
    if (data.game.away === UNKNOWN_TEAM || data.game.home === UNKNOWN_TEAM) {
      findings.push(warning(file, "game has an unknown team"));
    }
    if (platformOf(data.video.url) === null) {
      findings.push(warning(file, `video.url: the site has no embed for ${data.video.url}`));
    }
    findings.push(...missingHeadings(file, body, PLAY_HEADINGS));
  }

  return findings;
}
