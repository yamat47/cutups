// The relations of DATA_MODEL.md, derived from shared parts at build time. Nothing
// here is written by hand in the content except `builds_on`, read in reverse.
import { PLAY_KINDS, type Component, type Kind, type Play } from "../content/schema.ts";

export interface PlayEntry {
  slug: string;
  data: Play;
}

export interface PartRef {
  kind: Kind;
  slug: string;
}

export interface PartEntry extends PartRef {
  data: Component;
}

/** The parts a play is composed of, in the order of PLAY_KINDS. `vs` is not one of them. */
export function partsOf(play: Play): PartRef[] {
  return PLAY_KINDS.flatMap((kind) =>
    (play.components[kind] ?? []).map((slug) => ({ kind, slug })),
  );
}

/** The coverage the defense showed, as a reference to its part. */
export function vsOf(play: Play): PartRef {
  return { kind: "coverage", slug: play.vs.coverage };
}

/** Every play that has the part; for a coverage, every play whose `vs` showed it. */
export function playsWithPart<T extends PlayEntry>(
  plays: readonly T[],
  { kind, slug }: PartRef,
): T[] {
  if (kind === "coverage") return plays.filter((play) => vsOf(play.data).slug === slug);
  return plays.filter((play) => play.data.components[kind]?.includes(slug) ?? false);
}

/**
 * The whole family below a part: its variants, their variants and so on, nearest first,
 * so that a part page and "same scheme" agree on what a family is. A cycle stops where
 * it would repeat.
 */
export function variantsOf<T extends PartEntry>(parts: readonly T[], { kind, slug }: PartRef): T[] {
  const found: T[] = [];
  const seen = new Set([slug]);
  for (let parents = [slug]; parents.length > 0;) {
    const children = parts.filter(
      (part) =>
        part.kind === kind &&
        part.data.variant_of !== null &&
        parents.includes(part.data.variant_of) &&
        !seen.has(part.slug),
    );
    for (const child of children) seen.add(child.slug);
    found.push(...children);
    parents = children.map((child) => child.slug);
  }
  return found;
}

/**
 * A lookup from a part to the top of its `variant_of` chain, which stands for the whole
 * family. A part that is no one's variant is its own family. validate rejects a part
 * that is its own parent; a longer cycle stops where it would repeat.
 */
export function familyLookup(parts: readonly PartEntry[]): (ref: PartRef) => string {
  const parentOf = new Map(
    parts.map((part) => [`${part.kind}/${part.slug}`, part.data.variant_of]),
  );
  return ({ kind, slug }) => {
    const seen = new Set([slug]);
    let current = slug;
    let parent = parentOf.get(`${kind}/${current}`);
    while (parent && !seen.has(parent)) {
      seen.add(parent);
      current = parent;
      parent = parentOf.get(`${kind}/${current}`);
    }
    return current;
  };
}

// Formation and motion together are the picture the defense sees before the snap.
// A play that names neither has no picture to share.
function pictureOf(play: Play): string | null {
  const formation = play.components.formation ?? [];
  const motion = play.components.motion ?? [];
  if (formation.length + motion.length === 0) return null;
  return `${formation.toSorted().join("+")}/${motion.toSorted().join("+")}`;
}

/** Same picture, different play: the plays with the same formation and the same motion. */
export function samePicture<T extends PlayEntry>(plays: readonly T[], play: PlayEntry): T[] {
  const picture = pictureOf(play.data);
  if (picture === null) return [];
  return plays.filter((other) => other.slug !== play.slug && pictureOf(other.data) === picture);
}

export interface Scheme<T> {
  kind: "run" | "pass";
  /** The family the plays share, named by the top of its `variant_of` chain. */
  family: string;
  plays: T[];
}

/**
 * Same scheme: the other plays that share a run or a pass with this one, one group per
 * shared family. A variant counts as its family, so GY Counter meets Counter Solid.
 */
export function sameScheme<T extends PlayEntry>(
  plays: readonly T[],
  parts: readonly PartEntry[],
  play: PlayEntry,
): Scheme<T>[] {
  const familyOf = familyLookup(parts);
  const families = (entry: PlayEntry, kind: "run" | "pass") =>
    new Set((entry.data.components[kind] ?? []).map((slug) => familyOf({ kind, slug })));

  return (["run", "pass"] as const).flatMap((kind) => {
    const others = plays
      .filter((other) => other.slug !== play.slug)
      .map((other) => ({ other, families: families(other, kind) }));
    return [...families(play, kind)].flatMap((family) => {
      const matches = others
        .filter(({ families }) => families.has(family))
        .map(({ other }) => other);
      return matches.length > 0 ? [{ kind, family, plays: matches }] : [];
    });
  });
}

/** Counters: the plays whose `builds_on` names this one. */
export function buildsOnThis<T extends PlayEntry>(plays: readonly T[], play: PlayEntry): T[] {
  return plays.filter((other) => other.data.builds_on === play.slug);
}
