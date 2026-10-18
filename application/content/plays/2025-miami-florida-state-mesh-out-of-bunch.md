---
title: Mesh out of Bunch
title_ja: バンチからのメッシュ
phase: offense

# From the overlay "Miami running Mesh on 3rd Down out of Bunch". The scoreboard reads No. 3
# Miami (4-0) 0, No. 18 Florida St (3-1) 3, and the Seminole logo at midfield puts the game in
# Tallahassee. The season is inferred from the records and the post date (2026-08-04, in the
# off-season).
game:
  season: 2025
  away: Miami
  home: Florida State
  level: ncaa
  offense: Miami

components:
  formation: bunch
  pass: mesh

vs:
  # A guess from the pre-snap shell alone; the diagram draws no defense.
  coverage: quarters
  confidence: low
  evidence: >-
    The diagram draws no defenders. Before the snap the broadcast shows five defenders spread
    across the field at eight to twelve yards: two at safety depth between the hashes and the
    corners well off the outside receivers. That is two deep with off corners, the quarters
    shell, but nothing after the snap was readable. A comment says a dropping corner must have
    sat in the route to the left.
  front: null

video:
  url: https://www.instagram.com/reel/Dbn0ZrBKcMy/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    Miami running Mesh on 3rd Down out of Bunch

    #collegefootball
    #offensivecoordinator
    #cfb
    #footballcoach
    #highschoolfootball
  transcript: null
---

## このプレーの何が面白いか

3rd downで、左のバンチの3人のうち2人と右の1人を使ってメッシュを組んでいる。バンチのHと右のRが中央で浅くすれ違い、その外ではLが縦から外へ、Yがフラットへ出て、左の深いところと浅いところを同時に使う。図の番号は、QBがLとYの2本(1Aと1B)を先に見て、次にメッシュの2人(2と3)へ移る順番を示している。コメント欄では「Yが大きく空いていた」という声が多く、QBが右へ投げて成功させたことに驚く書き込みもある。同じバンチを使う Y-Short Bunch Trail は、2人を同じ向きに縦に重ねて横切らせた。こちらは逆向きにすれ違わせている。

## 展開

図から読んだ内容で、どのレシーバーが受けたかは映像では確かめていない。

- 隊形は左にL、H、Yのバンチ。右はRが1人。QBはショットガンで、F(RB)はQBの右に立つ。
- OLとTEの6人でパスを守る(図の「6-Man Pass Pro」)。
- Lは縦に出てから外の深いところへ折れる(1A)。Yはフラットへ出る(1B)。
- Hは右へ浅く横切り(2)、Rは左へ浅く横切って(3)、2人は中央ですれ違う。
- Fはまず残ってブロックを確かめ、空いていれば右のフラットへ出る(図の「Check Swing」「outlet」)。
- 映像では、QBは右へ投げてパスを成功させ、受けた選手はその先で倒される。

## 守備の読み

図には守備が描かれていない。スナップ前の中継では、5人の守備が8から12ヤードの深さに横に並ぶ。そのうちハッシュの間の2人がセーフティの深さに立ち、外の2人はレシーバーから大きく離れている。

Quartersの見分け方を順に当てると、1つ目のセーフティ2人と、2つ目のコーナーが離れて構えることは、映像のスナップ前の並びで合う。3つ目はモーションがないので確かめられない。4つ目のスナップ後の動きは、中継の画角では読めなかった。コメント欄には、左には映っていないコーナーがルートの上に下がっていたはずだ、という推測もある。

2ハイで外が離れた並びからQuartersと仮置きした。図が守備を描いておらず、確かめられたのはスナップ前の並びだけなので、`confidence` は low にした。
