---
title: Trips Nub Bubble Switch Stalk & Go
title_ja: トリップス・ナブ、バブルとスイッチのストーク・アンド・ゴー
phase: offense

# The scoreboard reads Hou Christian 14, North Texas 35 in the third quarter, and the North Texas
# end zone puts the game in Denton. The season is inferred from the post date (2026-10-09) and
# the records on the scoreboard (Houston Christian 2-2, North Texas 1-2).
game:
  season: 2026
  away: Houston Christian
  home: North Texas
  level: ncaa
  offense: North Texas

components:
  # "Trips Nub": X, H and Y on the left, the TE alone on the right with no receiver outside him.
  formation: trips
  pass: [bubble, switch-release, stalk-and-go]

vs:
  # A guess between the two-high zones; quarters is not ruled out.
  coverage: cover-2
  confidence: low
  evidence: >-
    The diagram has two safeties deep. The corner over X starts at about seven yards and
    comes forward to the bubble, and the nickel steps up to H's stalk. The safety on the trips
    side drifts inside with X, and no one is over H when he turns up the sideline. The film is
    a high angle from the end zone, and the deep defenders cannot be counted before the snap.
  front: null

video:
  url: https://www.instagram.com/reel/DeRtG4KC17y/
  author: offensive_guru
  kind: diagram+film
  caption: |-
    North Texas Mean Green Trips Nub ➡️ Bubble Switch Stalk & Go

    #nfl
    #collegefootball
    #highschoolfootball
    #football
    #offensivecoordinator
  transcript: null
---

## このプレーの何が面白いか

トリップス側でYにバブルを走らせ、外の2人にはそのバブルのためのブロックに見える動きをさせている。XとHはどちらもDBの前で止まってブロックの構えを取り、コーナーとニッケルはバブルを止めに前へ出る。その瞬間にXとHが交差して縦へ抜け、外へ出たHの上には誰もいなくなった。Switch Release Hitch & Go と同じスイッチ・リリースからのダブルムーブで、あちらはヒッチでQBへの短いパスに見せた。こちらはバブルを止めに来る守備の反応を使い、ストークでブロックに見せている。

## 展開

図から読んだ内容で、バックフィールドの動きは映像では確かめていない。

- 隊形は左にX(外)、H(真ん中)、Y(内側)のトリップス。右はTEが1人でラインに付き、その外にレシーバーはいない(ナブ)。QBとRBはショットガンで横に並ぶ。
- スナップ後、Yは後ろへ膨らみながら左のサイドラインへ流れる(バブル)。
- Xは縦に出てコーナーの前で止まり(図の棒)、そこから内側へ曲がって深く走る。
- Hは縦に出てニッケルの前で止まり(図の棒)、そこからXの後ろを通って外の深いところへ抜ける(図のオレンジから黄色の線)。XとHの進路がここで交差する。
- OLはパスを守るように構え、バックフィールドからは右へ1本の線が出ている。
- 右のTEは縦に出てから内側へ折れる。
- ボールは外へ抜けたHに投げられ、Hは左のエンドゾーンの隅で受けてタッチダウンになる。

## 守備の読み

図ではスナップ前にセーフティが2人深くに立つ。Cover 2の見分け方を順に当てると、1つ目のセーフティ2人は図の上で合う。2つ目のコーナーは、Xの前のコーナーが7ヤードほど離れて構え、スナップ後に前へ出てバブルを止めにいく。構えは深いが、浅いところに残る動きはCover 2のコーナーに合う。3つ目はモーションがないので確かめられない。

スナップ後、トリップス側のセーフティは内側へ曲がったXの方へ流れ、外へ抜けたHの上を誰も守っていなかった。Cover 2ならこのセーフティが外の深いところを持つはずで、XとHの交差で受け持ちを見失ったと読める。

映像はエンドゾーン側の高い角度からで、スナップ前の深い守備の人数は数えられない。図の2ハイとコーナーの動きからCover 2と仮置きし、コーナーの深さはQuartersとも取れるので `confidence` は low にした。
