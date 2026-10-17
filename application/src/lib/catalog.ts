// The collections as the pages use them: plays and parts with their slugs, and a
// lookup from a part reference to its entry.
import { getCollection, type CollectionEntry } from "astro:content";
import { KINDS } from "../content/schema.ts";
import type { PartEntry, PartRef, PlayEntry } from "./relations.ts";

export type Play = PlayEntry & { entry: CollectionEntry<"plays"> };
export type Part = PartEntry & { entry: CollectionEntry<"components"> };

export interface Catalog {
  /** Newest season first, then by title. */
  plays: Play[];
  /** In the order of KINDS, then by title. */
  parts: Part[];
  /** The part a play or a variant_of refers to. validate guarantees it exists. */
  part(ref: PartRef): Part;
  /** The play a `builds_on` names, which may not be in the catalog yet. */
  play(slug: string): Play | undefined;
}

// Every page calls this rather than sharing one result, so that the dev server picks
// up an edited play; the collections are already in memory, so the cost is a sort.
export async function loadCatalog(): Promise<Catalog> {
  const [playEntries, partEntries] = await Promise.all([
    getCollection("plays"),
    getCollection("components"),
  ]);
  const plays = playEntries
    .map((entry) => ({ slug: entry.id, data: entry.data, entry }))
    .toSorted(
      (a, b) => b.data.game.season - a.data.game.season || a.data.title.localeCompare(b.data.title),
    );
  // The id of a part is `{kind}/{slug}`, its path under content/components.
  const parts = partEntries
    .map((entry) => ({
      kind: entry.data.kind,
      slug: entry.id.slice(entry.id.indexOf("/") + 1),
      data: entry.data,
      entry,
    }))
    .toSorted(
      (a, b) =>
        KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.data.title.localeCompare(b.data.title),
    );

  const byId = new Map(parts.map((part) => [`${part.kind}/${part.slug}`, part]));
  const bySlug = new Map(plays.map((play) => [play.slug, play]));
  return {
    plays,
    parts,
    part({ kind, slug }) {
      const found = byId.get(`${kind}/${slug}`);
      if (!found) throw new Error(`no part at content/components/${kind}/${slug}.md; run validate`);
      return found;
    },
    play(slug) {
      return bySlug.get(slug);
    },
  };
}
