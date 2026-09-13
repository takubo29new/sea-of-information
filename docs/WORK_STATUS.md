# 最新作業状況

最終更新: 2026-09-13

## 現在のマイルストーン

**Vertical Slice v0.7 統合フェーズ**

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

### ChatGPT統合中
ブランチ: `chatgpt/v07-integration`

Claude修正版の`dev`を親にして以下を統合した。
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

## 実イラストの必要ファイル

`public/art/`へ順次配置する。

優先順:
1. `title/title-keyvisual.webp`
2. `sea/sea-main.webp`
3. `sea/sea-listening.webp`
4. `sea/sea-terminal.webp`
5. `sea/sea-dive.webp`
6. `city/city-morning.webp`
7. `city/city-loop.webp`
8. `city/city-investigation.webp`
9. `city/city-listening.webp`
10. `city/city-dusk.webp`
11. `city/city-night.webp`
12. `city/aurora-gate.webp`
13. `city/aurora-core.webp`
14. `characters/noa/noa-neutral.webp`
15. `characters/noa/noa-smile.webp`
16. `load-road/load-road-main.webp`
17. `load-road/load-road-listening.webp`
18. `gadget/gadget-main.webp`
19. `gadget/gadget-machinery.webp`
20. `gadget/gadget-listening.webp`
21. `gadget/gadget-scan.webp`
22. `characters/bit/bit-normal.webp`
23. `characters/bit/bit-warning.webp`

画像が未配置でも進行不能にはしない。CSSはフォールバック・補助演出として使用する。

## 次の開発順

1. `chatgpt/v07-integration` を`dev`へ統合
2. 上記実イラストを生成/配置
3. 既存章をTitleから通しで視覚確認
4. AstraでブラウザQA
5. QA修正
6. Gadget Areaのパズルを「1クリック」から短い環境操作へ改善
7. 次の`wish`章へ進む

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
