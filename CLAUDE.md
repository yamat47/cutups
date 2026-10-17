# cutups: a catalog of football play examples

The repository is the database. One video is one play example in `content/plays/*.md`. Concepts live in `content/components/` as parts, and a play is a composition of parts.

`docs/plan.md` is the working log and the hand-over between sessions. Read it first, in full. "How a session starts" says how to pick up the work, and the first unticked step under "Next" is the work. The model is in `DATA_MODEL.md`.

## Entry points

- Check the content: `make validate` (always before a PR)
- Check the code: `make check`, `make test`
- Everything CI runs: `make ci`

## Rules

- `vs` is required. A guess is fine, but it always comes with `confidence` and `evidence`.
- When a part is missing, add `content/components/{kind}/{slug}.md` in the same PR. Read every existing part before adding one.
- Never write relations (derivatives, series, counters) by hand. They are derived from shared parts at build time.
- The Astro project is `application/`; the root holds the development container (`Dockerfile`, `compose.yaml`, `Makefile`), the docs and CI. Node runs only in the container: use the `make` targets (`make install` once, `make ci` before a PR) and never run npm on the host. Where there is no Docker (Claude Code on the web), run the npm scripts in `application/` directly and say so in the PR.
- Never commit video files (`inbox/` is gitignored).
- Mark every inference, in a frontmatter comment or in the PR body. Do not state a guess as fact.
- Play and component bodies are written in Japanese for the readers. Titles and part names use the English that the author or coaches use; the Japanese goes in `title_ja`. Everything else in the repository (docs, code, commits) is English.
- Skills under `.claude/skills/` installed from github-toolkit are not edited here; changes belong in that repository. `ingest-play` is this repository's own skill.
- Commits and pull requests carry no AI attribution. `writing-conventions` governs every commit, PR and document.
