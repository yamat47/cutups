// What can be learned about a video from its URL alone: the author and the
// caption, through the platform's oEmbed endpoint. The video file itself is still
// handed over by the author; neither platform serves it without a login.
//
// Usage from the shell: node scripts/inbox/lookup.ts <url>, which prints the JSON.
import { fileURLToPath } from "node:url";
import { platformOf } from "../../src/content/schema.ts";

export interface Lookup {
  author: string;
  caption: string;
  /** A file name for the inbox, `{author}-{id}`, which the author may change. */
  name: string;
}

// Instagram's endpoint is the one its own embed code calls; it is not documented,
// so it may stop answering one day, and the page then falls back to typing.
const endpoints = {
  instagram: (url: string) =>
    `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`,
  x: (url: string) =>
    `https://publish.twitter.com/oembed?omit_script=1&url=${encodeURIComponent(url)}`,
};

export function nameFor(author: string, url: string): string {
  const id = new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "";
  return `${author}-${id}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The caption of a tweet, from the blockquote that X's oEmbed returns as `html`. */
export function captionFromTweetHtml(html: string): string {
  const paragraph = html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";
  return paragraph
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

const str = (value: unknown) => (typeof value === "string" ? value : "");

export async function lookup(
  url: string,
  fetchJson: (endpoint: string) => Promise<unknown> = defaultFetchJson,
): Promise<Lookup | null> {
  const platform = platformOf(url);
  if (platform === null) return null;
  const data = (await fetchJson(endpoints[platform](url))) as Record<string, unknown> | null;
  // Instagram puts the handle in author_name; X puts the display name there and
  // the handle at the end of author_url. The sidecar wants the handle.
  const author =
    platform === "x" ? (str(data?.author_url).split("/").at(-1) ?? "") : str(data?.author_name);
  if (!author) return null;
  const caption =
    platform === "instagram" ? str(data?.title) : captionFromTweetHtml(str(data?.html));
  return { author, caption, name: nameFor(author, url) };
}

async function defaultFetchJson(endpoint: string): Promise<unknown> {
  const response = await fetch(endpoint, { headers: { "user-agent": "cutups-inbox" } });
  if (!response.ok) return null;
  return response.json();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) {
    console.error("usage: node scripts/inbox/lookup.ts <url>");
    process.exit(2);
  }
  const found = await lookup(process.argv[2]);
  if (!found) {
    console.error("nothing found for this URL");
    process.exit(1);
  }
  console.log(JSON.stringify(found, null, 2));
}
