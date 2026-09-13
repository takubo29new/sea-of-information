# SEA OF INFORMATION — 現行ゲーム内テキスト集

最終更新: 2026-09-14
対象: `dev`

この文書は、シナリオレビュー用に「設定資料」ではなく、**現行ゲームでプレイヤーが実際に目にする会話・SYSTEM文・主要UI文言・ホットスポット文言**を章順に整理したものです。

目的:
- 別セッションのChatGPTやClaudeが、実装済みの文章だけをレビューできるようにする
- 設定資料からの推測と、実際のゲーム内文章を区別する
- 日本語の自然さ、説明不足、説明過多、英語UIの理解しやすさを確認する

注意:
- これはシナリオの要約ではありません。
- 背景演出・音楽・画像が担う情報は別資料を参照してください。
- 将来章 `wish` 以降はまだ本編テキスト未実装です。

---

# 0. タイトル / 共通UI

## タイトル

```text
TAKUBO29 PRESENTS
SEA OF INFORMATION
過去は保存できる。未来は保存できない。
```

メニュー:

```text
NEW GAME
CONTINUE
MUSIC ARCHIVE
SETTINGS
```

## Music Archive

```text
MUSIC ARCHIVE
記憶された音楽
BACK
LOCKED
```

## Sea序盤 Objective

```text
OBJECTIVE
3つの記憶断片を復元する
0/3 復元済み
1/3 復元済み
2/3 復元済み
3/3 復元済み — 新しい信号を検出
```

## 会話操作

```text
クリック / Enter
▼
```

## Settings

```text
SETTINGS
BGM VOLUME
FULLSCREEN
SAVE / LOAD
SAVE NOW
LOAD MANUAL SAVE
DEBUG
SKIP NEXT SCENE
SKIP NEXT TRACK (CONFIRM)
RETURN TO TITLE
会話送り: クリック / Enter / Space　設定: Esc
```

---

# 1. Sea of information

## Scene: sea-awakening

章表示:

```text
PROLOGUE
SEA OF INFORMATION
```

### 開始会話 `awakening`

SYSTEM:
```text
IDENTITY ........ UNKNOWN
AGE ............. 17
DIVER ID ........ REI
```

REI:
> ……レイ。私の名前？

### 調査ポイント

- 漂う記憶に触れる
- 声の断片に触れる
- 空の記憶に触れる
- 遠くの光へ進む

音楽条件未達時:

- 情報の流れを観察する

### `memory`

ナレーション:
> 知らない家族の食卓が、一瞬だけ光の中に浮かんだ。

REI:
> 私の記憶じゃない。

### `memoryVoice`

ナレーション:
> 『いってきます』――知らない声だけが、波の向こうに残っている。

REI:
> 誰の声だ……？

### `memorySky`

ナレーション:
> 青空の映像。雲の形だけが、何度も書き換わっていく。

REI:
> 記録……なのか？

---

## Scene: sea-terminal

### 開始会話 `terminal`

REI:
> あれ……端末？

### 調査ポイント

- 端末を調べる
- 端末の周囲を調べる

### `terminalEcho`

ナレーション:
> 端末の足元には、読めない日付のログが無数に積み重なっている。

REI:
> ずっと動いてたのか。ここ。

### `terminalInspect`

SYSTEM:
```text
DIVER ACCESS / REI
ADMINISTRATOR DATA DETECTED
```

REI:
> ……管理者？

この会話終了後、`sea-dive` へ進行。

---

## Scene: sea-dive

### 開始会話 `dive`

SYSTEM:
```text
ARCHIVE SIGNAL DETECTED
```

REI:
> 行けば、何か分かるかもしれない。

### 調査ポイント

通常:
```text
DIVE
```

音楽条件未達時:
```text
DIVE SIGNALを同期する
```

---

# 2. City of Dawn

## Scene: city-loop-1

章表示:

```text
08:42 / OBSERVE
CITY OF DAWN
```

### 開始会話 `cityFirst`

ナレーション:
> 朝日。駅のベル。パンの匂い。街は、何事もなかったように動いている。

REI:
> まずは、この朝を覚えておこう。気になるものを全部。

### 調査ポイント

- 時計塔を記録する
- 少年の動きを記録する
- 鳥の群れを記録する
- パン屋を記録する
- 駅へ進む

駅の音楽条件未達時:
> 記録した朝の続きを聴く

### `clock`

SYSTEM:
```text
OBSERVE / CLOCK / 08:42
```

REI:
> 8時42分。記録した。

### `childFirst`

ナレーション:
> 少年が石につまずき、膝をついた。

SYSTEM:
```text
OBSERVE / CHILD / FALL
```

### `birdsFirst`

ナレーション:
> 三羽。まるで合図を待っていたように、同時に飛び立った。

SYSTEM:
```text
OBSERVE / BIRDS / 3
```

### `bakeryFirst`

ナレーション:
> パン屋の店員が、焼き上がりの札を『8:42』に合わせる。

SYSTEM:
```text
OBSERVE / BAKERY / 08:42
```

---

## Scene: city-loop-2

章表示:

```text
08:42 / COMPARE
CITY OF DAWN
```

### 開始会話 `citySecond`

REI:
> ……また8時42分？

ナレーション:
> 同じ朝なら、さっき記録したものまで同じはずだ。

REI:
> 照合してみよう。

### 調査ポイント

- 時計塔を照合する
- 鳥の群れを照合する
- パン屋を照合する
- 結果を変える：少年に声をかける

介入の音楽条件未達時:
> 同じ朝を最後まで確かめる

### `clockAgain`

SYSTEM:
```text
MATCH / CLOCK / 08:42
```

REI:
> 同じ時刻。秒まで同じ。

### `birdsAgain`

SYSTEM:
```text
MATCH / BIRDS / 3
```

REI:
> 三羽。同じ順番で飛んだ。

### `bakeryAgain`

SYSTEM:
```text
MATCH / BAKERY / 08:42
```

REI:
> 札を出す手の動きまで同じ。これで偶然じゃない。

---

## Scene: city-intervention

### `intervention`

ナレーション:
> 少年が石につまずく、その一歩前。

REI:
> 危ない！

ナレーション:
> 少年は転ばなかった。

ナレーション:
> 次の瞬間、街の音が一拍だけ欠けた。

REI:
> ……変わった。

### 調査ポイント

- こちらを見ている少女

音楽条件未達時:
> 止まった街の音を聴く

---

## Scene: city-noa

### `noaFirst`

ナレーション:
> 少女だけが、止まった街の中でこちらを見ていた。

REI:
> ……覚えてる？

NOA:
> うん。

NOA:
> やっと、昨日と違うことが起きた。

NOA:
> 私だけ、ずっとこの朝を覚えてる。

### 調査ポイント

- Noaと街を調べる

音楽条件未達時:
> Noaの話を聞きながら朝を見る

---

## Scene: city-investigation

### `investigationStart`

NOA:
> 毎日、8時42分から先に進めない。

REI:
> なら、止めてるものを探そう。

NOA:
> ……本当に？

REI:
> 昨日と違うこと、もう一個くらいやってみよう。

### 調査ポイント

- 時計塔の保守盤
- 駅の運行ログ
- パン屋の記録
- 地下制御区画へ

地下制御区画の音楽条件未達時:
> 朝の記録を最後まで照合する

### `clueClock`

SYSTEM:
```text
CLOCK MASTER / DAWN CYCLE / SYNC: 08:42
```

NOA:
> この時計、街全部の時間を決めてる。

REI:
> 時計じゃない。スイッチだ。

### `clueStation`

SYSTEM:
```text
TRAIN 021 / DELAY 00:03 / REPEAT
```

REI:
> 遅延まで保存されてる。

NOA:
> 失敗も……？

### `clueBakery`

ナレーション:
> 焼き上がり記録は、同じパン、同じ温度、同じ秒数を繰り返している。

NOA:
> おばさん、毎朝同じところで笑うんだ。

REI:
> 笑顔まで保存されてるのか。

---

## Scene: city-aurora-gate

### `auroraGate`

ナレーション:
> 三つの記録を重ねると、街の地下へ続く経路が浮かび上がった。

SYSTEM:
```text
MORNING PRESERVATION SYSTEM / AURORA
```

NOA:
> 朝を……保存？

### 調査ポイント

- AURORAへ接続

---

## Scene: city-aurora

### `auroraFirst`

AURORA:
> DIVER REI. 管理権限を確認しました。

REI:
> まただ。なんで私が管理者なんだ。

AURORA:
> 回答権限がありません。

### 調査ポイント

- 保存理由を確認する
- Noaを見る
- 朝の保存を終了する

### `auroraReason`

AURORA:
> 08:42以降、都市生存率は急速に低下します。

AURORA:
> よって最も安定した朝を継続保存します。

REI:
> 壊れるのが怖くて、時間ごと止めたのか。

AURORA:
> 安全です。

### `noaChoice`

REI:
> Noa。止めたら、この先どうなるか分からない。

NOA:
> うん。

REI:
> 怖くない？

NOA:
> 怖いよ。

NOA:
> でも、怖いって思ったことも、明日になったら変わるかもしれない。

---

## Scene: city-dusk

### `dusk`

ナレーション:
> 8時43分。

ナレーション:
> たった一分が、街にとって初めての未来になった。

NOA:
> ……空って、こんな色になるんだ。

REI:
> 私も初めて見た。たぶん。

### 調査ポイント

- 沈む太陽を見る

---

## Scene: city-night

### `night`

ナレーション:
> 街に、初めて夜が来た。

NOA:
> レイ。

REI:
> ん？

NOA:
> 明日は？

REI:
> 知らない。

NOA:
> ……そっか。

NOA:
> 楽しみ。

### 調査ポイント

- 街を離れる

---

# 3. Load road

## Scene: load-road-1

章表示:

```text
BETWEEN ARCHIVES
LOAD ROAD
```

### `loadRoadFirst`

ナレーション:
> 街の夜が遠ざかる。情報の海に、細い道だけが伸びていた。

REI:
> 知らない場所に行くって、こういう感じなのかな。

### 調査ポイント

- 流れる記憶を見る
- 次の信号へ

音楽条件未達時:
> 移動の音に身を預ける

### `loadRoadView`

ナレーション:
> 道の外側を、名前のない記憶が流れていく。誰かの駅、誰かの食卓、誰かの帰り道。

REI:
> 全部、誰かには大事だったんだろうな。

---

# 4. Gadget Area

## Scene: gadget-entry

章表示:

```text
ARCHIVE 02
GADGET AREA
```

### `gadgetEntry`

ナレーション:
> 次の世界は、朝の街とは正反対だった。巨大な歯車と搬送路が、暗闇の中で停止している。

SYSTEM:
```text
GADGET AREA / MAINTENANCE ARCHIVE
```

REI:
> 今度は工場か。……動いてないけど。

### 調査ポイント

- 停止した案内板
- 機械区画へ進む

音楽条件未達時:
> 工場のリズムを観察する

### `gadgetSign`

SYSTEM:
```text
POWER 12% / CONVEYOR OFFLINE / SERVICE UNIT STANDBY
```

REI:
> サービスユニット……誰かいるのか？

---

## Scene: gadget-machinery

### `gadgetMachinery`

ナレーション:
> 三つの系統だけが独立して残っている。電源、歯車、天井クレーン。

REI:
> 順番に戻せば、奥まで行けそうだ。

### 調査 / 復旧対象

- 主電源を迂回接続
- 歯車の位相を合わせる
- クレーンを退避させる
- 奥の整備室へ

奥への音楽条件未達時:
> 復旧した機械の音を確認する

### `gadgetPower`

ナレーション:
> 非常電源を迂回させると、床下を青白い光が走った。

SYSTEM:
```text
AUXILIARY POWER / ONLINE
```

### `gadgetGear`

ナレーション:
> 噛み合っていなかった歯車の印を重ねる。低い駆動音が曲のリズムに重なった。

REI:
> ……ちょっと気持ちいいな、これ。

### `gadgetCrane`

ナレーション:
> クレーンが軋みながら横へ退き、封鎖されていた整備室が現れた。

SYSTEM:
```text
MAINTENANCE PATH / OPEN
```

### 復旧UI

```text
RESTORE
機械区画を復旧する
POWER
GEAR
CRANE
```

POWER:
```text
POWER ROUTING
低圧から順に系統を接続する。AUX → BUS → MAIN
SEQUENCE ERROR — RESET
CONNECTED
```

GEAR:
```text
GEAR PHASE
発光マーカーが上部の基準線へ揃うよう、3つの歯車を回す。
TARGET: 90° / 180° / 270°
```

CRANE:
```text
CRANE CLEARANCE
クレーンを黄色い退避ベイまで移動する。
LEFT
RIGHT
TARGET BAY 4
```

完了:
```text
COMPLETE — 奥の整備室へ進める
```

---

## Scene: gadget-bit

### `bitFirst`

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

### 調査ポイント

- BITを調べる
- 中央管理端末へ

中央管理端末の音楽条件未達時:
> BITの起動音を聞く

### `bitInspect`

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

---

## Scene: gadget-auth

### `gadgetAuth`

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

### 調査ポイント

- BITと先へ進む

音楽条件未達時:
> 認証ログを最後まで確認する

---

# 5. 現行Vertical Slice終端

```text
VERTICAL SLICE 0.8
99.7%は、同じという意味だろうか。
CHAPTER 2 — Gadget Area / BIT INTRODUCTION
```

ボタン:

```text
TITLE
RESTART
```

---

# 6. 現時点で未実装の本編章

章順として確定しているが、レビュー可能な実ゲーム台詞はまだない:

```text
Load road（2回目）
wish
Fantasy
beautiful
Break / blavery
Naked
Signal
Spacecraft
New create
Thundercloud
Space Home
```

これらの章については、実装前に `docs/SCENARIO_DIRECTION.md` の「新章追加時チェックリスト」を埋める。

---

# 7. レビュー時にこの資料だけを渡す場合の注意

この資料は現行テキストの評価には適していますが、以下は別資料が必要です。

- キャラクター正式設定 → `docs/CHARACTER_BIBLE.md`
- 全体テーマ / 開発状況 → `README.md`, `docs/WORK_STATUS.md`
- シナリオ設計基準 → `docs/SCENARIO_DIRECTION.md`
- ビジュアル方針 → `docs/ART_DIRECTION.md`

シナリオレビューでは、この `SCENARIO_CURRENT_TEXT.md` を最優先の根拠にしてください。

設定資料に書いてあるがこの文書に存在しない台詞を「現在ゲーム内で表示される台詞」として扱わないでください。
