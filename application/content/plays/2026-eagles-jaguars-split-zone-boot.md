---
title: Split Zone Boot
title_ja: スプリット・ゾーン・ブーツ
phase: offense

# "Jaguars v Eagles" in the overlay, played in London (#NFLLondon). The Jaguars are read as
# the home team from the Jaguars end zone in the film.
game:
  season: 2026
  away: Eagles
  home: Jaguars
  level: nfl
  offense: Jaguars

components:
  run: split-zone
  action: boot

vs:
  # A guess between the two-high zones; Cover 2 is not ruled out.
  coverage: quarters
  confidence: low
  evidence: >-
    The diagram and the broadcast agree on two deep safeties before the snap. The diagram
    puts both corners off at about eight yards, which is the quarters cue; the broadcast does
    not show the corners clearly before the snap. After the snap the defense flows to the
    zone fake and the receiver catches the ball on the boot side with one defender behind him.
  front: null

video:
  url: https://www.instagram.com/reel/DeXViSvAxwY/
  author: playdesignerpro
  kind: diagram+film
  caption: >-
    Jacksonville Jaguars Split Zone Boot 2026 Jaguars v Eagles 🥾 #football #nfl #cfb
    #HighSchoolFootball #collegefootball #offensivecoordinator #playdesign #Jaguars #NFLLondon
    #TrevorLawrence #ParkerWashington #DUUUVAL
  transcript: null
---

## このプレーの何が面白いか

スプリット・ゾーンをそのままブーツのフェイクに使っている。OLとHは左へゾーンの絵を作り、逆の右へ横切ってエンドに当たるはずのFは、ブロックのふりをしてフラットへ抜ける。スプリットの横切りは本物のランでもある動きなので、守備は右へ出ていくFをブロックだと思って見逃しやすい。同じスプリット・ゾーンを使う Split Zone RPO は、Wの反応を見てその後ろへ投げた。こちらはランの絵で守備全体を左へ寄せ、QBごと逆へ出ていく。ボールはブーツ側のサイドライン際で背番号11に渡り、そのまま独走した。コメント欄には「Xも大きく空いていた」とある。

## 展開

図から読んだ内容で、Yのモーションとルートは映像では確かめていない。

- 隊形は左にX(外)とF(ウイング)、右にY(ウイング)とZ(外)。HはQBの後ろに立つ。
- Yは右から左へモーションし、Fの近くでセットし直す(図のジグザグの線)。
- スナップ後、OLは左へゾーンのブロックをし、Hは左のBギャップへ入ってボールを受けるふりをする。
- Fはラインの後ろを右へ横切り、右のエンドにブロックのふりをしてから右のフラットへ抜ける(図の青の線)。
- QBはHへのフェイクの後、右へ転がり出る(ブーツ)。
- Xは左から右へ深く横切り、Zは右で縦に出てから外の深いところへ抜ける。Yは左のエンドに当たってから左の縦へ走る。
- ボールは右のサイドライン際で背番号11に渡る。11はエンドゾーンまで走り、映像ではエンドゾーンに入っている。背番号11はキャプションのタグにある Parker Washington と推定した。どのルートの選手かは、コメント欄にXが別に空いていたとあることから、Zと推定した。

## 守備の読み

スナップ前、図と映像のどちらもセーフティが2人深くに立つ。Quartersの見分け方を順に当てると、1つ目のセーフティ2人は合う。2つ目のコーナーは、図では両方とも8ヤードほど離れて構えている。映像ではスナップ前のコーナーがはっきり映らず、図でしか確かめられない。3つ目のモーションは、Yが横切った時に付いていく守備は映像に見えなかった。

スナップ後、守備はゾーンのフェイクに寄り、ブーツ側の深いところで11を後ろから追う守備は1人だった。コーナーが縦に付いて下がったかは映像の角度では見えない。

コーナーの深さが図の上で合うことからQuartersと仮置きした。映像で確かめられたのはセーフティの数だけで、Cover 2との区別はつかないので `confidence` は low にした。
