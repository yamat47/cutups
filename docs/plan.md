# Plan

This is a working log, not a specification. The project moves by trial and error with Claude Code: what was decided, what was dropped, what is still open. Rewrite it as things change. It is also the hand-over between sessions, which start with no memory of each other; "How a session starts" below says how to pick up the work from this file alone.

## What this is

A catalog of football play examples. The source material is videos on Instagram and X that diagram one play from one game (playdesignerpro, offensive_guru and similar accounts). Each play is organized by its parts: formation, motion, run scheme, pass concept, action, and the defense the opponent showed. The readers are Japanese coaches and players who come here when they want to add a play. Nothing is translated, but tags and commentary are written in Japanese. Collection is not automated: the author (yamat47) picks the videos and hands them over with their captions.

## How a session starts

1. Read `CLAUDE.md` and this file in full. The draft at the end is reference material; read the part of it that the current step points to.
2. Take the first unticked step under "Next". Confirm its state against the repository before starting: `git log --oneline -20`, the file tree, and the open pull requests, since a step may be half done on a branch. A step that is done but unticked is ticked in the next PR.
3. When the step raises a question this file does not answer, ask the author with `/grill-me` before writing code, and record the answer under "Decided so far" in the same PR.
4. Do that step and nothing else. A problem found outside the step is written under "Still open", not fixed.
5. Before opening the PR, run what CI runs, as far as the scripts exist by then: `npm run check`, `npm test`, `npm run validate`, `npm run build`.
6. Open the PR with `/create-pr`. The same PR ticks the step here, adds what was learned to "Decided so far" or "Tried and dropped", and deletes from the draft at the end every file the PR made real.

Two things differ in Claude Code on the web: pull requests are opened with the GitHub tools, not `gh`, and the Whisper model hosts are blocked, so ingestion (step 5 and after) runs in a local Claude Code.

## Decided so far

### Data model (v0.2.1)

- The repository is the database. One video is one play example is one file in `content/plays/*.md` (YAML frontmatter plus Markdown). There is no server and no external database; the result is a static site.
- The node is a play example, not a concept. Concepts (Bunch, Trail, Cover 1 and so on) are parts in `content/components/{kind}/*.md`, and a play is a composition of parts. Parsing the author's title (`Y-Short Bunch Trail`) gives `motion: y-short`, `formation: bunch`, `pass: trail` directly.
- There are six kinds of part: formation, motion, run, pass, action, coverage. A part file has two headings only, the definition (「何か」) and how to recognize it (「見分け方」). A variant points at its parent with `variant_of` (`gy-counter` and `counter-solid` are both `counter`).
- `vs`, the defense the opponent showed on this play, is required. A guess is allowed, but `coverage`, `confidence` (high / medium / low) and `evidence` always come together. It records what was actually shown, not what the play is meant to beat.
- Relations are never written by hand. "Same picture, different play" (same formation and motion), "same scheme" (same run or pass) and "plays used against this defense" (same vs) are derived at build time from shared parts. The only hand-written relation is `builds_on`, used when the author says the play was designed against another one.
- A play body has three headings: what is interesting about this play, how it unfolds, and how the defense was read. A part page carries the definition once; per-play commentary lives in the play.
- The vocabulary grows from examples. A missing part is added in the same PR as the play. There is no taxonomy designed up front.
- A play's slug is `{season}-{away}-{home}-{title-kebab}`.
- Video files never enter the repository. Only the URL is stored, and the site shows the platform's official embed (Instagram: `<blockquote class="instagram-media" data-instgrm-permalink="URL">` plus embed.js; X: `<blockquote class="twitter-tweet"><a href="URL"></a></blockquote>` plus widgets.js). Both work from the URL alone, so no oEmbed API and no token are needed.
- Play and component bodies are Japanese, for the readers. Everything else in the repository (docs, code, commit messages) is English.

### Ingestion

- The author drops a video and a sidecar with the same name (`url`, `author`, the `caption` verbatim, an optional `note`) into `inbox/` and runs `/ingest-play` in Claude Code. One play is one branch is one PR, and the PR review is the curation step.
- The skill (`.claude/skills/ingest-play/SKILL.md`) fixes the procedure in eight steps: make the material, read every existing part, parse the name, choose the parts, read the defense, write the play, validate, open the PR.
- `scripts/extract.sh` does the deterministic preprocessing: 1 fps tiles, the diagram cut into three high-resolution strips, audio, and a transcript when faster-whisper is available.
- `scripts/validate.ts` parses every frontmatter with the same zod schema the site uses (see Code below) and adds the checks that span files: every referenced part exists, `variant_of` points at a part of the same kind, the body headings are present. A reference that does not exist yet or `confidence: low` is a warning; a missing required field is an error.
- The PR body follows `.claude/skills/ingest-play/pr-template.md` and carries the title-to-parts table, the `vs` evidence and confidence, the reason for each new part, and open questions. Inferences are marked as such. The template lives with the skill because a template under `.github/` would apply to every PR, the skill updates and the Dependabot bumps included.

### Site

- Astro's content collections read `content/` as is, through the glob loader with `content/plays` and `content/components` as its base. Every page is generated at build time.
- There is no client-side JavaScript except the embed scripts of Instagram and X. The relations are derived at build time, so a chip is a plain link. A component becomes an island only when an interaction needs one, and none does yet.
- URLs: `/` is the play list, `/plays/{slug}/` a play, `/{kind}/{slug}/` a part with every play that has it, and `/{kind}/` the parts of one kind. `/coverage/cover-1/` is the list of plays used against Cover 1, the same page shape as any other part.
- The search box is secondary. The main movement is pivoting: a play page shows its parts and its `vs` as chips, and a chip leads to every play that shares it.
- Styling is Astro's scoped `<style>` in each component, plus one `src/styles/global.css` with the custom properties for color, spacing and type. No CSS framework. The look is refined later with the `frontend-design` skill, and those are the two places it touches.
- The site is published on GitHub Pages at `cutups.yamat47.me`. `.github/workflows/deploy.yml` builds on every push to `main` and deploys with `actions/deploy-pages`. The `pages` block and the cname go into the `cutups` entry in infra-github.

### Code

- The draft (playbook-v0.4.zip, in the details at the end) is reference material. The zip itself is gone. The code is written fresh under the rules below, and the content is collected again from zero, one video at a time through `/ingest-play`.
- One package at the repository root: `content/` and `scripts/` at the root, the Astro site in `src/`, one `package.json`.
- Astro 7, which runs on Vite 8 and Rolldown and needs Node 22.22.0 or newer. `.node-version` pins 22.22.0, `engines` in `package.json` says the same, and CI reads the file.
- TypeScript everywhere, `scripts/` included. Node 22 runs `.ts` files with type stripping, so the scripts have no build step. Type stripping wants the `.ts` extension on relative imports and accepts no enums or parameter properties. `tsconfig.json` extends `astro/tsconfigs/strict`.
- The content schema is written once, as zod in `src/content/schema.ts`, with `z` imported from `astro/zod` so that it runs outside Astro too. `src/content.config.ts` hands it to the collections and `scripts/validate.ts` imports it. A new field is added in one place.
- Tests are vitest, and only for logic: the relation derivation in `src/lib/relations.ts` and the rules in validate, each run against small fixtures. Test names state the input and the outcome. Pages and markup are not tested; `astro build` in CI is their check.
- Lint and format are oxlint and oxfmt, the Oxc toolchain that Astro 7 and Vite 8 are built on. oxfmt 0.73 (2026-10-13) formats `.astro` files through `prettier-plugin-astro` and the Astro 7 compiler. oxlint reads only the script part of an `.astro` file. Both run over `src/` and `scripts/` and ignore `content/` and `docs/`: the content's correctness is validate's job, and a formatter would damage the Japanese prose and the YAML comments that mark inferences.
- oxfmt is still a 0.x release, so every dependency is pinned to an exact version. `.github/dependabot.yml` gets an `npm` entry, monthly and grouped into one PR, and the bumps are read with `review-dependency-bump` before merging.
- CI is one workflow, `.github/workflows/ci.yml`, with one job named `check`: `npm ci`, then `npm run check` (astro check, oxlint, oxfmt --check), `npm test`, `npm run validate`, `npm run build`. `check` is the required check in infra-github. Actions are pinned by SHA with the version in a comment, following `github-actions-workflows`.
- The phase-2 `ingest.yml` stub is not committed. It would fire on the issue label and fail, since nothing hands it the video or an API key. It stays in the draft below as a memo.

### Skills for Claude Code

- General-purpose skills come from [yamat47/github-toolkit](https://github.com/yamat47/github-toolkit), installed into `.claude/skills/` with `gh skill install yamat47/github-toolkit <name> --agent claude-code --scope project` (gh 2.90.0 or newer). They are unpinned, so `gh skill update --all` moves them to the latest release. The `metadata` block that `gh` writes into each `SKILL.md` records the source; do not edit installed skills by hand, since changes belong in github-toolkit.
- Installed from v1.10.0: `writing-conventions` (commit, PR and docs style, including the rules for Japanese prose), `create-pr`, `review-pr`, `grill-me` (used for the Code section above, and for the open questions below), `github-actions-workflows` (for `ci.yml` and `deploy.yml`), `skill-creator` (for refining `ingest-play` as reviews correct it), and `review-skill-update` and `review-dependency-bump` (for the update PRs below).
- `.github/workflows/update-skills.yml` calls github-toolkit's `update-skills` reusable workflow monthly and opens one PR when a release changes an installed skill. Dependabot (`.github/dependabot.yml`) bumps the workflow's own `@vX.Y.Z` pin. The workflow needs "Allow GitHub Actions to create and approve pull requests", which is requested in infra-github.
- `ingest-play` is this repository's own skill and lives next to them in `.claude/skills/`.
- `.claude/settings.json` turns off the commit and PR attribution that Claude Code adds by itself. Commits are authored by yamat47.

## Tried and dropped

- v0.1 made concepts the nodes, in a tree with hand-written `parent` / `beats` / `pairs_with`. The actual videos turned out to diagram one play from one game rather than explain a concept, and one play is a composition of several concepts (`GY Counter` plus `Reverse` plus `Throwback`), so it does not fit one place in a tree. `situations` (3rd and medium, and so on) and `status: stub` went with it.
- Dify was considered and set aside. The real cost is getting the video and caption out of Instagram, and Dify has no node for that. The rest (ffmpeg, the LLM's judgment, git) is custom code either way, so a workflow builder in between does not shorten anything.
- No scraping of Instagram. The closest thing to "just hand over a URL" is yt-dlp with cookies (it also returns the full caption as metadata), but the terms are grey and the cookie's account can get restricted. For now the author hands over the video and the caption.
- `vs.front` (4-2-5 and so on) is not a vocabulary. The field exists and accepts null.
- A React island for walking relations. The relations are derived at build time, so a chip is a link to a static page and the client has nothing to compute. An island is added when an interaction needs one.
- validate with a schema of its own (the draft's `validate.mjs`), next to the zod schema the site needs. Every new field would have been written twice.
- Biome, and Prettier with ESLint, for lint and format. Biome's `.astro` formatting is experimental and it has no Astro lint rules. Prettier plus ESLint with the Astro plugins covers the most of `.astro`, but is the slowest and needs the most configuration, and oxfmt formats `.astro` through the same `prettier-plugin-astro`, so the output is the same. Vite+ (`vp`) bundles the same oxlint, oxfmt and vitest behind one CLI and one config file, but Astro keeps its own dev and build commands, so `vp` would only wrap three scripts. `vp migrate` can bring it in later.
- Tailwind. Four page types and a handful of components do not need a utility framework.
- Vercel. GitHub Pages needs no account outside GitHub, and infra-github already manages the repository. The PR review is about content, so per-PR previews are not needed.
- Committing the phase-2 `ingest.yml` as a stub. It triggers on an issue label and has nothing to run with, so it would only produce failed runs.

## What four videos taught

The plays processed with the draft and the result. The files went with the zip; the lessons stay, and the four videos are the natural candidates for the first ingestions (step 5), since their URLs are known and the result can be checked against this table.

| Play | Author | Parts | vs |
| --- | --- | --- | --- |
| 2026 Bills @ Rams "Y-Short Bunch Trail" https://www.instagram.com/reel/DecbK2ZAxuD/ | playdesignerpro | bunch, y-short, trail | cover-1 (medium) |
| 2026 Delaware @ Middle Tennessee "GY Counter Reverse Throwback" https://www.instagram.com/reel/Dehb6Nsg5IH/ | playdesignerpro | gy-counter, reverse, throwback | cover-1 (low) |
| 2026 Houston Christian @ North Texas "Trips Nub, H Wheel" https://www.instagram.com/reel/DeRtG4KC17y/ | offensive_guru | trips-nub, wheel, bluff, screen-fake | cover-2 (medium) |
| 2026 (unknown) @ Wisconsin "Counter Solid Bluff, H Wheel" https://www.instagram.com/reel/DeO87TLiFxc/ | offensive_guru | counter-solid, wheel, play-action, bluff | quarters (low) |

- The last two share `pass: wheel` and `action: bluff` and differ only in how the wheel is sold (a screen fake or play action). The shared parts line them up as two examples of the H bluffing and then running the wheel, with no relation written by hand. The relation the model was built for appeared at four plays.
- Authors name plays in different places and with different grammars. playdesignerpro writes `game` plus `Motion Formation Concept` as an overlay inside the video. offensive_guru writes `Team Formation ➡️ Concept` in the caption, which is truncated on screen. Videos from offensive_guru need the caption text handed over with them.
- A trick play's whole point is that the defense breaks down, so only the pre-snap alignment is usable as evidence and `confidence` ends up low. This will keep happening.
- Reading the diagrams. In PlayDesignerPro-style diagrams a bar at the end of a line is a block, an arrow is a route, a zigzag is motion, and a yellow or orange line is where the ball went. A short bar in the middle of a route is a bluff (a fake block before the route).
- In the cloud environment the Whisper model hosts (HuggingFace, Azure CDN) are blocked, so no transcript was produced. It works in a local Claude Code. All four plays have no transcript, and their `vs` is inferred from the diagram and the footage.
- The opponent is not always identifiable from the footage (for the Wisconsin game only "white jerseys, dark helmets" could be seen). `game.away: unknown` is accepted and validate warns about it.

## Still open

- Search that starts from the defense ("bunch plays against Cover 1"). How to present it. For a static site the candidate is Pagefind at build time; decide when the chips stop being enough.
- Whether `game` becomes a chip, for the day someone wants "that play from that game".
- Whether `situations` (short yardage, red zone and so on) comes back. It was dropped on the assumption that `vs` plus parts cover it; more videos may say otherwise.
- The GitHub Actions version that turns an issue into a PR. The stub is kept in the draft below and not committed. Issues cannot carry the video, so for now a local Claude Code runs the ingestion.
- More skills from github-toolkit once there is code for them: `typescript-idioms` with the first code PR, `frontend-design` for the look. Not `react-patterns`, since there is no React.
- The prose style of the Japanese part bodies. Some use arrows and "label: explanation" bullets that the writing conventions do not allow. Fix as they are touched.

## Next

The order is a guess and will change. Each step is one PR that is green on its own, and the PR that completes a step ticks its box. A fresh session takes the first unticked step and nothing else.

- [ ] 1. Toolchain
- [ ] 2. Schema, validate and tests
- [ ] 3. infra-github: default branch and required check
- [ ] 4. Ingestion: the skill and extract.sh
- [ ] 5. The first plays
- [ ] 6. The site
- [ ] 7. Publishing
- [ ] 8. Growing the catalog

### 1. Toolchain

The PR adds `package.json` (name `cutups`, `private`, `type: module`, every version exact), `package-lock.json`, `.node-version` with `22.22.0`, `tsconfig.json` extending `astro/tsconfigs/strict`, `astro.config.mjs` with `site: "https://cutups.yamat47.me"`, `src/pages/index.astro` with a placeholder heading, `src/styles/global.css` with the custom properties, `.oxlintrc.json` and `.oxfmtrc.json` that ignore `content/`, `docs/`, `dist/` and `.claude/`, `.gitignore` (`node_modules/`, `dist/`, `.astro/`, `inbox/*` with `!inbox/README.md`), `.github/workflows/ci.yml` with the one job `check`, and the `npm` entry in `.github/dependabot.yml` (monthly, one group). The scripts in `package.json` are `dev`, `build`, `check` (`astro check && oxlint src scripts && oxfmt --check`) and `fmt` (`oxfmt`). `ci.yml` runs `npm ci`, `npm run check`, `npm run build`. Dependencies are the latest at the time; on 2026-10-17 they were astro 7.4.0, oxlint 1.88.0, oxfmt 0.73.0 (with `@astrojs/compiler-rs`, its optional peer for `.astro`), plus `@astrojs/check` and `typescript`, which `astro check` needs.

The step is done when the PR's `check` job is green and `npm run build` writes `dist/index.html`.

### 2. Schema, validate and tests

The PR adds `src/content/schema.ts` (the zod schemas for a play and a part, with the fields from `DATA_MODEL.md`), `src/content.config.ts` (collections `plays` and `components` over `content/plays` and `content/components` through the glob loader), `src/lib/validate.ts` (the cross-file rules as pure functions over parsed objects), `scripts/validate.ts` (reads the files, runs the schema and the rules, prints warnings in yellow and errors in red, exits 1 on an error, and ends with the line `N plays, M components: E errors, W warnings`), `src/lib/validate.test.ts`, `vitest.config.ts`, the `test` (`vitest run`) and `validate` (`node scripts/validate.ts`) scripts, both added to `ci.yml`, a `.gitkeep` in `content/plays/` and in each `content/components/{kind}/`, and `DATA_MODEL.md` at the root, rewritten from the draft with the paths of this plan. `CLAUDE.md` gets its entry points (`npm run validate`, `npm run check`).

The rules to test, each with a fixture: a referenced part that does not exist is an error, `variant_of` pointing outside its kind is an error, a missing body heading is an error, an empty `components` is an error, `confidence: low` is a warning, a `builds_on` that does not exist yet is a warning, `game.away: unknown` is a warning, a `video.url` outside instagram.com, x.com and twitter.com is a warning.

The step is done when `npm run validate` on the empty tree ends with `0 plays, 0 components: 0 errors, 0 warnings`, `npm test` passes, and `check` runs both.

### 3. infra-github: default branch and required check

In the infra-github repository, not this one: remove `manage_default_branch = false` from the `cutups` entry and set `required_checks` to `["check"]`. The author does this; a session here can only remind. Ticked when both are merged there.

### 4. Ingestion: the skill and extract.sh

The PR adds `.claude/skills/ingest-play/SKILL.md` (the eight steps of the draft, with `npm run validate` in place of the old command and the template path below), `.claude/skills/ingest-play/pr-template.md`, `scripts/extract.sh` as in the draft, and `inbox/README.md` as in the draft. The skill reads the existing parts before creating one, never commits video files, and never changes an existing part's definition in passing.

The step is done when `bash scripts/extract.sh inbox/test.mp4` writes `sheet.jpg`, `diagram_1.png` to `diagram_3.png` and `audio.wav` for a synthetic video made with `ffmpeg -f lavfi -i testsrc=duration=12:size=1180x2556:rate=30 -f lavfi -i sine=frequency=440:duration=12 -pix_fmt yuv420p inbox/test.mp4`, and `python3 .claude/skills/skill-creator/scripts/quick_validate.py .claude/skills/ingest-play` passes.

### 5. The first plays

The author hands over videos one at a time, each with its sidecar, and runs `/ingest-play` in a local Claude Code. One play is one branch is one PR, and the review is the curation. The four videos under "What four videos taught" come first: their URLs are known, and the parts and `vs` in the table are the expected result. Whatever the review corrects goes back into the skill or the part's 「見分け方」 in the same PR.

The step is ticked when two plays are on `main`, so that the site in step 6 has a shared part to show. Ingestion continues through every later step.

### 6. The site

The PR adds `src/lib/relations.ts` (the derived views of `DATA_MODEL.md`: the plays of a part, same picture, same scheme with `variant_of` families as one, plays against a coverage, the reverse of `builds_on`), `src/lib/relations.test.ts`, `src/layouts/Base.astro`, `src/components/Chip.astro`, `PlayCard.astro` and `Embed.astro` (the Instagram and X blockquotes from the data model), and the pages `src/pages/index.astro` (the play list), `src/pages/plays/[slug].astro`, `src/pages/[kind]/index.astro` and `src/pages/[kind]/[slug].astro`. It also installs `typescript-idioms` from github-toolkit (`gh skill install yamat47/github-toolkit typescript-idioms --agent claude-code --scope project`) and reads it first.

The step is done when `npm run build` writes a page for every play and every part, the chips on a play page link to `/{kind}/{slug}/`, and `/coverage/{slug}/` lists the plays whose `vs.coverage` is that slug.

### 7. Publishing

The PR adds `.github/workflows/deploy.yml`: on push to `main`, build, then `actions/upload-pages-artifact` and `actions/deploy-pages`, with `pages: write` and `id-token: write` on the deploy job and every action pinned by SHA. The author adds `pages` with `cname = "cutups.yamat47.me"` to the `cutups` entry in infra-github and the DNS record.

The step is done when `https://cutups.yamat47.me/` serves the play list.

### 8. Growing the catalog

Not one PR. Five to ten more videos to grow the part vocabulary and the coverage recognition cues, then `frontend-design` from github-toolkit for the look, then the items under "Still open" as the content makes them concrete. This step is never ticked.

## How the work goes

- The author hands over a video and its caption, Claude Code opens a PR through `/ingest-play`, the author reviews and merges. Whatever the review corrected is written back into the skill or into a part's 「見分け方」, so the next video from the same author does not repeat it.
- Model changes are small and come with their reason. The move from v0.1 to v0.2 only became necessary after two real videos had been processed. The order stays: process videos, then fix what got in the way.
- Changing an existing part's definition is its own PR, separate from adding plays.

## The draft (playbook-v0.4.zip)

The reference the code is rewritten from. The zip is gone, so these copies are all that is left of it. `CLAUDE.md`, `DATA_MODEL.md`, the skill and the scripts are rewritten under the Code rules above, and the copies show what the draft did. The play and part files show the shape a new play or part takes; they are not restored as content. When a PR makes one of these files real, it deletes the copy here.

<details>
<summary>CLAUDE.md</summary>

````markdown
# cutups: a catalog of football play examples

The repository is the database. One video is one play example in `content/plays/*.md`. Concepts live in `content/components/` as parts, and a play is a composition of parts. The full model is in `DATA_MODEL.md`.

## Entry points
- Ingest a new video: `/ingest-play` (`.claude/skills/ingest-play/SKILL.md`)
- Check the content: `node scripts/validate.mjs` (always before a PR)

## Rules
- `vs` is required. A guess is fine, but it always comes with `confidence` and `evidence`.
- When a part is missing, add `content/components/{kind}/{slug}.md` in the same PR. Read every existing part before adding one.
- Never write relations (derivatives, series, counters) by hand. They are derived from shared parts at build time.
- Never commit video files (`inbox/` is gitignored).
- Mark every inference, in a frontmatter comment or in the PR body. Do not state a guess as fact.
- Play and component bodies are written in Japanese for the readers. Titles and part names use the English that the author or coaches use; the Japanese goes in `title_ja`. Everything else in the repository (docs, code, commits) is English.
````

</details>

<details>
<summary>DATA_MODEL.md</summary>

````markdown
# Data model v0.2.1

Changes from v0.1: the node is a play example, not a concept. Concepts are parts attached to examples, and relations are derived at build time from the parts that plays share. `vs` (the defense the opponent showed) is required.

## Principles

1. One video is one play example is one file. That is the only kind of node.
2. A play is a composition of parts: formation, motion, run scheme, pass concept, action. The author's title (for example *Y-Short Bunch Trail*) is parsed into parts.
3. `vs` is required. It records the defense the opponent actually showed on this play, not what the play is meant to beat. A guess is allowed, with evidence.
4. Relations are never written by hand. They are derived from shared parts. The one exception is `builds_on`.
5. The vocabulary grows from examples. When a part is missing, the part file is added in the same PR.
6. Video files never enter the repository. Only the URL is stored, and the site shows the official embed.

## Directory layout

```
content/
  plays/
    2026-bills-rams-y-short-bunch-trail.md
    2026-delaware-mtsu-gy-counter-reverse-throwback.md
  components/
    formation/  bunch.md
    motion/     y-short.md
    run/        gy-counter.md
    pass/       trail.md
    action/     reverse.md  throwback.md
    coverage/   cover-1.md
scripts/
  validate.mjs
```

A play's slug is `{season}-{away}-{home}-{title-kebab}`. The same play name in the same game is unlikely to repeat.

## A play example

```yaml
---
title: Y-Short Bunch Trail          # the author's name for it, verbatim (canonical)
title_ja: Yショート・バンチ・トレイル
phase: offense                      # offense | defense | kick

game:
  season: 2026
  away: Bills
  home: Rams
  level: nfl                        # nfl | ncaa | other
  offense: Bills                    # the team on offense

components:                         # each value must exist as components/{kind}/{slug}.md
  formation: bunch
  motion: y-short
  pass: trail
  # omit run / action when the play has none

vs:                                 # required
  coverage: cover-1                 # a slug under components/coverage/
  confidence: medium                # high | medium | low
  evidence: The nickel follows Y's short motion. One safety deep in the middle.
  front: null                       # optional, e.g. 4-2-5. Not a vocabulary yet.

builds_on: null                     # optional. Only when the author says this play was designed against that play.

video:
  url: https://www.instagram.com/reel/DecbK2ZAxuD/
  author: playdesignerpro
  kind: diagram+film                # diagram+film | film | diagram | talk
  caption: null                     # the caption verbatim, for authors who name the play there
  transcript: null                  # relative path to transcripts/{slug}.txt when one exists
---

## このプレーの何が面白いか
(The editor's voice. Written for every play.)

## 展開
(Who moves where. Bullets.)

## 守備の読み
(The long form of `vs.evidence`: what in the footage led to the call.)
```

The body headings are Japanese because the body is for Japanese readers. Their names are fixed; `validate.mjs` checks them.

### Required and optional

| Field | Required | Notes |
| --- | --- | --- |
| title, title_ja, phase, game | yes | |
| components | yes | at least one; every value must have a part file (checked in CI) |
| vs.coverage, vs.confidence, vs.evidence | yes | `low` is fine; empty is not |
| vs.front, builds_on | no | |
| video.url, video.author, video.kind | yes | |
| three body headings | yes | 「守備の読み」 is the long form of `vs.evidence` |

## A part

```yaml
---
kind: pass                          # formation | motion | run | pass | action | coverage
title: Trail
title_ja: トレイル
aliases: [Return, Whip, リターン]
variant_of: null                    # optional. The parent slug in the same kind (gy-counter -> counter)
---

## 何か
(The definition, written once. Three to five lines.)

## 見分け方
(What in the footage identifies it. Matters most for coverage.)
```

A part's body is short: the definition and how to recognize it. Per-play commentary belongs in the play.

### Coverage parts are special

Because `vs` is required, reading the defense has to get cheaper. The 「見分け方」 section of a coverage part doubles as the checklist Claude runs against the frames. For example:

- cover-1: one safety deep in the middle, corners squared up on receivers, a defender follows motion
- cover-3: one safety deep in the middle, corners backpedal deep and outside, nobody follows motion
- cover-2: two safeties deep on the hashes, corners jam and stay shallow

## Derived at build time

| Derived view | Rule |
| --- | --- |
| part page | every play that has the part |
| same picture, different play (a series) | same formation and motion, different run / pass / action |
| same scheme | same run or same pass; parts sharing a `variant_of` parent are listed as one family |
| plays used against this defense | grouped by vs.coverage |
| counters | the reverse of builds_on |
| search index | title / title_ja / aliases (parts included) / game |

## How the site is navigated

A play page shows its parts and its `vs` as chips. A chip leads to the list of plays that share it. The search box is secondary; the main movement is pivoting through chips.

## Where authors put the play name

| Author | Where | Grammar |
| --- | --- | --- |
| playdesignerpro | overlay inside the video | `game` + `Motion Formation Concept` |
| offensive_guru | the caption (truncated on screen) | `Team Formation ➡️ Concept` |

For authors who name the play in the caption, expand the caption before recording, or paste the caption text next to the link. When the caption was cut off, mark the inferred part of `title` in a comment.

## How Claude opens a PR

1. Cut frames and transcribe.
2. Parse the title into candidate parts. Read all of `components/` and match against existing parts, aliases included.
3. Create part files for anything missing (definition and how to recognize it).
4. Read the defense from the frames against the coverage parts' 「見分け方」 and write the evidence. When unsure, `confidence: low`.
5. Write the play file.
6. Run validate.
7. In the PR body: the title-to-parts table, the `vs` evidence and confidence, the reason for each new part.

## Dropped since v0.1

- `parent` / `beats` / `pairs_with`: replaced by derivation.
- `situations`: removed for now. `vs` and parts cover it. Can come back later.
- `status: stub`: a part may exist with zero plays, so stubs are not needed.
````

</details>

<details>
<summary>.claude/skills/ingest-play/SKILL.md</summary>

````markdown
---
name: ingest-play
description: Turn a video (plus its caption) in inbox/ into a play example and any missing parts, run validate, and open a PR. Use whenever one or more videos are handed over.
---

# /ingest-play

Input: `inbox/<name>.mp4` and a sidecar `inbox/<name>.yaml` with the same name (url, author, caption verbatim). Ask for the sidecar when it is missing.
Output: `content/plays/<slug>.md` (plus any new parts). One play, one branch, one PR.

## Steps, in this order

1. **Make the material**: `bash scripts/extract.sh inbox/<name>.mp4`
   This writes `inbox/<name>/` with `sheet.jpg` (1 fps tiles), `diagram_*.png` (the diagram in three high-resolution strips) and `transcript.txt` (when Whisper is available). Read the sheet and the diagrams with Read. Read the transcript when there is one.

2. **Read everything that exists**: `content/components/**/*.md` and `content/plays/*.md`. Before creating a part, check that nothing existing matches, aliases included.

3. **Parse the name**: split the author's title or caption into parts. Each author's grammar is in `DATA_MODEL.md` under "Where authors put the play name". When the caption was cut off, mark the inferred part in a comment next to `title`.

4. **Choose the parts**: formation / motion / run / pass / action. Omit keys the play does not have. A new part has the two headings 「何か」 and 「見分け方」, with a definition of three to five lines. A variant points at its parent with `variant_of`.

5. **Read the defense**: check the frames against the 「見分け方」 of each `content/components/coverage/*.md`, in this order: number of deep safeties, then what the corners do, then whether anyone follows motion. Confidence is
   - high: the author says so in the transcript
   - medium: the diagram and the footage agree, and at least two cues from 「見分け方」 match
   - low: only the pre-snap alignment is available, or the camera angle hides it

6. **Write the play**: follow the template in `DATA_MODEL.md`. The slug is `{season}-{away}-{home}-{title-kebab}`. The three body headings are 「このプレーの何が面白いか」, 「展開」, 「守備の読み」, written in Japanese. When an existing play shares parts with this one, 「このプレーの何が面白いか」 names the contrast (same parts, different way of selling it, and so on).

7. **Validate**: `node scripts/validate.mjs`. Fix every error. Carry each warning (a reference that does not exist yet, and so on) into the PR body.

8. **Open the PR**: branch `play/<slug>`. The body follows `scripts/pr-template.md`:
   - the title-to-parts table (which word became which part)
   - the `vs` evidence and confidence
   - each new part and why it is new
   - open questions (unknown opponent, truncated caption, and so on)

## Never

- Commit video files or anything under inbox/
- Raise confidence without evidence
- Change an existing part's definition in passing (that is its own PR)
````

</details>

<details>
<summary>scripts/extract.sh</summary>

````bash
#!/usr/bin/env bash
# Usage: bash scripts/extract.sh inbox/<name>.mp4
# Writes inbox/<name>/{sheet.jpg, diagram_1..3.png, audio.wav, transcript.txt}
set -euo pipefail
src="$1"; name="$(basename "${src%.*}")"; out="$(dirname "$src")/$name"
mkdir -p "$out"

# Phone screen recordings are portrait (1180x2556 and the like).
read -r W H < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$src" | tr ',' ' ')

# One frame per second, tiled, to see the whole play at a glance.
n=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src" | cut -d. -f1)
cols=6; rows=$(( (n + cols - 1) / cols ))
ffmpeg -y -v error -i "$src" -vf "fps=1,scale=590:-1,tile=${cols}x${rows}" "$out/sheet.jpg"

# The diagram sits in the top part of the frame. Three overlapping strips
# (0-35%, 30-65%, 60-95% of the height) at full resolution keep the labels legible.
for i in 1 2 3; do
  y=$(( H * (i - 1) * 30 / 100 )); h=$(( H * 35 / 100 ))
  ffmpeg -y -v error -ss 3 -i "$src" -frames:v 1 -vf "crop=${W}:${h}:0:${y}" "$out/diagram_$i.png"
done

# Audio, then a transcript when faster-whisper is installed.
ffmpeg -y -v error -i "$src" -vn -ac 1 -ar 16000 "$out/audio.wav"
if python3 -c "import faster_whisper" 2>/dev/null; then
  if python3 - "$out/audio.wav" > "$out/transcript.txt" 2>/dev/null <<'PY'
import sys
from faster_whisper import WhisperModel
segs, _ = WhisperModel("small", device="cpu", compute_type="int8").transcribe(sys.argv[1], vad_filter=True)
for s in segs: print(f"[{s.start:5.1f}] {s.text.strip()}")
PY
  then echo "transcript: $out/transcript.txt"
  else rm -f "$out/transcript.txt"; echo "transcription failed (model download blocked, or similar); continuing without it"
  fi
else
  echo "faster-whisper is not installed; skipping the transcript (pip install faster-whisper)"
fi
echo "done: $out"
````

</details>

<details>
<summary>scripts/validate.mjs</summary>

````javascript
// node scripts/validate.mjs: checks content/ for consistency. Red is an error (exit 1), yellow a warning.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import YAML from "yaml";

const KINDS = ["formation", "motion", "run", "pass", "action", "coverage"];
const errors = [], warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

function walk(dir) {
  return readdirSync(dir).flatMap(n => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}
function frontmatter(path) {
  const s = readFileSync(path, "utf8");
  const m = s.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { err(path, "missing frontmatter"); return [null, ""]; }
  try { return [YAML.parse(m[1]), m[2]]; } catch (e) { err(path, `YAML: ${e.message}`); return [null, ""]; }
}
const headings = body => [...body.matchAll(/^## (.+)$/gm)].map(m => m[1].trim());

// --- parts ---
const components = {}; // kind -> Set(slug)
for (const k of KINDS) components[k] = new Set();
for (const p of walk("content/components")) {
  const [fm, body] = frontmatter(p); if (!fm) continue;
  const kind = p.split("/")[2], slug = basename(p, ".md");
  if (!KINDS.includes(kind)) err(p, `unknown kind directory ${kind}`);
  if (fm.kind !== kind) err(p, `kind: ${fm.kind} does not match the directory ${kind}`);
  for (const k of ["title", "title_ja"]) if (!fm[k]) err(p, `missing ${k}`);
  const h = headings(body);
  for (const need of ["何か", "見分け方"]) if (!h.includes(need)) err(p, `missing heading "${need}"`);
  components[kind].add(slug);
}
// variant_of is checked after every part is known
for (const p of walk("content/components")) {
  const [fm] = frontmatter(p); if (!fm?.variant_of) continue;
  const kind = p.split("/")[2];
  if (!components[kind].has(fm.variant_of)) err(p, `variant_of: ${fm.variant_of} does not exist under ${kind}`);
}

// --- plays ---
const slugs = new Set();
for (const p of walk("content/plays")) {
  const [fm, body] = frontmatter(p); if (!fm) continue;
  const slug = basename(p, ".md");
  if (slugs.has(slug)) err(p, "duplicate slug"); slugs.add(slug);

  for (const k of ["title", "title_ja", "phase", "game", "components", "vs", "video"]) if (fm[k] == null) err(p, `missing ${k}`);
  if (!["offense", "defense", "kick"].includes(fm.phase)) err(p, `phase: ${fm.phase}`);
  for (const k of ["season", "away", "home", "level", "offense"]) if (fm.game?.[k] == null) err(p, `missing game.${k}`);
  if (fm.game?.away === "unknown" || fm.game?.home === "unknown") warn(p, "game has an unknown team");

  // components
  const comps = fm.components ?? {};
  if (Object.values(comps).filter(v => v != null).length === 0) err(p, "components is empty");
  for (const [kind, v] of Object.entries(comps)) {
    if (v == null) continue;
    if (!KINDS.includes(kind) || kind === "coverage") { err(p, `components.${kind} is not a valid key`); continue; }
    for (const s of Array.isArray(v) ? v : [v]) if (!components[kind].has(s)) err(p, `components.${kind}: ${s} does not exist under content/components/${kind}/`);
  }

  // vs
  const vs = fm.vs ?? {};
  if (!vs.coverage) err(p, "vs.coverage is empty (required)");
  else if (!components.coverage.has(vs.coverage)) err(p, `vs.coverage: ${vs.coverage} does not exist`);
  if (!["high", "medium", "low"].includes(vs.confidence)) err(p, `vs.confidence: ${vs.confidence}`);
  if (!vs.evidence || String(vs.evidence).trim().length < 10) err(p, "vs.evidence is missing or too short");
  if (vs.confidence === "low") warn(p, "vs.confidence is low");

  if (fm.builds_on && !slugs.has(fm.builds_on)) warn(p, `builds_on: ${fm.builds_on} does not exist (yet)`);

  // video
  for (const k of ["url", "author", "kind"]) if (!fm.video?.[k]) err(p, `missing video.${k}`);
  if (fm.video?.url && !/^https:\/\/(www\.instagram\.com|x\.com|twitter\.com)\//.test(fm.video.url)) warn(p, `unexpected domain in video.url: ${fm.video.url}`);
  if (!fm.video?.transcript) warn(p, "no transcript");

  const h = headings(body);
  for (const need of ["このプレーの何が面白いか", "展開", "守備の読み"]) if (!h.includes(need)) err(p, `missing heading "${need}"`);
}

for (const w of warns) console.log(`\x1b[33mwarn\x1b[0m ${w}`);
for (const e of errors) console.log(`\x1b[31merror\x1b[0m ${e}`);
console.log(`\n${slugs.size} plays, ${Object.values(components).reduce((a, s) => a + s.size, 0)} components: ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
````

</details>

<details>
<summary>scripts/pr-template.md</summary>

````markdown
## Added
- `content/plays/<slug>.md`
- New parts: (delete this line when there are none)

## Title to parts
| Word in the title | Part | Existing or new |
| --- | --- | --- |

## vs
- coverage:
- confidence:
- evidence:

## Open questions
-
````

</details>

<details>
<summary>inbox/README.md</summary>

````markdown
# inbox

Drop a video and its sidecar here, then run `/ingest-play`. Everything here except this file is gitignored.

```
inbox/
  bills-rams-bunch-trail.mp4
  bills-rams-bunch-trail.yaml
```

The sidecar:
```yaml
url: https://www.instagram.com/reel/XXXX/
author: playdesignerpro
caption: |
  (the caption, verbatim; empty when there is none)
note: |
  (optional, your own note: "came right after the counter in the first half", and so on)
```
````

</details>

<details>
<summary>package.json and .gitignore</summary>

````json
{
  "name": "playbook",
  "private": true,
  "type": "module",
  "scripts": { "validate": "node scripts/validate.mjs" },
  "dependencies": { "yaml": "2.6.1" }
}
````

````
inbox/*
!inbox/README.md
node_modules/
````

</details>

<details>
<summary>.github/workflows/ingest.yml (phase 2 stub, not committed)</summary>

````yaml
# Phase 2. Label an issue `ingest` with the video URL and sidecar in its body, and Claude Code opens the PR.
# Issues cannot carry the video itself, so the first phase runs /ingest-play from a local Claude Code instead.
name: ingest-play
on:
  issues:
    types: [labeled]
jobs:
  ingest:
    if: github.event.label.name == 'ingest'
    runs-on: ubuntu-latest
    permissions: { contents: write, pull-requests: write, issues: write }
    steps:
      - uses: actions/checkout@v4
      - run: sudo apt-get install -y ffmpeg && pip install faster-whisper && npm ci
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Put the video URL and sidecar from issue #${{ github.event.issue.number }} into inbox/, run /ingest-play, and open the PR.
````

</details>

<details>
<summary>content/plays/2026-bills-rams-y-short-bunch-trail.md (a play)</summary>

````markdown
---
title: Y-Short Bunch Trail
title_ja: Yショート・バンチ・トレイル
phase: offense

game:
  season: 2026
  away: Bills
  home: Rams
  level: nfl
  offense: Bills

components:
  formation: bunch
  motion: y-short
  pass: trail

vs:
  coverage: cover-1
  confidence: medium
  evidence: 図では NB がバンチの内側に張り付き、SS がバンチ側に寄っている。X 側の CB は単独で正対。文字起こし未取得のため medium
  front: null

builds_on: null

video:
  url: https://www.instagram.com/reel/DecbK2ZAxuD/
  author: playdesignerpro
  kind: diagram+film
  transcript: null
---

## このプレーの何が面白いか
Y のショートモーションで「バンチを完成させる」と「マンかどうか確認する」を同時にやっている。モーションに DB がついてきた時点で、QB はドラッグ→トレイルの順で読めばいいと分かる。

## 展開
- Y：ショートモーションでバンチに合流 → スナップ後に逆サイドへ浅く横切る（ドラッグ）
- F：いったん外へ出てから内へ切り返し、Y の DB の後ろを通る（トレイル）
- Z：縦に出てコーナー。上の2本が作る空間の上
- X：逆サイド単独でディグ。最後の選択肢
- H：ショートモーションで位置を変えてからプロテクション

## 守備の読み
バンチ側に NB・SS・CB の3人が集まり、それぞれがレシーバーと正対している。深い中央は FS の1枚。X 側の CB は孤立してマン。モーションへの追従は映像で要確認（文字起こしが入れば confidence を上げられる）。
````

</details>

<details>
<summary>content/plays/2026-unknown-wisconsin-counter-solid-bluff-h-wheel.md (a play with confidence: low)</summary>

````markdown
---
title: Counter Solid Bluff → H Wheel   # キャプションは "Counter Solid Bluff ➡️ H …" で切れている。Wheel は図からの推定
title_ja: カウンター・ソリッド・ブラフ → Hホイール
phase: offense

game:
  season: 2026
  away: unknown              # 白ジャージ＋黒系ヘルメット。要確認
  home: Wisconsin
  level: ncaa
  offense: Wisconsin

components:
  run: counter-solid
  pass: wheel
  action: [play-action, bluff]

vs:
  coverage: quarters
  confidence: low
  evidence: 図で $ と FS の2枚が深く、Z 側の CB が縦ルートについて走っている（カバー2ならスクワット）。FS がカウンターの絵に前へ出ている。文字起こし未取得
  front: null

builds_on: null

video:
  url: https://www.instagram.com/reel/DeO87TLiFxc/
  author: offensive_guru
  kind: diagram+film
  caption: "Wisconsin Badgers Counter Solid Bluff ➡️ H …"
  transcript: null
---

## このプレーの何が面白いか
Counter Solid は OL がプルしないカウンターなので、OL の動きだけ見るとパスプロテクションと区別がつかない。そこに H のブラフ（キックアウトに行くふり）を重ねると、守備のセカンドレベルは完全にランと読む。Quarters のセーフティはランの絵に前へ出る役割を持っているので、その性質をそのまま利用して H のホイールが後ろを抜ける。前の North Texas のプレーと同じ「H ブラフ → ホイール」を、スクリーンではなくカウンターで売っている対比が面白い。

## 展開
- H：ショートモーション → LOS の裏を右へ走り、E にブロックのふり（ブラフ）→ サイドラインを縦に（ホイール）。ターゲット
- Y：バックフィールドから右へプルし E をキックアウト（カウンターの絵）
- RB：カウンターのフェイクを受けてから右フラットへ
- Z：縦に出てからコーナー。CB と FS を深く連れていく
- X：左でショートアウト
- OL：プルなし（ソリッド）

## 守備の読み
2枚のセーフティが深く、Z 側 CB が縦に乗っている → Quarters 寄り。FS は Y のプルと RB のフェイクに反応して前へ出ており、H の後ろを誰も取れていない。映像の角度がスナップ時の全体を映しておらず、confidence=low。
````

</details>

<details>
<summary>content/components/coverage/cover-1.md (a coverage part)</summary>

````markdown
---
kind: coverage
title: Cover 1
title_ja: カバー1
aliases: [Man free, マンフリー, 1ハイ・マン]
---

## 何か
セーフティ1枚が深い中央に残り、残りの DB・LB がレシーバーをマンツーマンで担当する守備。ブリッツと組み合わせやすい。

## 見分け方
- セーフティが1枚だけ、ハッシュの中央に深く立つ
- CB がレシーバーに正対し、内側の目線（アイズ）がレシーバーに向く
- モーションした選手に DB がついていく（最大の手がかり）
- ボックス内の人数が多い（7人以上）

Cover 3 との区別：モーションに追従するか、CB がレシーバーを見ているか（Cover 3 は QB を見る）。
````

</details>

<details>
<summary>content/components/run/counter-solid.md (a part with variant_of)</summary>

````markdown
---
kind: run
title: Counter Solid
title_ja: カウンター・ソリッド
aliases: [Solid]
variant_of: counter
---

## 何か
カウンターの変種。ガードはプルせず OL はそのままブロック（ソリッド）し、バックフィールドの Y/H だけがプルしてエンドをキックアウトする。OL の動きが小さいのでプレーアクションと相性がいい。

## 見分け方
カウンターの絵なのに OL の誰もプルしていない。プルは TE/H 1人だけ。
````

</details>

<details>
<summary>File list</summary>

```
.claude/skills/ingest-play/SKILL.md
.github/workflows/ingest.yml
.gitignore
CLAUDE.md
DATA_MODEL.md
content/components/action/bluff.md
content/components/action/play-action.md
content/components/action/reverse.md
content/components/action/screen-fake.md
content/components/action/throwback.md
content/components/coverage/cover-1.md
content/components/coverage/cover-2.md
content/components/coverage/quarters.md
content/components/formation/bunch.md
content/components/formation/trips-nub.md
content/components/motion/y-short.md
content/components/pass/trail.md
content/components/pass/wheel.md
content/components/run/counter-solid.md
content/components/run/counter.md
content/components/run/gy-counter.md
content/plays/2026-bills-rams-y-short-bunch-trail.md
content/plays/2026-delaware-mtsu-gy-counter-reverse-throwback.md
content/plays/2026-hou-christian-north-texas-trips-nub-h-wheel.md
content/plays/2026-unknown-wisconsin-counter-solid-bluff-h-wheel.md
inbox/README.md
package.json
scripts/extract.sh
scripts/pr-template.md
scripts/validate.mjs
```

The parts not shown above (bunch, trips-nub, y-short, trail, wheel, counter, gy-counter, reverse, throwback, bluff, play-action, screen-fake, cover-2, quarters) and the other two plays are in the zip. If they have to be restored, the samples above and the table under "What four videos taught" are enough to rewrite them.

</details>
