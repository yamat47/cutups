---
title: X-Across Split Zone
title_ja: Xアクロス、スプリット・ゾーン
phase: offense

# The caption names only Florida; the game is in Gainesville (the Gator logo at midfield and
# the GATORS end zone). The opponent is inferred: the defense wears white jerseys with light
# blue numbers, and of Florida's 2026 home games before the post date (2026-10-08), only Ole
# Miss (2026-09-26) fits those colors. No scoreboard is in frame to confirm it.
game:
  season: 2026
  away: Ole Miss
  home: Florida
  level: ncaa
  offense: Florida

components:
  # No formation is named. The diagram has X and Y on the left, H as a wing and Z alone on the right.
  motion: across
  run: split-zone

vs:
  # A guess between the two-high zones; quarters is not ruled out.
  coverage: cover-2
  confidence: low
  evidence: >-
    The diagram has two safeties deep before the snap. When X motions across the formation,
    the left corner, the nickel and both safeties all slide toward the motion a few yards; no
    one runs with X. The corner on the X side starts at about five yards, the corner over Z at
    about seven. The film is shot from behind the offense and the deep defenders cannot be
    counted in it.
  front: null

video:
  url: https://www.instagram.com/reel/DeMon_XCCku/
  author: offensive_guru
  kind: diagram+film
  caption: |-
    Florida Gators X-Across ➡️ Split Zone

    #nfl
    #collegefootball
    #highschoolfootball
    #football
    #offensivecoordinator
  transcript: null
---

## このプレーの何が面白いか

Xをフィールドの端から端まで横切らせ、守備の後ろ半分を右へずらしてから、その空いた左へスプリット・ゾーンを走らせている。図では左のコーナー、ニッケル、2人のセーフティがそろってモーションの向きへ動き、左に残るのはLBと前の4人だけになる。RBは左へ出て、Yのブロックの内側を抜けてからは独走した。スプリット・ゾーンはこれで3つ目の例になる。Split Zone RPO はWの反応の後ろへ投げ、Split Zone Boot はランの絵を見せて逆へ出た。この2つはスプリットを見せ球に使っていた。こちらはモーションで守備を動かしておいて、ラン自体を本命にしている。

## 展開

図から読んだ内容で、ブロックの細部は映像では確かめていない。

- 隊形は左にX(外)とY(ラインに付いたTE)、HはYの内側の1歩後ろに立つ。右はZが1人。QBはショットガンで、RBはQBの真後ろの深いところに立つ。
- スナップ前、Xが左の外からボールの後ろを横切り、右のZの内側まで走る(図の長いジグザグの線、映像の黄色の線)。
- スナップ後、OLはゾーンのブロックをし、Hはラインの後ろを右へ横切って右のエンドに当たる(スプリット)。
- Yは外へ弧を描いて2列目へ出て、左のニッケルの方へ向かう。
- QBはRBにボールを渡した後、右へ流れる。
- RB(背番号20)はオレンジの線のとおり左のBギャップの外へ出て、2列目を抜ける。
- 映像では20がそのまま左のサイドライン寄りを走り、相手の20ヤード付近まで守備に追いつかれずに進む。どこで倒されたかは映像に映っていない。

## 守備の読み

図ではスナップ前にセーフティが2人深くに立つ。Cover 2の見分け方を順に当てると、1つ目のセーフティ2人は図の上で合う。2つ目のコーナーは、X側が5ヤードほど、Z側が7ヤードほど離れていて、どちらもCover 2のコーナーにしては深い。3つ目のモーションへの反応は、Xに付いて走る守備はいない。左のコーナー、ニッケル、2人のセーフティがそろって右へ数ヤードずれ、ゾーンの位置を直したように見える。

映像は攻撃の後ろからの中継カメラで、深い守備の人数は数えられない。スナップ後は、左へ出たRBの前に2列目の守備がほとんど残らず、モーションに合わせてずれた分だけ左が薄くなったことは読める。

モーションに誰も付かず、セーフティが2人いることから、2ハイのゾーンと見てCover 2と仮置きした。コーナーの深さはQuartersとも取れ、映像で確かめられたものがないので `confidence` は low にした。
