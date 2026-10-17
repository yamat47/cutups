# Data model v0.2.1

The schema is code. Under `application/`, `src/content/schema.ts` holds the zod schemas for a play and a part, the site's collections (`src/content.config.ts`) and the validate script (`scripts/validate.ts`) both read it, and `src/lib/validate.ts` holds the rules that span files. This document explains the model; when the two disagree, the code is what runs and this document is what needs the fix.

## Principles

1. One video is one play example is one file. That is the only kind of node.
2. A play is a composition of parts: formation, motion, run scheme, pass concept, action. The author's title (for example _Y-Short Bunch Trail_) is parsed into parts.
3. `vs` is required. It records the defense the opponent actually showed on this play, not what the play is meant to beat. A guess is allowed, with evidence.
4. Relations are never written by hand. They are derived from shared parts. The one exception is `builds_on`.
5. The vocabulary grows from examples. When a part is missing, the part file is added in the same PR.
6. Video files never enter the repository. Only the URL is stored, and the site shows the official embed.

## Directory layout

Under `application/`:

```
content/
  plays/
    2026-bills-rams-y-short-bunch-trail.md
    2026-delaware-mtsu-gy-counter-reverse-throwback.md
  components/
    formation/  bunch.md
    motion/     y-short.md
    run/        counter.md  gy-counter.md
    pass/       trail.md
    action/     reverse.md  throwback.md
    coverage/   cover-1.md
```

A play's slug is `{season}-{away}-{home}-{title-kebab}`. The same play name in the same game is unlikely to repeat. A part's id is `{kind}/{slug}`, its path under `content/components/`.

## A play example

```yaml
---
title: Y-Short Bunch Trail          # the author's name for it, verbatim
title_ja: Yショート・バンチ・トレイル
phase: offense                      # offense | defense | kick

game:
  season: 2026
  away: Bills
  home: Rams
  level: nfl                        # nfl | ncaa | other
  offense: Bills                    # the team on offense, one of away and home

components:                         # each value must exist as components/{kind}/{slug}.md
  formation: bunch
  motion: y-short
  pass: trail
  # omit run / action when the play has none
  # action: [play-action, bluff]    # a list when the play has more than one of a kind

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
  transcript: null                  # relative path to the transcript when one exists
---

## このプレーの何が面白いか
(The editor's voice. Written for every play.)

## 展開
(Who moves where. Bullets.)

## 守備の読み
(The long form of `vs.evidence`: what in the footage led to the call.)
```

The body headings are Japanese because the body is for Japanese readers. Their names are fixed. An inference is marked where it is made, as a YAML comment next to the field, so that a reader of the file sees it without the PR.

### Required and optional

| Field                                   | Required | Notes                                            |
| --------------------------------------- | -------- | ------------------------------------------------ |
| title, title_ja, phase, game            | yes      |                                                  |
| components                              | yes      | every value must have a part file                |
| vs.coverage, vs.confidence, vs.evidence | yes      | `low` is fine                                    |
| vs.front, builds_on                     | no       |                                                  |
| video.url, video.author, video.kind     | yes      |                                                  |
| three body headings                     | yes      | 「守備の読み」 is the long form of `vs.evidence` |

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

Because `vs` is required, reading the defense has to get cheaper. The 「見分け方」 section of a coverage part doubles as the checklist that is run against the frames. For example:

- cover-1: one safety deep in the middle, corners squared up on receivers, a defender follows motion
- cover-3: one safety deep in the middle, corners backpedal deep and outside, nobody follows motion
- cover-2: two safeties deep on the hashes, corners jam and stay shallow

## What validate checks

`make validate` runs `scripts/validate.ts` over `content/`. The schema holds what fails one file's frontmatter; the rules in `src/lib/validate.ts` hold what zod cannot express: references between files, the body headings, and warnings. The script runs both and ends with the line `N plays, M components: E errors, W warnings`. An error exits 1.

| Finding                                                                                           | Level   |
| ------------------------------------------------------------------------------------------------- | ------- |
| frontmatter missing, YAML that does not parse, a field the schema rejects, a key it does not know | error   |
| a referenced part that does not exist under its kind, including `vs.coverage`                     | error   |
| `variant_of` that does not exist under the same kind, or points at the part itself                | error   |
| a file name that is not a slug (Astro would give the file a different id)                         | error   |
| `kind` that disagrees with the directory                                                          | error   |
| a missing body heading                                                                            | error   |
| an empty `components`                                                                             | error   |
| `confidence: low`                                                                                 | warning |
| `builds_on` naming a play that does not exist yet                                                 | warning |
| `game.away` or `game.home` of `unknown`                                                           | warning |
| `video.url` outside instagram.com, x.com and twitter.com                                          | warning |

## Derived at build time

| Derived view                            | Rule                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| part page                               | every play that has the part                                                        |
| same picture, different play (a series) | same formation and motion, different run / pass / action                            |
| same scheme                             | same run or same pass; parts sharing a `variant_of` parent are listed as one family |
| plays used against this defense         | grouped by vs.coverage                                                              |
| counters                                | the reverse of builds_on                                                            |
| search index                            | title / title_ja / aliases (parts included) / game                                  |

## How the site is navigated

A play page shows its parts and its `vs` as chips. A chip leads to the list of plays that share it. The search box is secondary; the main movement is pivoting through chips.

## Where authors put the play name

| Author          | Where                             | Grammar                             |
| --------------- | --------------------------------- | ----------------------------------- |
| playdesignerpro | overlay inside the video          | `game` + `Motion Formation Concept` |
| offensive_guru  | the caption (truncated on screen) | `Team Formation ➡️ Concept`         |

For authors who name the play in the caption, the caption text is handed over with the video. When the caption was cut off, the inferred part of `title` is marked in a comment.

## Dropped since v0.1

- `parent` / `beats` / `pairs_with`: replaced by derivation.
- `situations`: removed for now. `vs` and parts cover it. Can come back later.
- `status: stub`: a part may exist with zero plays, so stubs are not needed.
