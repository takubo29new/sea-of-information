# 最新作業状況

最終更新: 2026-09-17

## 現在のマイルストーン

**Full Soundtrack Story Route — 15曲の正規ルート実装完了 / グラフィック・QA仕上げフェーズへ移行**

## STG設計の更新（2026-09-17）

- Load RoadのStage 1は実装済み。CORRUPTED NODEの排除、敵弾、段階的な同時出現を基準とする。
- [STG全体設計](STG_OVERALL_DESIGN.md)を新規作成。Break=Stage 2、Signal=Stage 3、Thundercloud=Stage 4/ボス、Space Home=非戦闘フライトを設計上の役割として整理した。
- [Break詳細設計](STG_BREAK_STAGE2_DESIGN.md)を新規作成。3WAY弾・シールドの段階導入、既存会話と音楽への挿入、報酬・PERFECT条件、背景要件を定義した。
- 今回は設計資料のみ。Break以降のSTG、フライト、報酬保存、音楽再キューは未実装。数値は試作初期値で、実プレイ未検証。

## 正規ルート

```text
Sea of information
→ City of Dawn
→ Load Road
→ Gadget Area
→ Load Road
→ wish
→ Fantasy
→ beautiful
→ Break
→ blavery
→ Naked
→ Signal
→ Spacecraft
→ New create
→ Thundercloud
→ Space Home
```

`Newborn10` は企画対象外。

## 実装済み

### 前半
- Sea of information: 3つの記憶断片 → terminal → DIVE
- City of Dawn: OBSERVE → COMPARE → 介入 → Noa → AURORA → 初めての8:43 / 夜
- Load Road 1回目
- Gadget Area: 電源 / 歯車 / クレーン復旧 → BIT → 99.7%認証
- Load Road 2回目: BIT同行開始

### WISH
- 普通の人々が未来に向けて残した3メッセージ
- `OUTCOME RECORD / NOT FOUND`
- 壊れた4件目をBITが自主的に復旧
- BITの変化を説明ではなく行動で提示

### Fantasy
- 保存元の存在しない景色を初めて体験
- 既存記録の要素から、過去に存在しなかった組み合わせが成立していることを確認
- SEAが単なる保存庫ではない可能性を提示

### beautiful
- 変化し続ける生成世界
- 静止記録は保存できるが、現在状態を完全には戻せない
- BITの「保存状態へ固定」提案をReiが拒否

### Break / blavery
- 管理系統が生成領域への書き込みを停止
- ロールバックで新しい差分が失われることを提示
- BITが管理命令を受信しながら、Reiとの経路継続を優先

### Naked
- 99.7%の照合対象を明確化
- ReiはDr. Rei本人ではないと明言
- ReiはDr. Rei関連情報を一部に使い、人類アーカイブから新しく生成された存在
- Rei自身が「レイ」を自分の名前として受け取る

### Signal
- SEA外部から更新され続けるLIVE信号を受信
- 地球外の人類由来音声を確認

### Spacecraft
- 居住船団の地球脱出記録
- `EARTH CIVILIZATION / TERMINATED` は地球文明の終焉であり、人類全体の絶滅ではないと明確化
- SEA OF INFORMATIONが未来へ記録を渡す継続ノードであることを確認

### New create
- 管理AIとして残ったDr. Reiと直接対面
- Rei / Dr. Reiの関係を再確認
- `NEW CREATE / GENERATIVE CONTINUITY EXPERIMENT`
- 保存記録から新しい場所・人を生成する仕組みを明示

### Thundercloud
- Dr. Reiが34年間見てきた生成世界の苦しみを提示
- Dr. Reiを単純な敵にしない
- `RESTORE / DELETE / RESET`
- Reiが第四の答え `CREATE` を選択

### Space Home
- `CREATE / RUNNING`
- 地球外の人類との接続は継続
- 最終表示:

```text
WORLD COMPLETION 99.99%
MISSING DATA
FUTURE
```

BIT「100%ではありません。」
Rei「だからいいんだよ。」

エンディング:

```text
WEATHER FORECAST
UNKNOWN
STATUS
NORMAL
```

BIT「明日の天気が分かりません。」
Rei「明日になれば分かるよ。」

## 音楽

15曲をTrackId / AudioManager / SAVE許可リスト / Listening timelineへ登録済み。
ユーザー提供の実音源を解析し、後半の主要進行ゲートを曲構造へ合わせている。

- Sea of information
- City of Dawn
- Load road
- Gadget area
- wish
- Fantasy
- beautiful
- Break
- blavery
- Naked
- Signal
- Spacecraft
- New create
- Thundercloud
- Space Home

Music Archiveは既存4曲に加え、解放済み後半曲をGlobalUXから追加表示する。

## シナリオ資料

現行ゲーム内テキスト一次資料:
- `docs/SCENARIO_CURRENT_TEXT.md`
- `docs/scenario-text/00_COMMON.md`
- `docs/scenario-text/01_SEA.md`
- `docs/scenario-text/02_CITY.md`
- `docs/scenario-text/03_LOAD_ROAD.md`
- `docs/scenario-text/04_GADGET.md`
- `docs/scenario-text/05_WISH_ENTRY.md`
- `docs/scenario-text/06_FANTASY_TO_SPACE_HOME.md`

設計基準:
- `docs/SCENARIO_DIRECTION.md`
- `docs/SCENARIO_READABILITY.md`
- `docs/CHARACTER_BIBLE.md`
- `docs/ART_DIRECTION.md`

## グラフィック

Load Roadの正式背景を2026-09-17に組み込み、STG実画面で自機・回収物・敵・敵弾の視認性を確認した。
原画1672×941をクロップせずWebP化し、通常シーンとListening Stageで共有する。
詳細・確認範囲は[素材記録](../public/art/production/load-road/README.md)を参照。

ランタイムにはTitle / Seaの背景、Rei / Noa / BITの立ち絵も登録されている。
その他の背景は引き続き別セッションで正式素材を制作・確認する。
未承認素材はランタイムで表示せず、CSSフォールバックを使う。

今後の重要背景 production target:
- Fantasy
- beautiful
- Break / blavery
- Naked
- Signal
- Spacecraft
- New Create
- Thundercloud
- Space Home

## 技術構成

前半の既存シーンは `data/scenes.ts` を維持。
後半は巨大ファイル化を避けるためモジュール登録方式へ移行:
- `data/futureScenes.ts` — Fantasy / beautiful
- `data/lateScenes.ts` — BreakからSpace Home
- `data/registerFutureScenes.ts` — 登録順管理

`GlobalUX.tsx` で後半章レジストリを初期化する。
エンジンテスト側でも同じレジストリを読み、全遷移先・音楽ゲートを検証する。

## CI / 自動チェック

- TypeScript typecheck
- Rei dialogue consistency check
- engine/data validation test
- production build

Full soundtrack route実装後のQualityが成功済み。

## 次の開発順

1. STG全体設計・Break Stage 2詳細設計を基準に、全15曲の正式背景候補制作へ戻る。
2. STG対応5曲の構図・視認性と探索ホットスポットを確認し、承認済み背景を順次組み込む。
3. Load Roadの最終QA（音量・チュートリアル・PERFECT・再訪）を行う。
4. 背景制作後にBreak Stage 2を実装し、Stage 1からの学習曲線を実プレイで調整する。
5. Noa / BIT / Dr. Reiなど未承認キャラクター素材を統合する。
6. 全曲ルート、Listening Stage、狭幅、SAVE/LOAD、Music Archiveの回帰QAとシナリオ通読を行う。

## AI分担

- ChatGPT: メイン実装・統合・シナリオ設計・修正
- Claude: コードレビュー＋フル回帰QA
- Astra: 節目のプレイヤー体験QA
