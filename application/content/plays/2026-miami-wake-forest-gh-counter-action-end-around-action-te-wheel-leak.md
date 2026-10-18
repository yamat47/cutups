---
title: GH Counter Action + End Around Action - TE Wheel Leak
title_ja: GHカウンターとエンド・アラウンドのアクションから、TEのウィール・リーク
phase: offense

# The overlay names only Wake Forest, and no scoreboard is in frame. The game is in
# Winston-Salem (the WAKE FOREST end zone) at night. Of Wake Forest's 2026 September home games
# before the post (2026-09-24), Miami (Friday night, 2026-09-18) fits the defense's white
# jerseys with orange; Akron (2026-09-03) wears blue. The opponent is inferred.
game:
  season: 2026
  away: Miami
  home: Wake Forest
  level: ncaa
  offense: Wake Forest

components:
  # Both runs are fakes; the ball is thrown to H on the leak.
  run: [gh-counter, reverse]
  pass: leak

vs:
  # A guess between the two-high zones; quarters is not ruled out.
  coverage: cover-2
  confidence: low
  evidence: >-
    The diagram draws no defenders. Before the snap the broadcast shows two defenders deep at
    about twelve yards near the goal line, one corner off at about eight yards on the right
    and one pressed on the near side. Two deep fits Cover 2; the off corner fits quarters as
    well. Nothing after the snap was readable.
  front: null

video:
  url: https://www.instagram.com/reel/DdpVfnLBXm1/
  author: coachcarsonhart
  kind: diagram+film
  caption: |-
    GH Counter Action + End Around Action - TE Wheel Leak

    #collegefootball
    #cfb
    #highschoolfootball
    #cfbplayoff
    #footballcoach
  transcript: null
---

## このプレーの何が面白いか

GHカウンターのガードとHのプルで守備を右へ寄せ、さらに右のLを左へ逆走させるエンド・アラウンドのふりを重ねて、ボールの行き先を二重に隠している。本命はプルの一部に見えたHで、ラインの後ろを右へ横切った後、そのままサイドライン沿いを縦に上がる(ウィール)。オーバーレイは「TE Leak Wheel Concept off of Counter Action」と書く。GY Counter Reverse Throwback もカウンターとリバースを重ね、最後にボールを投げ返した。あちらはリバースのボールキャリアが逆へ投げたが、こちらはQBが持ったまま、プルに紛れたHへ投げている。

## 展開

図から読んだ内容で、受けた選手と結果は映像では確かめていない。

- 隊形は左にY(ラインに付いたTE)とH(その後ろのウイング)。右にL(スロット)とR(外)。QBはショットガンで、F(RB)はQBの左に立つ。
- スナップ後、左ガードとHがラインの後ろを右へプルするように動く(図の「GH Counter Action」)。
- QBはFにカウンターのボールを見せる。Fはその後、右のフラットへ出る(図の「Check Flat」、2)。
- Lは右から左へバックフィールドの後ろを走り、エンド・アラウンドのボールを受けるふりをする(図の「Fake End Around」、映像の黄色の矢印)。
- Rは縦に出てから中央へ斜めに入り、右の深い守備を中へ引き寄せる(図の「Clear Out Post」と「ALERT」)。
- Hはプルの流れのまま右へ横切り、守備の端を回ってサイドライン沿いを縦に上がる(図の赤の線、1)。
- 映像では、右のエンドゾーン近くでレシーバーがボールを受けたように見える。誰が受けて得点になったかは映像の画角では確かめていない。

## 守備の読み

図には守備が描かれていない。スナップ前の中継では、ゴールラインに近い12ヤードほどの深さに2人が立ち、右の外のコーナーは8ヤードほど離れて、手前側のコーナーはレシーバーの正面に詰めている。

Cover 2の見分け方を順に当てると、1つ目のセーフティ2人は、映像のスナップ前の並びで合う。2つ目のコーナーは、手前側がラインの近くでCover 2に合い、右の外は離れていてQuartersとも取れる。3つ目はモーションがないので確かめられない。スナップ後の守備の動きは、中継の画角では読めなかった。

2ハイの並びからCover 2と仮置きした。図が守備を描いておらず、Quartersとの区別もつかないので、`confidence` は low にした。
