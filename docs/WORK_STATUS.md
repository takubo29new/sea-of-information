# 最新作業状況

最終更新: 2026-09-13

## 現在のマイルストーン

**Vertical Slice v0.7 — 実イラスト統合 / QA準備**

### 実装済み
- Sea of information
- City of Dawn 完走
- City of Dawn後のLoad Road
- Gadget Area入口〜3系統復旧
- BIT初登場
- `IDENTITY SCAN 99.7% / ADMINISTRATOR REI / WELCOME BACK`
- Music ArchiveへLoad road / Gadget areaを追加
- 15曲の実音源を`public/audio/`へ配置

### Claudeレビュー修正済み
`dev`へ以下がマージ済み。
- Listening Phase離脱時の状態リーク対策
- シーン遷移/会話送りの多重発火対策
- セーブ処理の安全化
- 画像欠損時のフォールバック
- 未定義CSSの補完
- 表記統一
- 音楽進捗表示を実音源のduration基準へ変更

### ChatGPT統合済み
PR #3を`dev`へ統合済み。
- `SceneVisual`: 実背景＋立ち絵＋光＋前景＋軽いパララックス
- `ListeningStage`: ミュージックプレイヤー型の専用音楽フェーズUI
- `artAssets.ts`: シーンと実イラストの対応表
- `listeningCues.ts`: 曲中の秒数に応じた短文/ムード/カメラ演出
- `v06.css`: 上記の視覚演出
- `GameApp.tsx`へSceneVisual / ListeningStageを接続
- 現行Scene.art名とアートマップのキー不一致を修正

Claude修正の以下は維持している。
- 多重発火防止
- Listening Phase状態リーク防止
- 実音源duration取得
- セーブ安全化

## Listening Phase 現在仕様

通常探索で、まだ曲を聴いてほしい進行ポイントを選んだ場合:

`通常画面 → Listening Stage → 曲同期の短文/光/カメラ変化 → SCENE UNLOCKED → 約1秒で通常シーンへ復帰 → 次イベント`

意図:
- 「入力が壊れている」と誤解させない
- 「いま音楽そのものが物語を進めている」と明示する
- 単なる残り時間待機画面にしない

## 実イラスト現在状況

### GitHubへ配置済み
- `city/city-morning.webp`
- `characters/noa/noa-neutral.webp`
- `load-road/load-road-main.webp`
- `gadget/gadget-main.webp`

### 次回追加予定
- `title/title-keyvisual.webp`
- `sea/sea-main.webp`
- `city/city-listening.webp`
- `load-road/load-road-listening.webp`
- `gadget/gadget-listening.webp`
- `characters/bit/bit-normal.webp`
- `characters/rei/rei-neutral.webp`

専用差分がまだない場面は、同章の実画像を再利用して進行不能や黒背景を避けるよう`artAssets.ts`を調整済み。

## 次の開発順

1. 追加アートを`public/art/`へ配置
2. Title→Gadget Area終端まで視覚確認
3. AstraでブラウザQA
4. QA修正
5. Gadget Areaのパズルを「1クリック」から短い環境操作へ改善
6. 次の`wish`章へ進む

## Astra QAで重点確認
- Title→Gadget Area終端まで進行不能がない
- 連打で二重遷移しない
- Listening Stageへ入った理由が分かる
- 曲が十分に耳へ入る
- `SCENE UNLOCKED`から通常画面への復帰が自然
- 実画像欠損時でも壊れない
- リロード/タブ切替/音量変更後も継続できる

## AI分担
- ChatGPT: メイン実装・統合・修正
- Claude: コードレビュー＋指摘修正
- Astra: 実ブラウザQA

詳細:
- `README.md`
- `docs/CLAUDE_REVIEW.md`
- `docs/ASTRA_QA.md`
- `docs/ART_DIRECTION.md`
- `docs/AI_COLLAB.md`
