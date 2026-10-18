---
title: Long Trap + Bubble Stalk-Slant RPO
title_ja: ロング・トラップとバブル、ストーク・スラントのRPO
phase: offense

# From the overlay "Texas vs Ohio State". The scoreboard reads No. 1 Ohio State 23, No. 4 Texas
# 17, both 1-0, with 1:30 left in the fourth quarter, and the TEXAS end zone puts the game in
# Austin. The season is inferred from the records and the post date (2026-09-13).
game:
  season: 2026
  away: Ohio State
  home: Texas
  level: ncaa
  offense: Texas

components:
  run: long-trap
  action: rpo
  pass: [bubble, stalk-slant]

vs:
  # A guess between the single-high coverages; Cover 1 is not ruled out.
  coverage: cover-3
  confidence: low
  evidence: >-
    The diagram has one FS deep, the SS down at about nine yards in the middle, the corner on
    the bubble side off at about nine yards and the $ over H at about five. In the red zone the
    broadcast compresses the depths, and the deep defenders cannot be counted against the
    diagram. Only the diagram supports the call.
  front: null

video:
  url: https://www.instagram.com/reel/DdNw0NjqS_o/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    I’m glad I didn’t turn the game off!

    #collegefootball
    #hookemhorns
    #highschoolfootball
    #ohiostatebuckeyes
    #cfbplayoff
  transcript: null
---

## このプレーの何が面白いか

ロング・トラップのランを見せながら、右の外ではバブルとストーク・スラントのRPOを組んでいる。Hは$にブロックする構えを見せてから内側へ切れ込み、$はバブルとランのどちらかに反応した時点でHの内側を空けることになる。コメント欄には「ストークのブロックを見事に売った」という声がある。17対23と6点を追う第4クォーター残り1分30秒、レッドゾーンでの選択だった。同じTexasの Long Trap は、Texas A&M戦でロング・トラップをそのまま走らせて左の端を抜けた。こちらはその同じランを、RPOの見せ球にもしている。コメント欄には、同じプレーをTexas Stateが使った時はインターセプトされた、という書き込みもある。

## 展開

図から読んだ内容で、ブロックの細部と受けた選手は映像では確かめていない。

- 隊形は左にLが1人、右にH(スロット)とR(外)。YはOLの右後ろのウイングに立つ。QBはショットガンで、F(RB)はQBの右後ろに立つ。
- スナップ後、OLのうち左側の1人がラインの後ろを右へ長く横切り、右の端のエンドにトラップに行く(ロング・トラップ)。
- 右の2人(図の赤の輪)はSSと右のLB(B)へ向かう。
- Fはボールを受けるふりで中央へ走り込む。
- 右の外では、Rが外へ流れて(バブル)、Hが$にブロックの構えを見せてから内側へ斜めに入る(ストーク・スラント)。
- QBはFへのボールを引き抜き、内側へ入ったHに投げる。
- 映像では、Texasのレシーバーがゴールラインの手前でボールを受け、そのままエンドゾーンの際で倒される。得点になったかは映像では確かめていない。

## 守備の読み

図ではFSが深いところに1人、SSが中央の9ヤードほど、バブル側のコーナーが9ヤードほど離れ、$はHの5ヤードほど前に立つ。Cover 3の見分け方を順に当てると、1つ目のセーフティ1人と、2つ目のコーナーが離れて構えることは、図の上で合う。

映像はレッドゾーンの21ヤード付近からで、エンドラインが近いため守備の深さの差が小さく、深い守備を図と突き合わせて数えられない。3つ目はモーションがないので確かめられない。

図に合わせてCover 3と仮置きした。映像で確かめられたものがなく、Cover 1との区別もつかないので、`confidence` は low にした。
