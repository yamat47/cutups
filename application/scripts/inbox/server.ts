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
import { SLUG } from "../../src/content/schema.ts";
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
    .map(
      ({ name, url }) =>
        `<tr><td><code>${escape(name)}</code></td><td>${url.startsWith("http") ? `<a href="${escape(url)}">${escape(url)}</a>` : escape(url)}</td></tr>`,
    )
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>cutups inbox</title>
<style>
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 48rem; margin: 2rem auto; padding: 0 1rem; }
  label { display: block; margin-top: 1rem; font-weight: 600; }
  input, textarea { width: 100%; box-sizing: border-box; font: inherit; padding: .4rem; }
  textarea { min-height: 7rem; }
  button { margin-top: 1rem; font: inherit; padding: .5rem 1rem; }
  #status { color: #666; margin-top: .5rem; }
  .saved { background: #e6f4ea; padding: .5rem 1rem; }
  table { border-collapse: collapse; margin-top: 2rem; width: 100%; }
  td, th { text-align: left; padding: .3rem .5rem; border-bottom: 1px solid #ddd; }
</style>
</head>
<body>
<h1>inbox</h1>
${saved ? `<p class="saved">Saved <code>${escape(saved)}</code>. Next: <code>/ingest-play</code> in Claude Code.</p>` : ""}
<form method="post" enctype="multipart/form-data">
  <label for="url">URL</label>
  <input id="url" name="url" type="url" required placeholder="https://www.instagram.com/reel/...">
  <p id="status"></p>
  <label for="video">Video</label>
  <input id="video" name="video" type="file" accept="video/*" required>
  <label for="name">Name (the file name under inbox/)</label>
  <input id="name" name="name" required pattern="${SLUG.source.slice(1, -1)}">
  <label for="author">Author</label>
  <input id="author" name="author" required>
  <label for="caption">Caption (verbatim)</label>
  <textarea id="caption" name="caption"></textarea>
  <label for="note">Note (optional)</label>
  <textarea id="note" name="note"></textarea>
  <button type="submit">Save to inbox</button>
</form>
<table>
  <tr><th>name</th><th>url</th></tr>
  ${rows}
</table>
<script>
  const field = (id) => document.getElementById(id);
  field("url").addEventListener("change", async () => {
    field("status").textContent = "looking up…";
    const response = await fetch("/api/lookup?url=" + encodeURIComponent(field("url").value)).catch(() => null);
    if (!response || !response.ok) {
      field("status").textContent = "nothing found for this URL; fill in the fields by hand";
      return;
    }
    const found = await response.json();
    field("name").value = found.name;
    field("author").value = found.author;
    field("caption").value = found.caption;
    field("status").textContent = "filled from " + new URL(field("url").value).hostname;
  });
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
