# Plan

This is a working log, not a specification. The project moves by trial and error with Claude Code: what was decided, what was dropped, what is still open. Rewrite it as things change. It is also the hand-over between sessions, which start with no memory of each other; "How a session starts" below says how to pick up the work from this file alone.

## What this is

A catalog of football play examples. The source material is videos on Instagram and X that diagram one play from one game (playdesignerpro, offensive_guru and similar accounts). Each play is organized by its parts: formation, motion, run scheme, pass concept, action, and the defense the opponent showed. The readers are Japanese coaches and players who come here when they want to add a play. Nothing is translated, but tags and commentary are written in Japanese. Collection is not automated: the author (yamat47) picks the videos and hands them over with their captions.

## How a session starts

1. Read `CLAUDE.md` and this file in full. The draft at the end is reference material; read the part of it that the current step points to.
2. Take the first unticked step under "Next". Confirm its state against the repository before starting: `git log --oneline -20`, the file tree, and the open pull requests, since a step may be half done on a branch. A step that is done but unticked is ticked in the next PR.
3. When the step raises a question this file does not answer, ask the author with `/grill-me` before writing code, and record the answer under "Decided so far" in the same PR.
4. Do that step and nothing else. A problem found outside the step is written under "Still open", not fixed.
5. Before opening the PR, run what CI runs: `make ci`. The step that adds a script to `ci.yml` adds it to the `ci` script of `package.json` too, which is what `make ci` runs.
6. Open the PR with `/create-pr`. The same PR ticks the step here, adds what was learned to "Decided so far" or "Tried and dropped", and deletes from the draft at the end every file the PR made real.

Three things differ in Claude Code on the web: pull requests are opened with the GitHub tools, not `gh`; there is no Docker, so the npm scripts run directly in `application/` and the PR says so; and the Whisper model hosts are blocked, so ingestion (step 5 and after) runs in a local Claude Code.

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
- A play may have more than one part of a kind, so a value under `components` is a slug or a list of slugs (`action: [play-action, bluff]`), and the schema turns both into a list. The rest of the model is in `DATA_MODEL.md`.

### Ingestion

- The author drops a video and a sidecar with the same name (`url`, `author`, the `caption` verbatim, an optional `note`) into `application/inbox/` and runs `/ingest-play` in a local Claude Code. One play is one branch is one PR, and the PR review is the curation step.
- `make inbox` serves a page on the author's machine (`application/scripts/inbox/`, port 4322) that takes the video and its URL and writes both files, with the author and the caption from the platform's oEmbed; `make lookup URL=` gives the same answer from the shell. This is not the scraping that was set aside: no page is fetched, no cookie is used, and the video is still handed over by the author. The endpoints and their caveats are in `lookup.ts`.
- The skill (`.claude/skills/ingest-play/SKILL.md`) fixes the procedure in eight steps: make the material, read every existing part, parse the name, choose the parts, read the defense, write the play, validate, open the PR.
- `application/scripts/extract.sh` does the deterministic preprocessing: 1 fps sheets, the diagram cut into three high-resolution strips, and a transcript when the Whisper model can be fetched. `make extract NAME=<name>` runs it in the container; the `Dockerfile` and `compose.yaml` say what it needs and why.
- `application/scripts/validate.ts` parses every frontmatter with the same zod schema the site uses (see Code below) and adds the checks that span files: every referenced part exists, `variant_of` points at a part of the same kind, the body headings are present. A reference that does not exist yet or `confidence: low` is a warning; a missing required field is an error.
- The PR body follows `.claude/skills/ingest-play/pr-template.md` and carries the title-to-parts table, the `vs` evidence and confidence, the reason for each new part, and open questions. Inferences are marked as such. The template lives with the skill because a template under `.github/` would apply to every PR, the skill updates and the Dependabot bumps included.

### Site

- Astro's content collections read `content/` as is, through the glob loader with `content/plays` and `content/components` as its base. Every page is generated at build time.
- There is no client-side JavaScript except the embed scripts of Instagram and X. The relations are derived at build time, so a chip is a plain link. A component becomes an island only when an interaction needs one, and none does yet.
- URLs: `/` is the play list, `/plays/{slug}/` a play, `/{kind}/{slug}/` a part with every play that has it, and `/{kind}/` the parts of one kind. `/coverage/cover-1/` is the list of plays used against Cover 1, the same page shape as any other part.
- The search box is secondary. The main movement is pivoting: a play page shows its parts and its `vs` as chips, and a chip leads to every play that shares it.
- Styling is Astro's scoped `<style>` in each component, plus one `src/styles/global.css` with the custom properties for color, spacing and type. No CSS framework. The look is refined later with the `frontend-design` skill, and those are the two places it touches.
- The relations are pure functions in `src/lib/relations.ts` over plain play and part entries, so vitest runs them without Astro; `src/lib/catalog.ts` loads the collections into those entries for the pages. "Same picture" needs at least a formation or a motion: two plays that name neither share nothing, not an empty picture. "Same scheme" groups by the top of the `variant_of` chain, so GY Counter and Counter Solid meet under Counter, and a part page lists the plays of every part below it in the chain, each variant under its own heading. Actions do not make a scheme.
- A chip shows the part's English `title`, the name coaches use, with `title_ja` as its tooltip. The page chrome (navigation, headings, kind names) is Japanese, and an unknown team shows as 「不明」. `confidence: low` shows as 「確度 低（推測）」 next to the coverage chip, so the reader sees that the call is a guess.
- The site is published on GitHub Pages at `cutups.yamat47.me`. `.github/workflows/deploy.yml` builds on every push to `main` and deploys with `actions/deploy-pages`. The `pages` block and the cname go into the `cutups` entry in infra-github, in the form the other sites there use: `pages = { build_type = "workflow", cname = "cutups.yamat47.me" }`.
- `deploy.yml` uses github-toolkit's wrappers of `actions/upload-pages-artifact` and `actions/deploy-pages` at `@main`, like every workflow here (see Code). Its build job has no npm cache, since a cache entry is shared across branches and what that job builds is published. It also runs on `workflow_dispatch`, to redeploy without a commit once Pages is turned on; a dispatch from another branch builds and does not publish. The deploy does not wait for `ci.yml`, because `check` is required on `main` in infra-github, so what reaches `main` has passed it.

### Code

- The draft (playbook-v0.4.zip, in the details at the end) is reference material. The zip itself is gone. The code is written fresh under the rules below, and the content is collected again from zero, one video at a time through `/ingest-play`.
- The Astro project is one package in `application/`: `content/`, `scripts/`, `src/` and `package.json` live there, following yamat47/waggle, where the application sits in a directory of its own. The root holds what is not the application: the development container (`Dockerfile`, `compose.yaml`, `Makefile`), `docs/`, `.github/`, `CLAUDE.md`, `README.md` and `DATA_MODEL.md`. CI runs its steps with `working-directory: application`, and Dependabot's `npm` entry points at `/application`.
- Astro 7, which runs on Vite 8 and Rolldown and needs Node 22.22.0 or newer. `.node-version` pins 22.22.0, `engines` in `package.json` says the same, and CI reads the file.
- TypeScript everywhere, `scripts/` included. Node 22 runs `.ts` files with type stripping, so the scripts have no build step. Type stripping wants the `.ts` extension on relative imports and accepts no enums or parameter properties. `tsconfig.json` extends `astro/tsconfigs/strict`.
- The content schema is written once, as zod in `src/content/schema.ts`, with `z` imported from `astro/zod` so that it runs outside Astro too. `src/content.config.ts` hands it to the collections and `scripts/validate.ts` imports it. A new field is added in one place.
- `astro/zod` is zod 4 (`zod/v4`), so the schema is written in its syntax (`z.strictObject`, `z.url()`, `z.int()`). The validate script parses frontmatter with `yaml`, the package Astro itself depends on, pinned as a direct dependency so that the lock file, not Astro's dependency tree, decides its version. `@types/node` is a direct dependency too, since `astro check` type-checks `scripts/`.
- The draft's "no transcript" warning was dropped from validate. No play has a transcript for now, so it would have fired on every file and said nothing.
- Tests are vitest, and only for logic: the relation derivation in `src/lib/relations.ts`, the rules in validate, the oEmbed lookup, each run against small fixtures. Test names state the input and the outcome. Pages and markup are not tested; `astro build` in CI is their check.
- Lint and format are oxlint and oxfmt, the Oxc toolchain that Astro 7 and Vite 8 are built on. oxfmt 0.73 (2026-10-13) formats `.astro` files through `prettier-plugin-astro` and the Astro 7 compiler; this is off by default and `.oxfmtrc.json` turns it on with `astro: true`. oxlint reads only the script part of an `.astro` file. Both run over `src/` and `scripts/` and ignore `content/` and `docs/`: the content's correctness is validate's job, and a formatter would damage the Japanese prose and the YAML comments that mark inferences.
- oxfmt is still a 0.x release, so every dependency is pinned to an exact version. `.github/dependabot.yml` gets an `npm` entry, monthly and grouped into one PR, and the bumps are read with `review-dependency-bump` before merging. A package whose major is decided by something else is ignored for majors in that file rather than closed by hand each month; the comments there say which and why. Dependabot proposes every newer version whatever the pin in `package.json` says, so the config is the only place for the rule.
- CI is one workflow, `.github/workflows/ci.yml`, with one job named `check`: `npm ci`, then `npm run check` (astro check, oxlint, oxfmt --check), `npm test`, `npm run validate`, `npm run build`. `check` is the required check in infra-github. Every workflow calls github-toolkit at `@main` (`yamat47/github-toolkit/actions/checkout@main` and so on, and its `update-skills` reusable workflow) instead of pinning upstream actions by SHA, as 97-things-every-programmer-should-know does. The toolkit is the author's own repository; its wrappers pin the upstream actions by SHA and its Dependabot bumps them, so this repository has no Dependabot `github-actions` entry. A change on the toolkit's `main` reaches these workflows on their next run without a review here. This departs from the SHA-pin rule of `github-actions-workflows` on purpose.
- Development runs in Docker, never on the host: `Dockerfile`, `compose.yaml` and a `Makefile` whose targets wrap `docker compose run`. No devcontainer and no wrapper script; compose and make are enough. `application/.node-version` is the one place the Node version is pinned; the Makefile reads it and hands it to the image as a build argument, so there is no Dependabot `docker` entry, and a Node bump is a hand edit of that file, `engines` and the `@types/node` major. The dev server always binds every interface (`astro dev --host`), since the host only ever reaches it through the port mapping. The image installs the tools of the ingestion (ffmpeg, faster-whisper) and nothing from `package.json`; `node_modules` and the npm cache are volumes, and `make install` fills them. CI stays on `actions/setup-node`: the runner is not the host, and building the image there would only add time.
- The phase-2 `ingest.yml` stub is not committed. It would fire on the issue label and fail, since nothing hands it the video or an API key. It stays in the draft below as a memo.

### Skills for Claude Code

- General-purpose skills come from [yamat47/github-toolkit](https://github.com/yamat47/github-toolkit), installed into `.claude/skills/` with `gh skill install yamat47/github-toolkit <name> --agent claude-code --scope project` (gh 2.90.0 or newer). They are unpinned, so `gh skill update --all` moves them to the latest release. The `metadata` block that `gh` writes into each `SKILL.md` records the source; do not edit installed skills by hand, since changes belong in github-toolkit.
- Installed from v1.10.0: `writing-conventions` (commit, PR and docs style, including the rules for Japanese prose), `create-pr`, `review-pr`, `grill-me` (used for the Code section above, and for the open questions below), `github-actions-workflows` (for `ci.yml` and `deploy.yml`), `skill-creator` (for refining `ingest-play` as reviews correct it), and `review-skill-update` and `review-dependency-bump` (for the update PRs below).
- `.github/workflows/update-skills.yml` calls github-toolkit's `update-skills` reusable workflow monthly and opens one PR when a release changes an installed skill. It is called at `@main` like the toolkit's actions; the skills themselves still move only when a release changes them. The workflow needs "Allow GitHub Actions to create and approve pull requests", which is requested in infra-github.
- `typescript-idioms` was installed from v1.10.0 with the site (step 6), the first PR with code outside `scripts/`.
- `ingest-play` is this repository's own skill and lives next to them in `.claude/skills/`.
- `.claude/settings.json` turns off the commit and PR attribution that Claude Code adds by itself. Commits are authored by yamat47.

## Tried and dropped

- v0.1 made concepts the nodes, in a tree with hand-written `parent` / `beats` / `pairs_with`. The actual videos turned out to diagram one play from one game rather than explain a concept, and one play is a composition of several concepts (`GY Counter` plus `Reverse` plus `Throwback`), so it does not fit one place in a tree. `situations` (3rd and medium, and so on) and `status: stub` went with it.
- Dify was considered and set aside. The real cost is getting the video and caption out of Instagram, and Dify has no node for that. The rest (ffmpeg, the LLM's judgment, git) is custom code either way, so a workflow builder in between does not shorten anything.
- No scraping of Instagram. The closest thing to "just hand over a URL" is yt-dlp with cookies (it also returns the full caption as metadata), but the terms are grey and the cookie's account can get restricted. The author hands over the video; the caption comes from oEmbed when the endpoint answers, and from the author otherwise.
- `vs.front` (4-2-5 and so on) is not a vocabulary. The field exists and accepts null.
- A React island for walking relations. The relations are derived at build time, so a chip is a link to a static page and the client has nothing to compute. An island is added when an interaction needs one.
- validate with a schema of its own (the draft's `validate.mjs`), next to the zod schema the site needs. Every new field would have been written twice.
- Biome, and Prettier with ESLint, for lint and format. Biome's `.astro` formatting is experimental and it has no Astro lint rules. Prettier plus ESLint with the Astro plugins covers the most of `.astro`, but is the slowest and needs the most configuration, and oxfmt formats `.astro` through the same `prettier-plugin-astro`, so the output is the same. Vite+ (`vp`) bundles the same oxlint, oxfmt and vitest behind one CLI and one config file, but Astro keeps its own dev and build commands, so `vp` would only wrap three scripts. `vp migrate` can bring it in later.
- Tailwind. Four page types and a handful of components do not need a utility framework.
- Vercel. GitHub Pages needs no account outside GitHub, and infra-github already manages the repository. The PR review is about content, so per-PR previews are not needed.
- A devcontainer (`.devcontainer/` with `devcontainer.json`) and a `scripts/dcc` wrapper around the devcontainer CLI, as in yamat47/waggle. The directory layout of waggle was taken; the tooling was not, since compose and a Makefile do the same job here without a CLI on the host.
- A `vitest.config.ts`. The only setting it would carry is the test pattern, and vitest's default already finds the `*.test.ts` files under `src/` and `scripts/`.
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
- Reading the diagrams: the notation is recorded under "Reading the diagram" in `DATA_MODEL.md`.
- In the cloud environment the Whisper model hosts (HuggingFace, Azure CDN) are blocked, so no transcript was produced. It works in a local Claude Code. All four plays have no transcript, and their `vs` is inferred from the diagram and the footage.
- The opponent is not always identifiable from the footage (for the Wisconsin game only "white jerseys, dark helmets" could be seen). `game.away: unknown` is accepted and validate warns about it.

## Still open

- Search that starts from the defense ("bunch plays against Cover 1"). How to present it. For a static site the candidate is Pagefind at build time; decide when the chips stop being enough.
- Whether `game` becomes a chip, for the day someone wants "that play from that game".
- Whether `situations` (short yardage, red zone and so on) comes back. It was dropped on the assumption that `vs` plus parts cover it; more videos may say otherwise.
- The GitHub Actions version that turns an issue into a PR. The stub is kept in the draft below and not committed. Issues cannot carry the video, so for now a local Claude Code runs the ingestion.
- More skills from github-toolkit once there is code for them: `frontend-design` for the look. Not `react-patterns`, since there is no React.
- Whether `kind` stays in a part's frontmatter. The directory already says it, validate checks that the two agree, and the collection id is `{kind}/{slug}`, so the field may be redundant. Decide when the first parts are written.
- Where a transcript lives. `video.transcript` is a field of the model, but extract writes the transcript into the gitignored inbox and nothing carries it into the repository, so the evidence behind a `high` confidence is gone after the PR. Either the skill copies it into the content and the field points at it, or the field goes and the skill quotes the lines into 「守備の読み」.
- Whether validate derives the slug prefix from `game`. The formula `{season}-{away}-{home}-{title-kebab}` is prose only, and how a team name becomes kebab (`mtsu`, `hou-christian`) is decided by hand each time. The plays from #23 and #24 kebab the full name in `game` instead (`houston-christian`, `texas-am`, `florida-state`), so the two habits already disagree.
- The diagram frame is taken at a fixed second (`AT=3` by default). When authors with another layout arrive, extract may need to find the still-to-film cut itself.
- Per-platform knowledge is spread by concern: hosts in `platformOf`, oEmbed endpoints and caption fields in `lookup.ts`, and the embed markup in `src/components/Embed.astro`. One record per platform would make a new platform a row rather than three edits. Step 6 added the embed and left the three apart to stay within its scope; do it when a third platform is added.
- `make dev` can refuse to start with "Another astro dev server is already running". Astro 7 writes `application/.astro/dev.json` with the server's PID and treats the server as alive while that PID is; a server stopped without removing it leaves the file in the bind mount, and the next container reuses the same small PIDs, so the dead server looks alive. Deleting the file is the workaround; `astro dev --ignore-lock` in the `dev` script would be the fix, since every `make dev` is a fresh container.
- The prose style of the Japanese part bodies. Some use arrows and "label: explanation" bullets that the writing conventions do not allow. Fix as they are touched.
- Every video handed over by offensive_guru and coachcarsonhart so far is a screen recording of the Instagram web page with no audio track. Extract's transcription fails on each one ("tuple index out of range" in `transcript.log`), so no play can reach `high` through a transcript, and the film fills only a small box in the left half of the frame. Each ingestion has cropped the diagram, the film and the comments by hand with ffmpeg in the container. Extract could report "no audio track" instead of a failure, and could write those three crops itself when the frame is a recording of the web page.
- `make extract` on a still image saved as `.mp4` (`offensive-guru-dehn7vpcblb`, a PNG screenshot of the post) stops with "no frame at second 3; the video is N/A s long". Extract, or the inbox page, could check the file type and say what it is.
- Every one of the 18 plays has `confidence: low`. Most coachcarsonhart diagrams draw no defense, and `medium` asks the diagram and the film to agree, so for those posts `medium` cannot be reached however clear the film is. Either the rubric gets a rule for film-only reads, or `low` is accepted for them and the coverage cues are grown from authors who draw or name the defense.
- A post with no play name. The LSU post (#24) has only "LSU put on a clinic last night" and "Great playcall on 3rd down", so its `title` is composed from the diagram's labels and marked in a comment, although the model says the title is the author's name verbatim. Decide whether that stays the rule or a play without a name gets a field for it.
- Title words with no part: Shift and Unbalanced (Northwestern, #23), Nub (North Texas, #23), Buck (Northwestern, #24). Each is kept in the title and a frontmatter comment. Add a part when a second play needs the same word.
- The draft at the end of this file still holds copies of files that are now real (the Bills play, `cover-1`). The draft's own note says the PR that makes one real deletes its copy; the PRs that added them did not.

## Next

The order is a guess and will change. Each step is one PR that is green on its own, and the PR that completes a step ticks its box. A fresh session takes the first unticked step and nothing else.

- [x] 1. Toolchain
- [x] 2. Schema, validate and tests
- [x] 3. infra-github: default branch and required check
- [x] 4. Ingestion: the skill and extract.sh
- [x] 5. The first plays
- [x] 6. The site
- [x] 7. Publishing
- [ ] 8. Growing the catalog

### 1. Toolchain

The PR adds (all of these moved into `application/` with the Docker PR) `package.json` (name `cutups`, `private`, `type: module`, every version exact), `package-lock.json`, `.node-version` with `22.22.0`, `tsconfig.json` extending `astro/tsconfigs/strict`, `astro.config.mjs` with `site: "https://cutups.yamat47.me"`, `src/pages/index.astro` with a placeholder heading, `src/styles/global.css` with the custom properties, `.oxlintrc.json` and `.oxfmtrc.json` that ignore `content/`, `docs/`, `dist/` and `.claude/`, `.gitignore` (`node_modules/`, `dist/`, `.astro/`, `inbox/*` with `!inbox/README.md`), `.github/workflows/ci.yml` with the one job `check`, and the `npm` entry in `.github/dependabot.yml` (monthly, one group). The scripts in `package.json` are `dev`, `build`, `check` (`astro check && oxlint src scripts && oxfmt --check`) and `fmt` (`oxfmt`). `ci.yml` runs `npm ci`, `npm run check`, `npm run build`. Dependencies are the latest at the time; on 2026-10-17 they were astro 7.4.0, oxlint 1.88.0, oxfmt 0.73.0 (with `@astrojs/compiler-rs`, its optional peer for `.astro`), plus `@astrojs/check` and `typescript`, which `astro check` needs.

The step is done when the PR's `check` job is green and `npm run build` writes `dist/index.html`.

### 2. Schema, validate and tests

The PR adds `src/content/schema.ts` (the zod schemas for a play and a part, with the fields from `DATA_MODEL.md`), `src/content.config.ts` (collections `plays` and `components` over `content/plays` and `content/components` through the glob loader), `src/lib/validate.ts` (the cross-file rules as pure functions over parsed objects), `scripts/validate.ts` (reads the files, runs the schema and the rules, prints warnings in yellow and errors in red, exits 1 on an error, and ends with the line `N plays, M components: E errors, W warnings`), `src/lib/validate.test.ts`, the `test` (`vitest run`) and `validate` (`node scripts/validate.ts`) scripts, both added to `ci.yml` and to the `ci` script, a `.gitkeep` in `content/plays/` and in each `content/components/{kind}/`, and `DATA_MODEL.md` at the root, rewritten from the draft with the paths of this plan. `CLAUDE.md` gets its entry points (`npm run validate`, `npm run check`).

The rules to test, each with a fixture: a referenced part that does not exist is an error, `variant_of` pointing outside its kind is an error, a missing body heading is an error, an empty `components` is an error, `confidence: low` is a warning, a `builds_on` that does not exist yet is a warning, `game.away: unknown` is a warning, a `video.url` outside instagram.com, x.com and twitter.com is a warning.

The step is done when `npm run validate` on the empty tree ends with `0 plays, 0 components: 0 errors, 0 warnings`, `npm test` passes, and `check` runs both.

### 3. infra-github: default branch and required check

In the infra-github repository, not this one: remove `manage_default_branch = false` from the `cutups` entry and set `required_checks` to `["check"]`. The author does this; a session here can only remind. Ticked when both are merged there.

### 4. Ingestion: the skill and extract.sh

The PR adds `.claude/skills/ingest-play/SKILL.md` and `pr-template.md`, `application/scripts/extract.sh`, `application/inbox/README.md`, ffmpeg and faster-whisper in the `Dockerfile` with a `make extract` target, and the confidence rubric and the diagram notation in `DATA_MODEL.md`.

The step is done when `make extract NAME=test` writes `sheet_1.jpg` and `diagram_1.png` to `diagram_3.png` and reports no speech for a synthetic video made with `ffmpeg -f lavfi -i testsrc=duration=12:size=1180x2556:rate=30 -f lavfi -i sine=frequency=440:duration=12 -pix_fmt yuv420p inbox/test.mp4` next to an empty `inbox/test.yaml`, and `python3 .claude/skills/skill-creator/scripts/quick_validate.py .claude/skills/ingest-play` passes.

### 5. The first plays

The author hands over videos one at a time through `make inbox`, which writes the video and its sidecar, and runs `/ingest-play` in a local Claude Code. One play is one branch is one PR, and the review is the curation. The four videos under "What four videos taught" come first: their URLs are known, and the parts and `vs` in the table are the expected result. Whatever the review corrects goes back into the skill or the part's 「見分け方」 in the same PR.

The step is ticked when two plays are on `main`, so that the site in step 6 has a shared part to show. Ingestion continues through every later step.

### 6. The site

The PR adds `src/lib/relations.ts` (the derived views of `DATA_MODEL.md`: the plays of a part, same picture, same scheme with `variant_of` families as one, plays against a coverage, the reverse of `builds_on`), `src/lib/relations.test.ts`, `src/layouts/Base.astro`, `src/components/Chip.astro`, `PlayCard.astro` and `Embed.astro` (the Instagram and X blockquotes from the data model), and the pages `src/pages/index.astro` (the play list), `src/pages/plays/[slug].astro`, `src/pages/[kind]/index.astro` and `src/pages/[kind]/[slug].astro`. It also installs `typescript-idioms` from github-toolkit (`gh skill install yamat47/github-toolkit typescript-idioms --agent claude-code --scope project`) and reads it first.

The PR also added what the pages share: `src/lib/catalog.ts` (the collections as entries), `labels.ts` (the Japanese words for values of the model), `hrefs.ts` (the URLs) and `src/components/PlayList.astro`.

The step is done when `npm run build` writes a page for every play and every part, the chips on a play page link to `/{kind}/{slug}/`, and `/coverage/{slug}/` lists the plays whose `vs.coverage` is that slug.

### 7. Publishing

The PR adds `.github/workflows/deploy.yml`: on push to `main`, build, then `actions/upload-pages-artifact` and `actions/deploy-pages`, with `pages: write` and `id-token: write` on the deploy job, through github-toolkit's wrappers at `@main`. The author adds `pages` with `cname = "cutups.yamat47.me"` to the `cutups` entry in infra-github and the DNS record.

Done: `https://cutups.yamat47.me/` serves the play list. The `pages` block went in with yamat47/infra-github#28 and the DNS record with yamat47/infra-yamat47#62. The certificate was issued only after the custom domain was removed and saved again in the repository's Pages settings, since the domain had been set before its DNS record existed and GitHub did not retry the check; with the same value, Terraform sees no difference. HTTPS is enforced by the follow-up in infra-github that drops `https_enforced = false`.

### 8. Growing the catalog

Not one PR. Five to ten more videos to grow the part vocabulary and the coverage recognition cues, then `frontend-design` from github-toolkit for the look, then the items under "Still open" as the content makes them concrete. This step is never ticked.

## How the work goes

- The author hands over a video and its caption, Claude Code opens a PR through `/ingest-play`, the author reviews and merges. Whatever the review corrected is written back into the skill or into a part's 「見分け方」, so the next video from the same author does not repeat it.
- Model changes are small and come with their reason. The move from v0.1 to v0.2 only became necessary after two real videos had been processed. The order stays: process videos, then fix what got in the way.
- Changing an existing part's definition is its own PR, separate from adding plays.

## The draft (playbook-v0.4.zip)

The reference the code is rewritten from. The zip is gone, so these copies are all that is left of it. The play and part files show the shape a new play or part takes; they are not restored as content. When a PR makes one of these files real, it deletes the copy here.

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
