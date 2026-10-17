// Checks content/ with the schema the site uses and the rules in src/lib/validate.ts.
// Warnings print in yellow, errors in red, and the exit code is 1 when there is an error.
import { globSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "astro/zod";
import { CONTENT, componentSchema, playSchema } from "../src/content/schema.ts";
import {
  error,
  validate,
  type Finding,
  type ParsedComponent,
  type ParsedPlay,
} from "../src/lib/validate.ts";

const findings: Finding[] = [];

function readDocument(file: string): { data: unknown; body: string } | null {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) {
    findings.push(error(file, "missing frontmatter"));
    return null;
  }
  try {
    return { data: parseYaml(match[1]!), body: match[2]! };
  } catch (cause) {
    findings.push(error(file, `YAML: ${cause instanceof Error ? cause.message : String(cause)}`));
    return null;
  }
}

/** Reads every file of one content root; the ones that fail the schema become errors and are left out. */
function load<S extends z.ZodType, T>(
  root: { dir: string; pattern: string },
  schema: S,
  build: (file: string, data: z.output<S>, body: string) => T,
): { files: number; items: T[] } {
  const files = globSync(root.pattern, { cwd: root.dir })
    .map((file) => join(root.dir, file))
    .sort();
  const items: T[] = [];
  for (const file of files) {
    const document = readDocument(file);
    if (!document) continue;
    const result = schema.safeParse(document.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.length === 0 ? "frontmatter" : issue.path.join(".");
        findings.push(error(file, `${path}: ${issue.message}`));
      }
      continue;
    }
    items.push(build(file, result.data, document.body));
  }
  return { files: files.length, items };
}

const components = load(
  CONTENT.components,
  componentSchema,
  (file, data, body): ParsedComponent => ({
    file,
    kind: basename(dirname(file)),
    slug: basename(file, ".md"),
    data,
    body,
  }),
);
const plays = load(CONTENT.plays, playSchema, (file, data, body): ParsedPlay => ({
  file,
  slug: basename(file, ".md"),
  data,
  body,
}));

findings.push(...validate(plays.items, components.items));

const warnings = findings.filter((finding) => finding.level === "warning");
const errors = findings.filter((finding) => finding.level === "error");
for (const { file, message } of warnings) console.log(`\x1b[33mwarn\x1b[0m ${file}: ${message}`);
for (const { file, message } of errors) console.log(`\x1b[31merror\x1b[0m ${file}: ${message}`);
if (findings.length > 0) console.log();
console.log(
  `${plays.files} plays, ${components.files} components: ${errors.length} errors, ${warnings.length} warnings`,
);
process.exit(errors.length > 0 ? 1 : 0);
