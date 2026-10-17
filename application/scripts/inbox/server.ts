// A page for the author's machine only: drop a video, paste its URL, and the
// sidecar is filled from the platform (scripts/inbox/lookup.ts) and written next
// to the video under inbox/, ready for /ingest-play. `make inbox` runs it.
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { parse, stringify } from "yaml";
import { SLUG, platformOf } from "../../src/content/schema.ts";
import { lookup } from "./lookup.ts";

const INBOX = "inbox";
const PORT = 4322;

// A sidecar written by hand may not parse; the row then shows the error, so the
// page stays usable for the other entries.
function entries(): { name: string; url: string }[] {
  if (!existsSync(INBOX)) return [];
  return readdirSync(INBOX)
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => {
      const name = basename(file, ".yaml");
      try {
        const sidecar = parse(readFileSync(join(INBOX, file), "utf8")) as { url?: unknown } | null;
        return { name, url: String(sidecar?.url ?? "") };
      } catch (cause) {
        return {
          name,
          url: `(${file} does not parse: ${cause instanceof Error ? cause.message : String(cause)})`,
        };
      }
    });
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function page(saved: string | null): string {
  const rows = entries()
    .map(({ name, url }) => {
      const platform = url.startsWith("http") ? platformOf(url) : null;
      const link = url.startsWith("http")
        ? `<a href="${escape(url)}">${escape(url)}</a>`
        : `<span class="muted">${escape(url)}</span>`;
      return `<li><span class="badge ${platform ?? "none"}">${platform ?? "?"}</span><code>${escape(name)}</code>${link}</li>`;
    })
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>cutups inbox</title>
<style>
  :root {
    --bg: #f4f5f7; --card: #fff; --ink: #1c1f24; --muted: #6b7280; --line: #e3e6ea;
    --accent: #1f3a5f; --accent-ink: #fff; --ok: #1b7f4b; --ok-bg: #e7f6ee; --warn: #9a5b00; --warn-bg: #fff4e0;
    --field: #fff; --shadow: 0 1px 2px rgba(16, 24, 40, .06), 0 8px 24px rgba(16, 24, 40, .06);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #121417; --card: #1b1e23; --ink: #e8eaed; --muted: #9aa3ad; --line: #2c3139;
      --accent: #8ab4f8; --accent-ink: #0b1220; --ok: #6fcf97; --ok-bg: #12301f; --warn: #f2c14e; --warn-bg: #332a12;
      --field: #14171b; --shadow: 0 1px 2px rgba(0, 0, 0, .4), 0 8px 24px rgba(0, 0, 0, .35);
    }
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 44rem; margin: 0 auto; padding: 3rem 1rem 4rem; }
  header { display: flex; align-items: baseline; gap: .75rem; margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; letter-spacing: -.01em; }
  header p { margin: 0; color: var(--muted); }
  .card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; box-shadow: var(--shadow); padding: 1.5rem; }
  .saved { display: flex; gap: .6rem; align-items: center; background: var(--ok-bg); color: var(--ok); border-radius: 10px; padding: .7rem 1rem; margin-bottom: 1.25rem; }
  .saved code { color: inherit; }
  fieldset { border: 0; padding: 0; margin: 0 0 1.5rem; }
  legend { font-weight: 650; font-size: .95rem; margin-bottom: .5rem; display: flex; align-items: center; gap: .5rem; }
  .step { display: inline-grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-size: .8rem; font-weight: 700; }
  label { display: block; font-size: .85rem; color: var(--muted); margin: .75rem 0 .3rem; }
  input[type=url], input[type=text], textarea {
    width: 100%; font: inherit; color: var(--ink); background: var(--field);
    border: 1px solid var(--line); border-radius: 8px; padding: .55rem .7rem; transition: border-color .15s, box-shadow .15s;
  }
  input:focus, textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent); }
  textarea { min-height: 7.5rem; resize: vertical; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }
  @media (max-width: 36rem) { .grid { grid-template-columns: 1fr; } }
  .status { font-size: .85rem; margin: .4rem 0 0; min-height: 1.4rem; color: var(--muted); }
  .status.ok { color: var(--ok); }
  .status.warn { color: var(--warn); }
  .drop { position: relative; border: 2px dashed var(--line); border-radius: 10px; padding: 1.5rem 1rem; text-align: center; color: var(--muted); transition: border-color .15s, background .15s; }
  .drop.over { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent); }
  .drop.has { border-style: solid; color: var(--ink); }
  .drop input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  .drop strong { color: var(--ink); }
  button { font: inherit; font-weight: 650; background: var(--accent); color: var(--accent-ink); border: 0; border-radius: 10px; padding: .7rem 1.2rem; cursor: pointer; width: 100%; }
  button:hover { filter: brightness(1.08); }
  h2 { font-size: 1rem; margin: 2.5rem 0 .75rem; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: grid; grid-template-columns: auto auto 1fr; gap: .75rem; align-items: center; padding: .6rem .25rem; border-bottom: 1px solid var(--line); }
  li a { color: var(--accent); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  li a:hover { text-decoration: underline; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .9em; }
  .badge { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; padding: .15rem .45rem; border-radius: 999px; background: var(--line); color: var(--muted); }
  .badge.instagram { background: #fde7ef; color: #b3236b; }
  .badge.x { background: var(--ink); color: var(--card); }
  .muted { color: var(--muted); }
  .empty { color: var(--muted); padding: .6rem .25rem; }
</style>
</head>
<body>
<main>
  <header><h1>cutups inbox</h1><p>a video and its URL in, a play out</p></header>
  ${saved ? `<p class="saved">✓ Saved <code>${escape(saved)}</code>. Next: <code>/ingest-play</code> in Claude Code.</p>` : ""}
  <form class="card" method="post" enctype="multipart/form-data">
    <fieldset>
      <legend><span class="step">1</span> Where it was posted</legend>
      <input id="url" name="url" type="url" required placeholder="https://www.instagram.com/reel/…" autocomplete="off">
      <p id="status" class="status">Paste the URL and the author and caption are filled in.</p>
    </fieldset>
    <fieldset>
      <legend><span class="step">2</span> The video</legend>
      <div id="drop" class="drop">
        <input id="video" name="video" type="file" accept="video/*" required>
        <span id="drop-text">Drop the file here, or click to choose</span>
      </div>
    </fieldset>
    <fieldset>
      <legend><span class="step">3</span> Details</legend>
      <div class="grid">
        <div>
          <label for="name">Name under inbox/</label>
          <input id="name" name="name" type="text" required pattern="${SLUG.source.slice(1, -1)}" spellcheck="false">
        </div>
        <div>
          <label for="author">Author</label>
          <input id="author" name="author" type="text" required spellcheck="false">
        </div>
      </div>
      <label for="caption">Caption, verbatim</label>
      <textarea id="caption" name="caption"></textarea>
      <label for="note">Note (optional)</label>
      <textarea id="note" name="note" style="min-height: 4rem"></textarea>
    </fieldset>
    <button type="submit">Save to inbox</button>
  </form>
  <h2>In the inbox</h2>
  ${rows ? `<ul>${rows}</ul>` : `<p class="empty">Nothing yet.</p>`}
</main>
<script>
  const field = (id) => document.getElementById(id);
  const status = (text, kind) => { field("status").textContent = text; field("status").className = "status " + (kind || ""); };
  field("url").addEventListener("change", async () => {
    status("Looking up…");
    const response = await fetch("/api/lookup?url=" + encodeURIComponent(field("url").value)).catch(() => null);
    if (!response || !response.ok) {
      status("Nothing found for this URL; fill in the details by hand.", "warn");
      return;
    }
    const found = await response.json();
    field("name").value = found.name;
    field("author").value = found.author;
    field("caption").value = found.caption;
    status("Filled in from " + new URL(field("url").value).hostname + ". Check the details below.", "ok");
  });
  const drop = field("drop");
  const show = () => {
    const file = field("video").files[0];
    if (!file) return;
    drop.classList.add("has");
    field("drop-text").innerHTML = "<strong>" + file.name.replace(/[&<]/g, "") + "</strong> · " + (file.size / 1048576).toFixed(1) + " MB";
  };
  field("video").addEventListener("change", show);
  for (const type of ["dragenter", "dragover"]) drop.addEventListener(type, (event) => { event.preventDefault(); drop.classList.add("over"); });
  for (const type of ["dragleave", "drop"]) drop.addEventListener(type, () => drop.classList.remove("over"));
  drop.addEventListener("drop", (event) => { event.preventDefault(); field("video").files = event.dataTransfer.files; show(); });
</script>
</body>
</html>`;
}

// The web Request parses the multipart body; a streamed body needs duplex: "half".
function formOf(request: IncomingMessage): Promise<FormData> {
  return new Request("http://inbox", {
    method: "POST",
    headers: { "content-type": request.headers["content-type"] ?? "" },
    body: Readable.toWeb(request) as ReadableStream,
    duplex: "half",
  } as RequestInit).formData();
}

async function save(request: IncomingMessage): Promise<string> {
  const form = await formOf(request);
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = text("name");
  if (!SLUG.test(name)) throw new Error("name is not a slug");
  const video = form.get("video");
  if (!(video instanceof File) || video.size === 0) throw new Error("no video");
  // The inbox is gitignored, so an overwritten video has no other copy; refusing
  // is cheaper than losing it, and deleting the old files by hand is one command.
  if (existsSync(join(INBOX, `${name}.yaml`))) {
    throw new Error(
      `${name} is already in the inbox; delete inbox/${name}.* first or pick another name`,
    );
  }
  mkdirSync(INBOX, { recursive: true });
  // The DOM and node:stream/web ReadableStream types differ in name only.
  await pipeline(
    Readable.fromWeb(video.stream() as unknown as NodeReadableStream),
    createWriteStream(join(INBOX, `${name}.mp4`)),
  );
  const sidecar = {
    url: text("url"),
    author: text("author"),
    caption: text("caption"),
    note: text("note"),
  };
  await writeFile(join(INBOX, `${name}.yaml`), stringify(sidecar));
  return name;
}

function send(response: ServerResponse, status: number, type: string, body: string) {
  response.writeHead(status, { "content-type": `${type}; charset=utf-8` });
  response.end(body);
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://inbox");
  try {
    if (request.method === "GET" && url.pathname === "/api/lookup") {
      const found = await lookup(url.searchParams.get("url") ?? "");
      if (!found) return send(response, 404, "text/plain", "not found");
      return send(response, 200, "application/json", JSON.stringify(found));
    }
    if (request.method === "POST" && url.pathname === "/") {
      const name = await save(request);
      response.writeHead(303, { location: `/?saved=${encodeURIComponent(name)}` });
      return response.end();
    }
    if (request.method === "GET" && url.pathname === "/") {
      return send(response, 200, "text/html", page(url.searchParams.get("saved")));
    }
    return send(response, 404, "text/plain", "not found");
  } catch (cause) {
    return send(
      response,
      400,
      "text/plain",
      cause instanceof Error ? cause.message : String(cause),
    );
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`inbox: http://localhost:${PORT}/`);
});
