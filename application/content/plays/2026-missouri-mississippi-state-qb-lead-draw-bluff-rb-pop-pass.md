---
title: QB Lead Draw Bluff RB Pop Pass
title_ja: QBリード・ドローのブラフからRBのポップ・パス
phase: offense

# The handover is one screenshot of the post, not the video: the diagram and a single pre-snap
# frame. The scoreboard reads No. 19 Missouri 0, No. 24 Mississippi State 7, both 3-0, and the
# Bulldogs end zone puts the game in Starkville. The season is inferred from the post date
# (2026-10-06).
game:
  season: 2026
  away: Missouri
  home: Mississippi State
  level: ncaa
  offense: Mississippi State

components:
  formation: 2x2 # inferred from the diagram; the caption names no formation
  run: qb-lead-draw # the draw is the fake; the ball is thrown
  pass: pop-pass
  action: bluff

vs:
  # A guess from the diagram alone; Cover 0 is not ruled out.
  coverage: quarters
  confidence: low
  evidence: >-
    The diagram has no defender deep in the middle. The two safeties stand at about six to
    seven yards over the slots, and each runs with his slot when the slot goes vertical, as do
    both corners with the outside receivers. Four defenders carrying four verticals with the
    middle left open reads as quarters with the safeties matching the second receiver. Only
    one pre-snap frame of film was handed over, and the deep defenders are not readable in it.
  front: null

video:
  url: https://www.instagram.com/reel/DeHn7VPCblB/
  author: offensive_guru
  kind: diagram+film # the post is a reel; only a screenshot of it was handed over
  caption: |-
    Mississippi State Bulldogs QB Lead Draw Bluff ➡️ RB Pop Pass

    #nfl
    #collegefootball
    #highschoolfootball
    #football
    #offensivecoordinator
  transcript: null
---

## このプレーの何が面白いか

4人のレシーバーを全員縦に走らせて深い守備を後ろへ押し下げ、空いた中央へRBを浮かせている。RBはQBリード・ドローのリードブロックに行くふりでMに向かい、Mがドローを止めようと前へ構えた瞬間、その横を抜けて背中へ出る。図では4人の深い守備がそれぞれ縦のレシーバーに付いて下がり、中央の深いところには誰も残らない。縦の4本は投げる先ではなく、RBのための場所を空ける役目を負っている。

## 展開

渡されたのは投稿の画面1枚で、図とスナップ前の映像1コマしかない。以下はすべて図から読んだもので、ボールの行方や結果は確かめていない。

- 隊形は左にX(外)とH(スロット)、右にY(スロット)とZ(外)の2x2。QBはショットガンで、RBはQBの左に立つ。
- スナップ後、OLはパスを守るように構え、守備の前の4人を受ける。
- QBは前へ踏み出し、ドローで中央を走る構えを見せる。
- RBはQBの前を右のAギャップへ走り込み、Mへリードブロックに行くふりをする(線の途中の棒がブラフ)。
- RBはMの手前で縦に抜け、Mの背中の空いたところへ出る(図のオレンジから黄色の線)。
- X、H、Y、Zの4人は全員縦に走り、それぞれに付いた守備を深いところへ連れていく。

## 守備の読み

図ではスナップ前の深い守備がそろわない。左のコーナーはXの2ヤードほど前、FSはHの6ヤードほど前、$はYの7ヤードほど前、右のコーナーはZから13ヤードほど離れている。中央の深いところには誰もいない。

Quartersの見分け方を順に当てると、1つ目のセーフティ2人は、2人とも8ヤードより浅く、深いとは言えない。2つ目のコーナーは、右は大きく離れているが左はラインの近くで、片方しか合わない。3つ目はモーションがないので確かめられない。4つ目の、セーフティが内側の2番目のレシーバーを見る動きは図の線と合う。FSはHに、$はYに付いて縦に下がっている。

4人がそれぞれのレシーバーに付いて縦に下がり、中央の深いところを空けた形から、2番目のレシーバーに合わせるQuartersと仮置きした。中央に誰もいないことはCover 0とも取れる。映像はスナップ前の1コマしかなく、深い守備の人数も読めないので、`confidence` は low にした。
