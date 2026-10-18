---
title: Buck Influence Trap
title_ja: バック・インフルエンス・トラップ
phase: offense

# The caption only tags Northwestern, and no scoreboard is in frame. The game is at Ryan Field
# (the purple N at midfield) at night on FOX. Of Northwestern's 2026 home games before the post
# (about 2026-10-06), Penn State (Friday night, 2026-10-02, on FOX) fits the night, the network
# and the defense's white jerseys with navy. The opponent is inferred.
game:
  season: 2026
  away: Penn State
  home: Northwestern
  level: ncaa
  offense: Northwestern

components:
  # "Buck" is the Wing-T buck sweep the guards' pulls imitate; it has no part.
  motion: orbit # H's dotted path behind the backfield; a comment also calls it orbit motion
  run: influence-trap

vs:
  # A guess between the two-high zones; Cover 2 is not ruled out.
  coverage: quarters
  confidence: low
  evidence: >-
    The diagram has two safeties deep (FS and SS) and both corners off at about eight yards.
    The broadcast also shows two defenders deepest between the hashes before the snap, so the
    diagram and the film agree on two deep. Which of the outside defenders are the corners
    cannot be told in the film, and the coverage after the snap is not visible behind the
    run.
  front: null

video:
  url: https://www.instagram.com/reel/DeI4x3Tq1RM/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    You love to see it!!

    #collegefootball
    #highschoolfootball
    #cfb
    #texashighschoolfootball
    #northwesternfootball
  transcript: null
---

## このプレーの何が面白いか

ウイングTのバック・スイープに見える2人のガードのプルで、守備のDTを外へ誘い出してから、そのDTを横からトラップしている。DTの正面のガードはブロックに来ずに外へ出ていくので、DTはスイープが来たと思って付いていこうとする。その間にFが中央をまっすぐ抜けた。Hのオービット・モーションとQBの左右へのフェイクで、コメント欄の言葉では「守備のほとんどがボールの場所を分かっていなかった」。同じNorthwesternの Shift to Unbalanced Quads Empty Wing H-Across Tackle Trap Bluff Bubble も、OLのフォルス・プルで守備を寄せてから逆へボールを出した。コメント欄はどちらにもChip Kellyの名前を挙げている。

## 展開

図から読んだ内容で、ブロックの細部は映像では確かめていない。

- 隊形は左にL(外)とH(ウイング)、右にY(TE)とR(ウイング)。QBはセンターの真後ろに立ち、F(図の青)はその後ろに立つ。
- スナップ前、Hがバックフィールドの後ろを弧を描いて右へ回り込む(図の点線のオービット)。
- スナップ後、両方のガード(図の赤)がラインの後ろへ下がってプルする。1人はDTの前から外へ出て、DTを外へ誘い出す。もう1人は逆サイドからそのDTに横から当たる。
- ほかのOLとY、Rは2列目のLBとセーフティへ向かう。
- QBはFにボールを渡し、その後、左右へのフェイクの動きを見せる(図の下の2本の矢印)。
- F(図の青の線)は2人のプルの間、センターのすぐ横をまっすぐ抜ける。
- 映像ではボールキャリアがそのまま走り切り、エンドゾーンの近くまで守備に追われる。得点になったかは映像では確かめていない。

## 守備の読み

図ではFSとSSが2人とも深いところに立ち、両方のコーナーが8ヤードほど離れて構える。Quartersの見分け方を順に当てると、1つ目のセーフティ2人は、中継の映像でもスナップ前にハッシュの間で一番深い2人が立っていて、図と映像が合う。2つ目のコーナーは、図では離れて構えているが、映像では外の守備のうち誰がコーナーかを見分けられない。3つ目のオービット・モーションへの反応は、映像では確かめられなかった。

図と映像が合うのは1つ目だけで、2つ目は図でしか確かめられない。Quartersと仮置きし、Cover 2との区別もつかないので、`confidence` は low にした。コメント欄には「セーフティは何をしていたのか」という声があり、ランへの反応が遅れたと読める。
