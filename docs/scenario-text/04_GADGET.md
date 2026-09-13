# Gadget Area — 現行ゲーム内テキスト

最終更新: 2026-09-14
対象: `dev`

## gadget-entry

章表示:
```text
AREA 02
GADGET AREA
```

ナレーション:
> 次の世界は、朝の街とは正反対だった。巨大な歯車と搬送路が、暗闇の中で停止している。

SYSTEM:
```text
GADGET AREA / MAINTENANCE ZONE
```

REI:
> 今度は工場か。……動いてないけど。

調査:
- 停止した案内板
- 機械区画へ進む
- 条件未達: 工場のリズムを観察する

SYSTEM:
```text
POWER 12% / CONVEYOR OFFLINE / SERVICE UNIT STANDBY
```

REI:
> サービスユニット……誰かいるのか？

## gadget-machinery

ナレーション:
> 動かせそうなのは三つ。電源、歯車、天井クレーン。

REI:
> 一つずつ戻せば、奥まで行けそうだ。

調査 / 復旧:
- 電源をつなぎ直す
- 歯車の印を合わせる
- クレーンをどかす
- 奥の整備室へ
- 条件未達: 復旧した機械の音を確認する

### 電源

ナレーション:
> 電源をつなぎ直すと、床下を青白い光が走った。

SYSTEM:
```text
AUXILIARY POWER / ONLINE
```

UI:
```text
POWER ROUTING
左から順に押して、電源をつなぐ。AUX → BUS → MAIN
SEQUENCE ERROR — RESET
CONNECTED
```

### 歯車

ナレーション:
> 歯車の印が揃う。低い駆動音が、曲のリズムに重なった。

REI:
> ……ちょっと気持ちいいな、これ。

UI:
```text
GEAR PHASE
3つの印を上の基準線に合わせる。
TARGET: 90° / 180° / 270°
```

### クレーン

ナレーション:
> クレーンが軋みながら横へ動き、塞がれていた整備室が現れた。

SYSTEM:
```text
MAINTENANCE PATH / OPEN
```

UI:
```text
CRANE CLEARANCE
クレーンを黄色い場所まで動かす。
LEFT
RIGHT
TARGET BAY 4
```

進捗UI:
```text
RESTORE
機械区画を復旧する
POWER
GEAR
CRANE
COMPLETE — 奥の整備室へ進める
```

## gadget-bit

ナレーション:
> 整備台の上で、小さな黄色い機械が突然起き上がった。

BIT:
> DIVER DETECTED. 未登録侵入を確認。

REI:
> うわ。喋った。

BIT:
> 感想は不要です。退去してください。

REI:
> できるなら、そうしたいんだけど。

調査:
- BITを調べる
- 中央管理端末へ
- 条件未達: BITの起動音を聞く

BIT:
> 触らないでください。私は精密機器です。

REI:
> 傷だらけだけど。

BIT:
> 使用実績です。

REI:
> ……名前は？

BIT:
> B.I.T.。保守支援端末。呼称はBITで構いません。

## gadget-auth

SYSTEM:
```text
IDENTITY SCAN ........ 99.7%
ADMINISTRATOR ........ REI
WELCOME BACK
```

BIT:
> ……Dr. Rei？

REI:
> 違う。たぶん。

BIT:
> 99.7%一致しています。

REI:
> じゃあ0.3%は私ってことで。

BIT:
> 論理的ではありません。

調査:
- BITと先へ進む
- 条件未達: 認証ログを最後まで確認する
