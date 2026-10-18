import { describe, expect, it } from "vitest";
import type { Component, Play } from "../content/schema.ts";
import {
  buildsOnThis,
  derivedPlays,
  playsWithFamily,
  familyLookup,
  partsOf,
  playsWithPart,
  samePicture,
  sameScheme,
  variantsOf,
  type PartEntry,
  type PlayEntry,
} from "./relations.ts";

function play(
  slug: string,
  components: Play["components"],
  data: Partial<Omit<Play, "components">> = {},
): PlayEntry {
  return {
    slug,
    data: {
      title: slug,
      phase: "offense",
      game: { season: 2026, away: "Bills", home: "Rams", level: "nfl", offense: "Bills" },
      components,
      builds_on: null,
      video: {
        url: "https://www.instagram.com/reel/abc/",
        author: "playdesignerpro",
        kind: "diagram+film",
        caption: null,
        transcript: null,
      },
      ...data,
    },
  };
}

function part(kind: Component["kind"], slug: string, variant_of: string | null = null): PartEntry {
  return {
    kind,
    slug,
    data: { kind, title: slug, aliases: [], variant_of },
  };
}

const slugs = (entries: readonly { slug: string }[]) => entries.map((entry) => entry.slug);

const runs = [
  part("run", "counter"),
  part("run", "gy-counter", "counter"),
  part("run", "counter-solid", "counter"),
  part("run", "split-zone"),
];

describe("partsOf", () => {
  it("lists every part of a play in the order of the kinds, lists included", () => {
    const parts = partsOf(
      play("p", { action: ["bluff", "play-action"], formation: ["bunch"], pass: ["wheel"] }).data,
    );
    expect(parts).toEqual([
      { kind: "formation", slug: "bunch" },
      { kind: "pass", slug: "wheel" },
      { kind: "action", slug: "bluff" },
      { kind: "action", slug: "play-action" },
    ]);
  });
});

describe("playsWithPart", () => {
  it("finds a part inside a list of parts", () => {
    const plays = [
      play("a", { action: ["bluff", "play-action"] }),
      play("b", { action: ["boot"] }),
    ];
    expect(slugs(playsWithPart(plays, { kind: "action", slug: "play-action" }))).toEqual(["a"]);
  });

  it("the same slug under another kind does not count", () => {
    const plays = [play("a", { action: ["reverse"] }), play("b", { run: ["reverse"] })];
    expect(slugs(playsWithPart(plays, { kind: "run", slug: "reverse" }))).toEqual(["b"]);
  });
});

describe("variantsOf and familyLookup", () => {
  it("a parent lists the parts that name it in variant_of", () => {
    expect(slugs(variantsOf(runs, { kind: "run", slug: "counter" }))).toEqual([
      "gy-counter",
      "counter-solid",
    ]);
  });

  it("a parent lists the variants of its variants too, nearest first", () => {
    const chain = [...runs, part("run", "gy-counter-bash", "gy-counter")];
    expect(slugs(variantsOf(chain, { kind: "run", slug: "counter" }))).toEqual([
      "gy-counter",
      "counter-solid",
      "gy-counter-bash",
    ]);
  });

  it("a cycle in variant_of does not list a part twice", () => {
    const cycle = [part("run", "a", "b"), part("run", "b", "a")];
    expect(slugs(variantsOf(cycle, { kind: "run", slug: "a" }))).toEqual(["b"]);
  });

  it("a variant belongs to its parent's family and a part with no parent is its own", () => {
    expect(familyLookup(runs)({ kind: "run", slug: "gy-counter" })).toBe("counter");
    expect(familyLookup(runs)({ kind: "run", slug: "split-zone" })).toBe("split-zone");
  });

  it("a variant of a variant belongs to the top of the chain", () => {
    const chain = [...runs, part("run", "gy-counter-bash", "gy-counter")];
    expect(familyLookup(chain)({ kind: "run", slug: "gy-counter-bash" })).toBe("counter");
  });

  it("a cycle in variant_of stops instead of looping", () => {
    const cycle = [part("run", "a", "b"), part("run", "b", "a")];
    expect(["a", "b"]).toContain(familyLookup(cycle)({ kind: "run", slug: "a" }));
  });

  it("a part missing from the list is its own family", () => {
    expect(familyLookup(runs)({ kind: "run", slug: "power" })).toBe("power");
  });
});

describe("samePicture", () => {
  it("matches the same formation and motion with a different concept, not the play itself", () => {
    const trail = play("trail", { formation: ["bunch"], motion: ["y-short"], pass: ["trail"] });
    const plays = [
      trail,
      play("corner", { formation: ["bunch"], motion: ["y-short"], pass: ["corner"] }),
      play("no-motion", { formation: ["bunch"], pass: ["corner"] }),
      play("other", { formation: ["2x2"], motion: ["y-short"], pass: ["trail"] }),
    ];
    expect(slugs(samePicture(plays, trail))).toEqual(["corner"]);
  });

  it("a formation with no motion matches another formation with no motion", () => {
    const rpo = play("rpo", { formation: ["2x2"], run: ["split-zone"], action: ["rpo"] });
    const plays = [rpo, play("switch", { formation: ["2x2"], pass: ["switch-release"] })];
    expect(slugs(samePicture(plays, rpo))).toEqual(["switch"]);
  });

  it("a play with neither formation nor motion has no picture to share", () => {
    const boot = play("boot", { run: ["split-zone"], action: ["boot"] });
    const plays = [boot, play("counter", { run: ["gy-counter"], action: ["throwback"] })];
    expect(samePicture(plays, boot)).toEqual([]);
  });
});

describe("sameScheme", () => {
  it("groups the plays sharing a run, the play itself left out", () => {
    const boot = play("boot", { run: ["split-zone"], action: ["boot"] });
    const plays = [
      boot,
      play("rpo", { run: ["split-zone"], action: ["rpo"] }),
      play("bunch", { pass: ["trail"] }),
    ];
    expect(sameScheme(plays, runs, boot)).toEqual([
      { kind: "run", family: "split-zone", plays: [plays[1]] },
    ]);
  });

  it("variants of one parent count as the same scheme", () => {
    const gy = play("gy", { run: ["gy-counter"] });
    const plays = [
      gy,
      play("solid", { run: ["counter-solid"] }),
      play("counter", { run: ["counter"] }),
    ];
    expect(sameScheme(plays, runs, gy)).toEqual([
      { kind: "run", family: "counter", plays: [plays[1], plays[2]] },
    ]);
  });

  it("a play with two runs gets one group per shared run", () => {
    const delaware = play("delaware", { run: ["gy-counter", "reverse"] });
    const plays = [
      delaware,
      play("sugar", { run: ["reverse"] }),
      play("solid", { run: ["counter-solid"] }),
    ];
    expect(sameScheme(plays, [...runs, part("run", "reverse")], delaware)).toEqual([
      { kind: "run", family: "counter", plays: [plays[2]] },
      { kind: "run", family: "reverse", plays: [plays[1]] },
    ]);
  });

  it("a shared action or formation is not a scheme", () => {
    const boot = play("boot", { formation: ["2x2"], action: ["boot"] });
    const plays = [boot, play("other", { formation: ["2x2"], action: ["boot"] })];
    expect(sameScheme(plays, runs, boot)).toEqual([]);
  });
});

describe("buildsOnThis", () => {
  it("finds the plays whose builds_on names this one", () => {
    const base = play("base", { pass: ["trail"] });
    const plays = [
      base,
      play("answer", { pass: ["wheel"] }, { builds_on: "base" }),
      play("unrelated", { pass: ["wheel"] }),
    ];
    expect(slugs(buildsOnThis(plays, base))).toEqual(["answer"]);
  });
});

describe("derivedPlays", () => {
  it("lists each play that shares the picture, a scheme or builds on it once, in feed order", () => {
    const base = play("base", { formation: ["bunch"], run: ["gy-counter"] });
    const plays = [
      play("built", { pass: ["mesh"] }, { builds_on: "base" }),
      play("both", { formation: ["bunch"], run: ["counter"] }),
      base,
      play("picture", { formation: ["bunch"], pass: ["trail"] }),
      play("unrelated", { run: ["split-zone"] }),
    ];
    expect(slugs(derivedPlays(plays, runs, base))).toEqual(["built", "both", "picture"]);
  });
});

describe("playsWithFamily", () => {
  it("counts a variant's plays as the parent's, in feed order, each once", () => {
    const plays = [
      play("gy", { run: ["gy-counter"] }),
      play("zone", { run: ["split-zone"] }),
      play("both", { run: ["counter", "counter-solid"] }),
    ];
    expect(slugs(playsWithFamily(plays, runs, runs[0]!))).toEqual(["gy", "both"]);
  });
});
