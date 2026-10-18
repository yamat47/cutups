---
title: Sting
title_ja: スティング
phase: offense

# The caption names the game: "2026 Alabama running a Sting Concept against South Carolina".
# Alabama is the home team from the Alabama logo at midfield and the Crimson Tide end zone.
game:
  season: 2026
  away: South Carolina
  home: Alabama
  level: ncaa
  offense: Alabama

components:
  formation: 2x2 # inferred from the diagram; the caption names no formation
  pass: sting

vs:
  # A guess from the pre-snap shell alone; the diagram draws no defense.
  coverage: cover-3
  confidence: low
  evidence: >-
    The diagram draws no defenders, but labels the inside post "Flatten vs Man" and "Alert vs
    Man". Before the snap the broadcast shows one defender deepest in the middle, at about
    fifteen yards, and the corners off the outside receivers. A comment says the two posts
    pull the deep middle down and leave the sting open. The film does not show the drop of
    the corners after the snap.
  front: null

video:
  url: https://www.instagram.com/reel/Dd7T6MWyuox/
  author: coachcarsonhart
  kind: diagram+film
  caption: 2026 Alabama running a Sting Concept against South Carolina
  transcript: null
---

## このプレーの何が面白いか

左のLとHの2人にポストを走らせて深い中央の守備を引き寄せ、右から来たRをその下に通して、空いた左の深いところへ抜けさせている。コメント欄の言葉では「2本のポストで深い中央を下げれば、スティングがタッチダウンになる」。図は内側のポストに「Flatten vs Man」と書き、マンなら平らに横へ流れて外を空ける別の答えも用意している。別のコメントは、QBが右へ半分だけブーツのように出て、守備をほんの少し右へ引いたことを挙げている。

## 展開

図から読んだ内容で、QBの動きはコメント欄の指摘による。

- 隊形は左にL(外)とH(スロット)、右にY(TE)とR(外)。QBはショットガンで、FはQBの右に立つ。
- OLとY、Fでパスを守る。Fはブロックの後、左へ流れる。
- Lは縦に出てから中央へ斜めに入る(図の「Pressure Post」、1)。
- Hも縦に出てから中央へ斜めに入る(図の「Beeline」)。マンなら途中で右へ平らに流れる(図の点線)。
- Rは右から左へ10ヤードほど先を横切り、2本のポストの下を通ってから、左のサイドラインへ深く抜ける(図の「Sting」、2)。
- QBは右へ少し流れてから、左の深いところへ投げる。
- 映像ではAlabamaのレシーバーが左のエンドゾーン近くでボールを受け、守備は後ろから追っている。タッチダウンになったかは映像の切り替わりで確かめていない。

## 守備の読み

図には守備が描かれていない。スナップ前の中継では、中央の15ヤードほどに1人が一番深く立ち、外のレシーバーにはそれぞれ離れて守備が付いている。

Cover 3の見分け方を順に当てると、1つ目の深いセーフティ1人は、映像のスナップ前の並びで合うように見える。2つ目のコーナーは離れて構えているが、スナップ後に外を保って下がったかは映像では見えない。3つ目はモーションがないので確かめられない。コメント欄の「2本のポストで深い中央を下げる」という読みも、中央に深い守備が1人いる形と合う。

中央の深い1人と離れたコーナーからCover 3と仮置きした。図が守備を描いておらず、映像で確かめられたのはスナップ前の並びだけなので、`confidence` は low にした。
