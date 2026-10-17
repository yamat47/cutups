# cutups: a catalog of football play examples

The repository is the database. One video is one play example in `content/plays/*.md`. Concepts live in `content/components/` as parts, and a play is a composition of parts.

`docs/plan.md` is the working log and the hand-over between sessions. Read it first, in full. "How a session starts" says how to pick up the work, and the first unticked step under "Next" is the work. Until `DATA_MODEL.md` exists at the root, the model is the copy in the draft at the end of the plan.

## Rules

- `vs` is required. A guess is fine, but it always comes with `confidence` and `evidence`.
- When a part is missing, add `content/components/{kind}/{slug}.md` in the same PR. Read every existing part before adding one.
- Never write relations (derivatives, series, counters) by hand. They are derived from shared parts at build time.
- Never commit video files (`inbox/` is gitignored).
- Mark every inference, in a frontmatter comment or in the PR body. Do not state a guess as fact.
- Play and component bodies are written in Japanese for the readers. Titles and part names use the English that the author or coaches use; the Japanese goes in `title_ja`. Everything else in the repository (docs, code, commits) is English.
- Skills under `.claude/skills/` installed from github-toolkit are not edited here; changes belong in that repository. `ingest-play` is this repository's own skill.
- Commits and pull requests carry no AI attribution. `writing-conventions` governs every commit, PR and document.
