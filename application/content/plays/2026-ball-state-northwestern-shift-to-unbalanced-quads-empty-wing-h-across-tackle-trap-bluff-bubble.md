---
title: Shift to Unbalanced Quads Empty Wing H-Across Tackle Trap Bluff Bubble
title_ja: アンバランスのクワッズ・エンプティ・ウイングへのシフト、Hアクロス、タックル・トラップのブラフからバブル
phase: offense

# The caption names only Northwestern, and no scoreboard is in frame. The game is at the new
# Ryan Field (the "RYAN FIELD" marking). Of Northwestern's 2026 games there before the post
# (about 2026-10-13), Penn State was a Friday night game and Ball State (2026-10-10) a day game;
# the film is in daylight and the defense wears white jerseys with red pants, which fits Ball
# State. The opponent is inferred.
game:
  season: 2026
  away: Ball State
  home: Northwestern
  level: ncaa
  offense: Northwestern

components:
  # "Unbalanced Quads Empty Wing" is the pre-shift look; the diagram shows only the post-shift
  # alignment. The shift itself and the unbalanced line have no part yet.
  formation: quads
  motion: across
  # "Tackle Trap Bluff": the right tackle (purple in the diagram) pulls left behind the line
  # and the ball goes right, which is the false-pull part.
  action: false-pull
  pass: bubble

vs:
  # A guess between the two-high zones; Cover 2 is not ruled out.
  coverage: quarters
  confidence: low
  evidence: >-
    The diagram has two safeties deep, at about fifteen yards, and the corners off at about
    ten yards on both sides, with the nickel at about nine over Z. Nobody is drawn following H
    across the formation. The film shows the pre-snap shell from a wide angle but the deep
    defenders cannot be told apart, so only the diagram supports the call.
  front: null

video:
  url: https://www.instagram.com/reel/DeZmfOxi58G/
  author: offensive_guru
  kind: diagram+film
  caption: |-
    Northwestern Wildcats Shift to Unbalanced Quads Empty Wing ➡️ H-Across ➡️ Tackle Trap Bluff ➡️ Bubble

    #nfl
    #collegefootball
    #highschoolfootball
    #football
    #offensivecoordinator
  transcript: null
---

## このプレーの何が面白いか

右タックルを左へトラップのようにプルさせ、RBもそちらへ走らせて、ランの絵を左に作っている。その間にHが左から右へ横切ってクワッズの4人目になり、右の外はX、Z、Hの3人がブロックに回る。ボールは右の後ろで待つYへのバブルで、ブロックの人数が守備より多い側へ出ていく。Trips TE/Wing Guard False Pull Freeze Option も、OLのフォルス・プルで2列目を一方へ寄せ、逆へボールを出した。あちらはガードのプルからオプションで走ったが、こちらはタックルのプルからスクリーンを投げている。コメント欄には「Chip Kelly in his bag」とある。

## 展開

図から読んだもので、シフトの前の並びは図に描かれていない(図には「Post Shift」とある)。

- シフト後、左はHがラインの外の1歩後ろに立つウイング。右はX、Zがラインの外に並び、Yはその後ろの深いところに立つ。QBはショットガンで、RBはQBの右に立つ。
- スナップ前、Hが左からボールの後ろを横切って右へ走り、Xの近くまで行ってから外のコーナーへ向かう(図の長いジグザグの線)。
- スナップ後、右タックル(図の紫)はラインの後ろを左へプルするふりをする。
- RBは左のHがいた方へ走り、QBはその後ろで右へ流れる。
- XとZは目の前の$とNにブロックし、Hは外のコーナーに当たる。
- Yは右のサイドラインへ弧を描いて流れ、そこへボールが投げられる(図のオレンジの線)。
- 映像の引きの画面では、プレーが右へ流れ、相手陣の30ヤード付近で倒されたように見える。誰が受けて何ヤード進んだかは映像の解像度では確かめていない。

## 守備の読み

図ではスナップ前にセーフティが2人、15ヤードほどの深さに立つ。Quartersの見分け方を順に当てると、1つ目のセーフティ2人は合う。2つ目のコーナーは、左右どちらも10ヤードほど離れて構え、Nも右のZの9ヤードほど前にいる。3つ目のモーションへの反応は、図ではHに付いて動く守備が描かれていない。

映像は引きの画面とエンドゾーン側の画面の2つで、どちらもスナップ前の深い守備を1人ずつ見分けられない。スナップ後は、右へ出たYの前を3人のブロッカーが押さえ、守備の外側の人数が足りなかったことが読める。

セーフティ2人とコーナーの深さからQuartersと仮置きした。どれも図の上でしか確かめられず、Cover 2との区別もつかないので、`confidence` は low にした。
