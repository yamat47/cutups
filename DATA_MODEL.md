# Data model v0.3

The schema is code. Under `application/`, `src/content/schema.ts` holds the zod schemas for a play and a part, the site's collections (`src/content.config.ts`) and the validate script (`scripts/validate.ts`) both read it, and `src/lib/validate.ts` holds the rules that span files. This document explains the model; when the two disagree, the code is what runs and this document is what needs the fix.

## Principles

1. One video is one play example is one file. That is the only kind of node.
2. A play is a composition of parts: formation, motion, run scheme, pass concept, action. The author's title (for example _Y-Short Bunch Trail_) is parsed into parts.
3. The video explains the play. A play file records the game, the parts and the video, and nothing else: no commentary, no reading of the defense, no translation.
4. Relations are never written by hand. They are derived from shared parts. The one exception is `builds_on`.
5. The vocabulary grows from examples. When a part is missing, the part file is added in the same PR. A part is a name: its title, its aliases and its place in a family.
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
```

A play's slug is `{season}-{away}-{home}-{title-kebab}`. The same play name in the same game is unlikely to repeat. A part's id is `{kind}/{slug}`, its path under `content/components/`.

## A play example

```yaml
---
title: Y-Short Bunch Trail          # the author's name for it, verbatim
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

builds_on: null                     # optional. Only when the author says this play was designed against that play.

video:
  url: https://www.instagram.com/reel/DecbK2ZAxuD/
  author: playdesignerpro
  kind: diagram+film                # diagram+film | film | diagram | talk
  caption: null                     # the caption verbatim, for authors who name the play there
  transcript: null                  # relative path to the transcript when one exists
---
```

The file ends at the frontmatter. An inference is marked where it is made, as a YAML comment next to the field, so that a reader of the file sees it without the PR.

| Field                               | Required | Notes                             |
| ----------------------------------- | -------- | --------------------------------- |
| title, phase, game                  | yes      |                                   |
| components                          | yes      | every value must have a part file |
| builds_on                           | no       |                                   |
| video.url, video.author, video.kind | yes      |                                   |

## A part

```yaml
---
kind: pass                          # formation | motion | run | pass | action
title: Trail                        # the English name coaches use
aliases: [Return, Whip]
variant_of: null                    # optional. The parent slug in the same kind (gy-counter -> counter)
---
```

A part ends at the frontmatter too. Before adding one, every existing part is read, aliases included, so that the same thing is not added twice under another name.

## What validate checks

`make validate` runs `scripts/validate.ts` over `content/`. The schema holds what fails one file's frontmatter; the rules in `src/lib/validate.ts` hold what zod cannot express: references between files, the body, and warnings. The script runs both and ends with the line `N plays, M components: E errors, W warnings`. An error exits 1.

| Finding                                                                                           | Level   |
| ------------------------------------------------------------------------------------------------- | ------- |
| frontmatter missing, YAML that does not parse, a field the schema rejects, a key it does not know | error   |
| a referenced part that does not exist under its kind                                              | error   |
| `variant_of` that does not exist under the same kind, or points at the part itself                | error   |
| a file name that is not a slug (Astro would give the file a different id)                         | error   |
| `kind` that disagrees with the directory                                                          | error   |
| anything below the frontmatter                                                                    | error   |
| an empty `components`                                                                             | error   |
| `builds_on` naming a play that does not exist yet                                                 | warning |
| `game.away` or `game.home` of `unknown`                                                           | warning |
| `video.url` outside instagram.com, x.com and twitter.com                                          | warning |

## Derived at build time

| Derived view                            | Rule                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| part page                               | every play that has the part                                                        |
| same picture, different play (a series) | same formation and motion, different run / pass / action                            |
| same scheme                             | same run or same pass; parts sharing a `variant_of` parent are listed as one family |
| counters                                | the reverse of builds_on                                                            |
| search index                            | title / aliases (parts included) / game                                             |

## How the site is navigated

A play page shows its parts as chips. A chip leads to the list of plays that share it.

## Where authors put the play name

| Author          | Where                             | Grammar                                                                                                          |
| --------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| playdesignerpro | overlay inside the video          | `game` + `Motion Formation Concept`                                                                              |
| offensive_guru  | the caption (truncated on screen) | `Team Formation ➡️ Concept`                                                                                       |
| coachcarsonhart | the heading above the diagram     | `Season Team - Concept`, or a sentence (`Miami running Mesh on 3rd Down out of Bunch`); some posts name no play |

For authors who name the play in the caption, the caption text is handed over with the video. When the caption was cut off, the inferred part of `title` is marked in a comment.

## Reading the diagram

In PlayDesignerPro-style diagrams a bar at the end of a line is a block, an arrow is a route, a zigzag is a motion, and a yellow or orange line is where the ball went. A short bar in the middle of a route is a bluff, a fake block before the route.

coachcarsonhart's diagrams mark the players by role rather than the ball's path: blue for receivers, yellow for TEs and wings, red for the ball carrier and for the linemen the play turns on (the trapping guard, the pullers), black for everyone else. A boxed number is the QB's progression.

## Dropped since v0.1

- `parent` / `beats` / `pairs_with`: replaced by derivation.
- `situations`: removed for now. Parts cover it. Can come back later.
- `status: stub`: a part may exist with zero plays, so stubs are not needed.
- `vs` and the coverage parts (v0.3): the author decided the defense is not collected. Without a transcript or a caption naming it, the reading stayed a guess on all 18 plays.
- `title_ja`, the play bodies (「このプレーの何が面白いか」「展開」「守備の読み」) and the part bodies (「何か」「見分け方」) (v0.3): the video explains the play, and the site carries the English names only.
