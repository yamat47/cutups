---
name: ingest-play
description: Turn a football play video in application/inbox/ (with its sidecar of url, author and caption) into a play example under application/content/plays/, add the parts it needs under application/content/components/, run validate, and open one draft PR per play. Use whenever a video or a batch of videos is handed over, whenever the user says to ingest, add, register or take in a play, a reel, a clip or a cutup, and whenever a file appears in application/inbox/. Runs in a local Claude Code with Docker; the extraction needs ffmpeg in the container.
---

# /ingest-play

Input: `application/inbox/<name>.mp4` and the sidecar `application/inbox/<name>.yaml` described in `application/inbox/README.md`. When the sidecar is missing but the URL is known, `make lookup URL=<url>` gives the author and the caption; ask for the rest. The caption matters because some authors name the play there.
Output: `application/content/plays/<slug>.md`, plus any new part under `application/content/components/{kind}/`. One play is one branch is one PR. With several videos, finish one before starting the next.

`DATA_MODEL.md` holds the file shapes, the field rules, the confidence rubric and the notes on each author. Read it once per session, before the first play. The rules in `CLAUDE.md` apply throughout.

## Steps, in this order

1. **Make the material**: from the repository root, `make extract NAME=<name>`. It writes `application/inbox/<name>/`; read every image there with the Read tool (the sheets, one frame per second, and the three diagram strips) and the transcript when there is one. When the diagram is not on screen at second 3, rerun with `AT=<second>`.

2. **Read what exists**: once per session, every file under `application/content/components/` and `application/content/plays/`; for later plays in the same session, only what the session added. Before creating a part, check that nothing existing matches, aliases included.

3. **Parse the name**: split the author's title or caption into parts, following "Where authors put the play name" in `DATA_MODEL.md`.

4. **Choose the parts**: formation, motion, run, pass, action; omit the kinds the play does not have. A new part follows "A part" in `DATA_MODEL.md`, and a parent exists before its variant does.

5. **Read the defense**: check the frames against the 「見分け方」 of the coverage parts read in step 2, in the order those sections follow, and set `confidence` by the rubric under `vs` in `DATA_MODEL.md`.

6. **Write the play**: follow "A play example" in `DATA_MODEL.md`. When an existing play shares parts with this one, 「このプレーの何が面白いか」 names the contrast (same parts, a different way of selling it, and so on).

7. **Validate**: `make validate`. Fix every error. Carry each warning (`confidence: low`, an unknown team, and so on) into the PR body.

8. **Open the PR**: branch `play/<slug>`, one commit `content: add <title>` whose body says what was inferred and from what. Open a draft PR with `gh pr create --draft`; the body follows `.claude/skills/ingest-play/pr-template.md`.

## In addition to the rules in CLAUDE.md, never

- Raise `confidence` without evidence from the frames, the transcript or the caption.
- Change an existing part's definition in passing. That is its own PR.
