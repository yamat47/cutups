import { describe, expect, it } from "vitest";
import { playSchema, type Component, type Play } from "../content/schema.ts";
import {
  COMPONENT_HEADINGS,
  PLAY_HEADINGS,
  validate,
  type Finding,
  type ParsedComponent,
  type ParsedPlay,
} from "./validate.ts";

const bodyWith = (headings: readonly string[]) =>
  headings.map((heading) => `## ${heading}\n本文。`).join("\n\n");

function component(
  kind: Component["kind"],
  slug: string,
  data: Partial<Component> = {},
): ParsedComponent {
  return {
    file: `content/components/${kind}/${slug}.md`,
    kind,
    slug,
    data: { kind, title: slug, title_ja: slug, aliases: [], variant_of: null, ...data },
    body: bodyWith(COMPONENT_HEADINGS),
  };
}

const basePlay: Play = {
  title: "Y-Short Bunch Trail",
  title_ja: "Yショート・バンチ・トレイル",
  phase: "offense",
  game: { season: 2026, away: "Bills", home: "Rams", level: "nfl", offense: "Bills" },
  components: { formation: ["bunch"], motion: ["y-short"], pass: ["trail"] },
  vs: {
    coverage: "cover-1",
    confidence: "medium",
    evidence: "The nickel follows the short motion and one safety stays deep.",
    front: null,
  },
  builds_on: null,
  video: {
    url: "https://www.instagram.com/reel/DecbK2ZAxuD/",
    author: "playdesignerpro",
    kind: "diagram+film",
    caption: null,
    transcript: null,
  },
};

function play(data: Partial<Play> = {}, body = bodyWith(PLAY_HEADINGS)): ParsedPlay {
  return {
    file: "content/plays/2026-bills-rams-y-short-bunch-trail.md",
    slug: "2026-bills-rams-y-short-bunch-trail",
    data: { ...basePlay, ...data },
    body,
  };
}

const parts = [
  component("formation", "bunch"),
  component("motion", "y-short"),
  component("pass", "trail"),
  component("coverage", "cover-1"),
];

const messages = (findings: Finding[], level: Finding["level"]) =>
  findings.filter((finding) => finding.level === level).map((finding) => finding.message);

it("a play whose parts all exist produces no finding", () => {
  expect(validate([play()], parts)).toEqual([]);
});

describe("references between files", () => {
  it("a component slug with no part file is an error", () => {
    const findings = validate(
      [play({ components: { formation: ["bunch"], pass: ["mesh"] } })],
      parts,
    );
    expect(messages(findings, "error")).toEqual([
      "components.pass: mesh does not exist under content/components/pass/",
    ]);
  });

  it("every slug in a list of parts is checked", () => {
    const findings = validate([play({ components: { action: ["bluff", "play-action"] } })], parts);
    expect(messages(findings, "error")).toEqual([
      "components.action: bluff does not exist under content/components/action/",
      "components.action: play-action does not exist under content/components/action/",
    ]);
  });

  it("a vs.coverage with no coverage part is an error", () => {
    const findings = validate([play({ vs: { ...basePlay.vs, coverage: "cover-3" } })], parts);
    expect(messages(findings, "error")).toEqual([
      "vs.coverage: cover-3 does not exist under content/components/coverage/",
    ]);
  });

  it("a variant_of that exists under the same kind is accepted", () => {
    const run = [
      component("run", "counter"),
      component("run", "gy-counter", { variant_of: "counter" }),
    ];
    expect(validate([], run)).toEqual([]);
  });

  it("a variant_of pointing outside its kind is an error", () => {
    const run = [component("run", "gy-counter", { variant_of: "bunch" })];
    expect(messages(validate([], [...parts, ...run]), "error")).toEqual([
      "variant_of: bunch does not exist under content/components/run/",
    ]);
  });

  it("a variant_of naming the part itself is an error", () => {
    const run = [component("run", "counter", { variant_of: "counter" })];
    expect(messages(validate([], run), "error")).toEqual(["variant_of points at the part itself"]);
  });

  it("a kind that disagrees with the directory is an error", () => {
    const misplaced = component("pass", "wheel", { kind: "action" });
    expect(messages(validate([], [misplaced]), "error")).toEqual([
      "kind: action does not match the directory pass",
    ]);
  });

  it("a builds_on naming a play that does not exist yet is a warning", () => {
    const findings = validate([play({ builds_on: "2026-rams-bills-bunch-corner" })], parts);
    expect(findings).toEqual([
      {
        level: "warning",
        file: "content/plays/2026-bills-rams-y-short-bunch-trail.md",
        message: "builds_on: 2026-rams-bills-bunch-corner does not exist (yet)",
      },
    ]);
  });

  it("a builds_on naming another play in the tree is accepted", () => {
    const other = { ...play(), slug: "2026-rams-bills-bunch-corner" };
    const findings = validate([play({ builds_on: "2026-rams-bills-bunch-corner" }), other], parts);
    expect(findings).toEqual([]);
  });
});

describe("file names", () => {
  it("a play file whose name is not a slug is an error", () => {
    const upper = { ...play(), slug: "2026-Bills-Rams-Y-Short-Bunch-Trail" };
    expect(messages(validate([upper], parts), "error")).toEqual(["the file name is not a slug"]);
  });

  it("a component file whose name is not a slug is an error", () => {
    const upper = { ...component("pass", "trail"), slug: "Trail" };
    expect(messages(validate([], [upper]), "error")).toEqual(["the file name is not a slug"]);
  });
});

describe("body headings", () => {
  it("a play missing one of its three headings is an error", () => {
    const body = bodyWith(PLAY_HEADINGS.slice(0, 2));
    expect(messages(validate([play({}, body)], parts), "error")).toEqual([
      `missing heading "${PLAY_HEADINGS[2]}"`,
    ]);
  });

  it("a component missing one of its two headings is an error", () => {
    const part = { ...component("pass", "trail"), body: bodyWith(COMPONENT_HEADINGS.slice(0, 1)) };
    expect(messages(validate([], [part]), "error")).toEqual([
      `missing heading "${COMPONENT_HEADINGS[1]}"`,
    ]);
  });
});

describe("warnings about the evidence", () => {
  it("confidence low is a warning", () => {
    const findings = validate([play({ vs: { ...basePlay.vs, confidence: "low" } })], parts);
    expect(messages(findings, "warning")).toEqual(["vs.confidence is low"]);
    expect(messages(findings, "error")).toEqual([]);
  });

  it("an unknown away team is a warning", () => {
    const findings = validate([play({ game: { ...basePlay.game, away: "unknown" } })], parts);
    expect(messages(findings, "warning")).toEqual(["game has an unknown team"]);
  });

  it("a video.url outside instagram.com, x.com and twitter.com is a warning", () => {
    const url = "https://www.youtube.com/watch?v=abc";
    const findings = validate([play({ video: { ...basePlay.video, url } })], parts);
    expect(messages(findings, "warning")).toEqual([`video.url: the site has no embed for ${url}`]);
  });

  it("a video.url on x.com is accepted", () => {
    const url = "https://x.com/playdesignerpro/status/1";
    expect(validate([play({ video: { ...basePlay.video, url } })], parts)).toEqual([]);
  });
});

describe("the play schema", () => {
  it("a lone slug under components comes out as a list", () => {
    const result = playSchema.parse({ ...basePlay, components: { formation: "bunch" } });
    expect(result.components).toEqual({ formation: ["bunch"] });
  });

  it("an empty components is an error", () => {
    const result = playSchema.safeParse({ ...basePlay, components: {} });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "components is empty; a play has at least one part",
    ]);
  });

  it("coverage under components is an error, since the defense goes in vs", () => {
    const result = playSchema.safeParse({ ...basePlay, components: { coverage: "cover-1" } });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ code: "unrecognized_keys", keys: ["coverage"] }),
    );
  });

  it("vs.evidence shorter than ten characters is an error", () => {
    const result = playSchema.safeParse({ ...basePlay, vs: { ...basePlay.vs, evidence: "guess" } });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(["missing or too short"]);
  });

  it("a game.offense that is neither team is an error", () => {
    const game = { ...basePlay.game, offense: "Bils" };
    const result = playSchema.safeParse({ ...basePlay, game });
    expect(result.success).toBe(false);
    expect(result.error?.issues).toMatchObject([{ path: ["game", "offense"] }]);
  });
});
