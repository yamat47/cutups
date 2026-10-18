---
name: ingest-play
description: Turn football play videos in application/inbox/ (each with its sidecar of url, author and caption) into play examples under application/content/plays/, add the parts they need under application/content/components/, run validate, and open one draft PR for the batch. Use whenever a video or a batch of videos is handed over, whenever the user says to ingest, add, register or take in a play, a reel, a clip or a cutup, and whenever a file appears in application/inbox/. Runs in a local Claude Code with Docker; the extraction needs ffmpeg in the container.
---

# /ingest-play

Input: `application/inbox/<name>.mp4` and the sidecar `application/inbox/<name>.yaml` described in `application/inbox/README.md`. When the sidecar is missing but the URL is known, `make lookup URL=<url>` gives the author and the caption; ask for the rest. The caption matters because some authors name the play there.
Output: `application/content/plays/<slug>.md`, plus any new part under `application/content/components/{kind}/`. Both are frontmatter only: the video explains the play, so nothing is written below the frontmatter, and nothing is translated into Japanese. The videos handed over together go in one branch and one PR, with one commit per play.

`DATA_MODEL.md` holds the file shapes, the field rules and the notes on each author. Read it once per session, before the first play. The rules in `CLAUDE.md` apply throughout.

## Steps, in this order

1. **Make the material**: from the repository root, `make extract NAME=<name>`. It writes `application/inbox/<name>/`; read every image there with the Read tool (the sheets, one frame per second, and the three diagram strips) and the transcript when there is one. When the diagram is not on screen at second 3, rerun with `AT=<second>`.

2. **Read what exists**: once per session, every file under `application/content/components/` and `application/content/plays/`; for later plays in the same session, only what the session added. Before creating a part, check that nothing existing matches, aliases included.

3. **Parse the name**: split the author's title or caption into parts, following "Where authors put the play name" in `DATA_MODEL.md`.

4. **Choose the parts**: formation, motion, run, pass, action; omit the kinds the play does not have. A new part follows "A part" in `DATA_MODEL.md`, and a parent exists before its variant does.

5. **Write the play**: follow "A play example" in `DATA_MODEL.md`. The game, the parts read from the diagram rather than the title, and anything else inferred get a YAML comment next to the field.

6. **Validate**: `make validate`. Fix every error. Carry each warning (an unknown team, and so on) into the PR body.

7. **Open the PR**: branch `play/<slug>` for one play, or a branch named for the batch; one commit `content: add <title>` per play, whose body says what was inferred and from what. Open a draft PR with `gh pr create --draft`; the body follows `.claude/skills/ingest-play/pr-template.md`.

## In addition to the rules in CLAUDE.md, never

- Record the defense the play met. The coverage is not collected.
- Write commentary on a play or a definition of a part.
- Change an existing part in passing. That is its own PR.
