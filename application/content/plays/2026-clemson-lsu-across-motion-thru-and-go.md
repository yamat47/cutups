---
# The author gives the play no name: the overlay reads "LSU put on a clinic last night" and the
# caption "Great playcall on 3rd down". The title is composed from the diagram's labels.
title: Across Motion Thru and Go
title_ja: アクロス・モーションからのスルーとゴー
phase: offense

# The caption names only LSU, and no scoreboard is in frame. The game is in Tiger Stadium (the
# LSU end zone). The post is from 2026-09-07 and says "last night"; LSU opened 2026 at home
# against Clemson on 2026-09-05, and the defense wears orange. The opponent is inferred.
game:
  season: 2026
  away: Clemson
  home: LSU
  level: ncaa
  offense: LSU

components:
  formation: 2x2 # inferred from the diagram before the motion; the post names no formation
  motion: across

vs:
  # A guess from the comments and the motion; the diagram draws no defense.
  coverage: cover-1
  confidence: low
  evidence: >-
    The diagram draws no defenders, but labels the H route "MAN ALERT" and R's go "YES/NO".
    Before the snap the broadcast shows one defender deepest, toward the right hash, and the
    outside receivers covered from about seven yards. Comments read the corner as playing the
    outside man in man and the safety as confused by the motion. No cue from the coverage
    part was checked in the film beyond the pre-snap depth.
  front: null

video:
  url: https://www.instagram.com/reel/Dc9JqRfqZgV/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    Great playcall on 3rd down

    #collegefootball
    #lsutigers
    #geauxtigers
    #cfb
    #highschoolfootball
  transcript: null
---

## このプレーの何が面白いか

左の外にいたLをボールの後ろを通して右まで走らせ、右の外のRの1対1を作っている。モーションで右の人数が増えると、守備は誰がどこを受け持つかを合わせ直さなければならない。図はRのGoに「YES/NO」と書き、1対1なら投げるかをスナップ前に決める合図にしている。コメント欄には「コーナーは外の選手をマンで持っていたが、モーションでセーフティが誰が外に来るかを見失った」という読みがある。3rd downで、ボールはエンドゾーンに入った。

## 展開

図から読んだ内容で、ルートの細部と受けた選手は映像では確かめていない。

- 隊形は左にL(外)とY(TE)、右にH(スロット)とR(外)。QBはショットガンで、F(RB)はQBの左に立つ。
- スナップ前、Lが左の外からボールの後ろを横切り、右タックルの外まで走る(図の点線)。
- OLとFの6人でパスを守る(図の「6 MAN PASS PRO」)。Fはまずブロックを確かめ、空けば左の浅いところへ出る(図の「Check Trail」「OUTLET」)。
- Hは内側へ斜めに入って左の深いところへ抜ける(図の「Thru」と「MAN ALERT」)。
- モーションしたLは右の外へ出てから深く上がり、内側へ返る(図の1)。Yは右へ浅く横切る(図の2)。
- Rは縦にまっすぐ走る(図の「Go」)。
- 映像では背番号6がエンドゾーンでボールを受けてタッチダウンになる。6はスナップ前の映像で右の外に立っていて、RのGoと読んだ(推定)。

## 守備の読み

図には守備が描かれていない。スナップ前の中継では、右ハッシュ寄りの1人が一番深いところに立ち、外のレシーバーには7ヤードほど離れて1人ずつ付いている。

Cover 1の見分け方を順に当てると、1つ目の深いセーフティ1人は、映像のスナップ前の並びで合うように見える。2つ目のコーナーはレシーバーの正面に立っているが、離れているのでプレスではない。3つ目のモーションへの反応は、映像では確かめられなかった。コメント欄には守備がモーションに合わせたという読みと、片方はゾーンだったという読みの両方がある。

図の「MAN ALERT」と、コメント欄でコーナーがマンだったと読まれていることから、Cover 1と仮置きした。どちらも作者の言葉ではなく、映像で確かめられたのはスナップ前の深さだけなので、`confidence` は low にした。
