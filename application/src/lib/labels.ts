// The words the pages show for values of the model. The readers are Japanese.
import { UNKNOWN_TEAM, type Kind, type Play } from "../content/schema.ts";

export const KIND_LABEL: Record<Kind, string> = {
  formation: "フォーメーション",
  motion: "モーション",
  run: "ラン",
  pass: "パス",
  action: "アクション",
  coverage: "カバレッジ",
};

export const CONFIDENCE_LABEL: Record<Play["vs"]["confidence"], string> = {
  high: "確度 高",
  medium: "確度 中",
  low: "確度 低（推測）",
};

const team = (name: string) => (name === UNKNOWN_TEAM ? "不明" : name);

/** `2026 Bills @ Rams`, with an unknown team shown as such. */
export function gameLabel({ season, away, home }: Play["game"]): string {
  return `${season} ${team(away)} @ ${team(home)}`;
}

/** The heading over the plays on a part's page. A coverage is met by plays, not used in them. */
export function playsWithPartHeading(kind: Kind): string {
  return kind === "coverage" ? "この守備に対して使われたプレー" : "このパーツを使うプレー";
}
