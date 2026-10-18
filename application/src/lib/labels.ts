// The words the pages show for values of the model.
import { UNKNOWN_TEAM, type Kind, type Play } from "../content/schema.ts";

export const KIND_LABEL: Record<Kind, string> = {
  formation: "Formation",
  motion: "Motion",
  run: "Run",
  pass: "Pass",
  action: "Action",
};

const team = (name: string) => (name === UNKNOWN_TEAM ? "Unknown" : name);

/** `2026 Bills @ Rams`, with an unknown team shown as such. */
export function gameLabel({ season, away, home }: Play["game"]): string {
  return `${season} ${team(away)} @ ${team(home)}`;
}
