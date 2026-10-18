---
title: Trips TE/Wing Guard False Pull Freeze Option
title_ja: トリップスTE/ウイング、ガードのフォルス・プルからフリーズ・オプション
phase: offense

# The caption names only UCLA. Maryland is read from the scoreboard (UCLA 7, Maryland 0) and
# the game is at Maryland, from the SECU Stadium marking and the Maryland end zone. The season
# is inferred from the post date (2026-10-02) and the records on the scoreboard (UCLA 3-0,
# Maryland 2-1).
game:
  season: 2026
  away: UCLA
  home: Maryland
  level: ncaa
  offense: UCLA

components:
  # "Trips TE/Wing": TE on the line, H as the wing and X outside, all on the left.
  formation: trips
  run: freeze-option
  action: false-pull

vs:
  # A guess from the diagram; the film does not show the deep safety or how the corners drop.
  coverage: cover-3
  confidence: low
  evidence: >-
    The diagram has one FS deep in the middle, the strong safety down at about eight yards on
    the trips side, and both corners off at about seven yards with their lines running deep.
    The broadcast shows the corner over the receiver at the top of the screen at about three
    yards and no deep safety in frame, so the film does not confirm the diagram. There is no
    motion.
  front: null

video:
  url: https://www.instagram.com/reel/Dd_tlrNi1ON/
  author: offensive_guru
  kind: diagram+film
  caption: |-
    UCLA Bruins Trips TE/Wing ➡️ Guard False Pull ➡️ Freeze Option

    #nfl
    #collegefootball
    #highschoolfootball
    #football
    #offensivecoordinator
  transcript: null
---

## このプレーの何が面白いか

右ガードを左へフォルス・プルさせ、2列目をトリップスの側へ止めておいてから、逆の右でエンドを読むオプションを走らせている。ガードのプルはLBにとって一番分かりやすいランの目印なので、図ではMがプルの向きへ前に詰めている。右のエンドは誰にもブロックされず、QBが内側へ走り込むかRBへピッチするかの二択を1人で受けることになる。隊形の重さもプルも左にあり、ボールだけが右へ出ていく作りだ。

## 展開

図から読んだ内容で、ブロックの細部は映像では確かめていない。

- 隊形は左にTE(ライン上)、H(TEの外の1歩後ろのウイング)、X(外)のトリップス。右はZが1人。QBはショットガンで、RBはQBの右後ろに立つ。
- スナップ後、右ガード(図の紫)がラインの後ろを左へプルするふりをする(フォルス・プル)。
- ほかのOLは目の前の守備へブロックに行き、右のエンドだけが灰色の円で囲まれて残される。
- Hは外へ弧を描いて出て(図の「Arc」)、トリップス側のセーフティに当たる。
- XとZは縦に出てコーナーを押し下げ、そのままブロックに入る(図の「MOR into Stalk」)。
- QBは右のエンドの内側へ短く前へ出て、RBへピッチする。RBは右へ回り込み、オレンジの線のとおり外を走る。
- 映像では、ボールキャリアが右のサイドライン際を走り、ミッドフィールド付近で2人に倒される。どこまで進んだかは画面のヤード表示から読んだもので、正確ではない。

## 守備の読み

図ではFSが中央の深いところに1人、もう1人のセーフティ($)がトリップス側の8ヤードほどに下り、両方のコーナーが7ヤードほど離れて、それぞれの線が深く伸びている。Cover 3の見分け方の1つ目と2つ目がそのまま合う絵だ。

映像では合うとは言えない。スナップ前の中継は守備の奥を映さず、深いセーフティは画面に入らない。画面上側のレシーバーの前にいるコーナーは3ヤードほどの近さに立っていて、図のように離れてはいない。3つ目のモーションへの反応は、このプレーにモーションがないので確かめられない。

`vs.coverage` は図に合わせてCover 3とした。映像ではセーフティの数もコーナーの下がり方も確かめられず、コーナーの近さはCover 1とも取れるので、`confidence` は low にした。
