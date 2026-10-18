---
title: Long Trap
title_ja: ロング・トラップ
phase: offense

# The overlay names Texas and 2025. Texas A&M is read from the maroon pants and white jerseys of
# the defense, and the game is at Austin from the Longhorn logo at midfield; the 2025 meeting was
# in Austin. No scoreboard is in frame, so the opponent is inferred.
game:
  season: 2025
  away: Texas A&M
  home: Texas
  level: ncaa
  offense: Texas

components:
  formation: 2x2 # inferred from the diagram after the motion; the overlay names no formation
  motion: y-short # the diagram's "Short Motion": Y comes in from the left to the TE spot
  run: long-trap

vs:
  # A guess between the single-high coverages; Cover 1 is not ruled out.
  coverage: cover-3
  confidence: low
  evidence: >-
    The diagram has one FS deep in the middle and the SS down at about nine yards, with both
    corners off at about six yards. The broadcast shows one defender deepest in the middle
    before the snap, which matches, but the corners are out of frame or too small to judge.
    Nobody visibly follows Y's short motion. A comment says the Mike hit the wrong gap, so
    the run's success says little about the coverage.
  front: null

video:
  url: https://www.instagram.com/reel/DbbrvZiS19C/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    2025 Texas - Long Trap

    #collegefootball
    #offensivecoordinator
    #highschoolfootball
    #nfl
    #texaslonghorns
  transcript: null
---

## このプレーの何が面白いか

右ガードがボールの反対側、左の端のエッジまで長くプルしてトラップしている。普通のトラップならすぐ隣のDTに当たるところを、ラインの一番外まで行くので、左のエッジ(図のJ)はブロックが来ないと思ってバックフィールドへ入ってくる。そこへ横から当たられ、Fはその内側を抜けた。コメント欄では、守備のMikeが間違ったギャップに入って自分で道をふさいだと指摘されていて、「この作者の投稿は攻撃の見事さより守備のミスだ」という声もある。同じTexasの Long Trap + Bubble Stalk-Slant RPO は、このロング・トラップにRPOを重ねて、Ohio State戦の終盤に使っている。

## 展開

図から読んだ内容で、ブロックの細部は映像では確かめていない。

- スナップ前、Yが左の外から内側へ短くモーションし、左タックルの外でTEの位置に付く(図の「Short Motion」、映像の黄色の線)。
- 隊形は左にL(外)とY(TE)、右にH(スロット)とR(外)。QBはショットガンで、F(RB)はQBの右に立つ。
- スナップ後、右ガード(図の赤)がラインの後ろを左へ長く横切り、左の端のエッジ(J)に横から当たる。
- ほかのOLは内側のDTと2列目のLBへ向かい、Yは左のLB(B)に当たる。Lは左のコーナーをブロックする。
- 右ではHが$に当たり、Rは外へ流れる。
- QBはFにボールを渡し、F(背番号5)はプルの後ろではなく、トラップの当たったところのすぐ内側を縦に抜ける。
- 映像ではFが左のサイドライン寄りへ出て大きく前進する。どこで倒されたかは映像の切り替わりで確かめていない。

## 守備の読み

図ではFSが中央の深いところに1人、SSが9ヤードほどに下り、両方のコーナーが6ヤードほど離れて構えている。Cover 3の見分け方を順に当てると、1つ目の深いセーフティ1人は、中継の映像でも中央の一番深いところに1人が立っていて合う。2つ目のコーナーは、図では離れて構えているが、映像では左のコーナーが画面の外で、右も小さくて構えを判断できない。3つ目のモーションへの反応は、Yのショートモーションに付いて動く守備は見えなかった。

セーフティが1人で、モーションに誰も付かないことからCover 3と仮置きした。コーナーの構えを映像で確かめられず、Cover 1との区別はつかないので、`confidence` は low にした。守備のMikeのミスはランの結果の説明にはなるが、カバーを読む手がかりにはならない。
