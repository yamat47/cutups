---
title: Split Zone RPO
title_ja: スプリット・ゾーンRPO
phase: offense

# "UAB v East Carolina" in the overlay. UAB is read as the home team from the Protective
# Stadium location tag on the post.
game:
  season: 2026
  away: East Carolina
  home: UAB
  level: ncaa
  offense: UAB

components:
  formation: 2x2 # inferred from the diagram; the title names no formation
  run: split-zone
  action: rpo

vs:
  # A guess between the two-high zones; quarters is not ruled out.
  coverage: cover-2
  confidence: low
  evidence: >-
    The diagram and the broadcast agree on two deep safeties before the snap. The corner on
    the X side is up near the line and the corner on the Z side is off at about six yards.
    The W is marked in orange as the read, and F runs into the space behind him once he
    steps up. Nothing after the snap separates Cover 2 from quarters.
  front: null

video:
  url: https://www.instagram.com/reel/DekH3bMgf53/
  author: playdesignerpro
  kind: diagram+film
  caption: >-
    UAB Blazers Split Zone RPO 2026 UAB v East Carolina 📖 #football #nfl #cfb
    #HighSchoolFootball #collegefootball #offensivecoordinator #playdesign #RyderBurton
    #CJSmith #UAB #WinAsOne
  transcript: null
---

## このプレーの何が面白いか

ランを止める役とパスを守る役を両方持つWを、図はオレンジの印で示している。スプリット・ゾーンでOLが前へ押し、Hがゾーンの穴へ入ってくると、WはランのためにLOSへ寄るしかない。その後ろの円(図ではオレンジの点線)へ、左のスロットのFが斜めに入ってくる。QBはWの動きを見て投げるだけでよく、ブロックで誰かを余計に動かす必要がない。

## 展開

- 隊形は左にX(外)とF(スロット)、右にY(ラインに付いたTE)とZ(外)の2x2。HはQBの左に立つ。
- OLはゾーンのブロックで前へ出る。右ガードは2列目のMまで上がる。
- Hは右のAギャップの方へ斜めに入る(図の緑の線)。
- Fは縦に出てから右へ斜めに入り、Wの後ろの円の中へ走る(図の青の線)。
- Xは縦に6から7ヤード出て内側へ折れ、Zは縦に出てから外へ折れる。
- WがLOSへ寄ったところで、QBはボールを引き抜いてFへ投げる。Fは中央で受けて十数ヤード前進し、倒される。

図ではゾーンの逆へ横切ってエンドを押さえる選手がはっきりとは描かれておらず、左のエンドにはLTの外に短い棒があるだけだ。スプリットの横切りが誰かは図からは読めなかった。

## 守備の読み

スナップ前、図と映像のどちらもセーフティが2人深くに立つ。Cover 2の見分け方を順に当てると、1つ目のセーフティ2人は合う。2つ目のコーナーは、X側がラインの近く、Z側が6ヤードほど離れて立ち、片方しか合わない。3つ目はモーションがないので確かめられない。

スナップ後、Wは図のとおりランに反応して前へ出て、Fの前には誰も残らなかった。これはRPOの狙いどおりの結果で、ゾーンかマンかを決める手がかりにはならない。2ハイの並びからCover 2と仮置きし、Quartersとの区別がつかないので `confidence` は low にした。
