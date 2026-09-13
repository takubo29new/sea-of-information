# 最新作業状況

最終更新: 2026-09-13

## 現在のマイルストーン

**Vertical Slice v0.7 — Astra QA指摘修正中**

### 実装済み
- Sea of information
- City of Dawn 完走
- City of Dawn後のLoad Road
- Gadget Area入口〜3系統復旧
- BIT初登場
- `IDENTITY SCAN 99.7% / ADMINISTRATOR REI / WELCOME BACK`
- Music ArchiveへLoad road / Gadget areaを追加
- 15曲の実音源を`public/audio/`へ配置

## Astra QA 1回目

到達地点:
- Title
- Sea of information
- Sea Listening Stage
- City of Dawn
- City Listening Stage
- 朝の反復
- 子どもへの介入
- Noa初登場

利用上限によりGadget Area以降は未検証。

### Critical
- 0件

### Medium指摘と対応
1. `SCENE UNLOCKED`後もListening Stageから戻らない
   - 原因: listening→ready切替と復帰タイマーを同じeffectで扱い、phase変更時のcleanupがタイマーを消していた。
   - 対応: ready遷移と復帰タイマーを別effectへ分離。ready後約1.1秒でaction実行。

2. City背景が暗く、ホットスポットを視覚判断しづらい
   - 対応: City画像の存在を確認。QA用CSSで背景明度・dawnビネットを調整。
   - 狭い画面/タッチではホットスポットラベルと操作輪郭を常時表示。

3. Reload→Continueで曲が0:00から再開
   - 対応: 再生位置をtrack単位でlocalStorageへ1秒間隔保存。
   - Continue時に保存位置を読み、AudioManager.seek()で復帰。
   - NEW GAME時は保存した曲位置をクリア。

4. 狭い画面でホットスポットラベルが透明
   - 対応: 900px以下またはpointer: coarseで常時表示へ変更。

### Minor指摘と対応
1. Listening用実画像に焼き込まれた時刻/波形と実UIが重複
   - 対応: QAビルドではUIなしのメイン背景をListening Stageにも使用。
   - 専用Listening画像はクリーン素材へ作り直すまで不使用。

2. Rei立ち絵が長方形のまま背景に重なる
   - 対応: 透過素材を作り直すまでReiの独立characterレイヤー表示を停止。

## Claudeレビュー修正済み
- Listening Phase離脱時の状態リーク対策
- シーン遷移/会話送りの多重発火対策
- セーブ処理の安全化
- 画像欠損時のフォールバック
- 未定義CSSの補完
- 表記統一
- 音楽進捗表示を実音源のduration基準へ変更

## ChatGPT統合済み
- `SceneVisual`: 実背景＋立ち絵＋光＋前景＋軽いパララックス
- `ListeningStage`: ミュージックプレイヤー型の専用音楽フェーズUI
- `artAssets.ts`: シーンと実イラストの対応表
- `listeningCues.ts`: 曲中の秒数に応じた短文/ムード/カメラ演出
- `v06.css`: 上記の視覚演出
- `qa-fixes.css`: Astra QA由来の視認性/レスポンシブ修正
- `GameApp.tsx`へSceneVisual / ListeningStageを接続
- v2アートを実ランタイム参照へ接続

## Listening Phase 現在仕様

`通常画面 → Listening Stage → 曲同期の短文/光/カメラ変化 → SCENE UNLOCKED → 約1.1秒 → 通常シーンへ復帰 → 次イベント`

意図:
- 「入力が壊れている」と誤解させない
- 「いま音楽そのものが物語を進めている」と明示する
- 単なる残り時間待機画面にしない

## 実イラスト現在状況

### GitHubへ配置済み
- `title/title-keyvisual.webp`
- `sea/sea-main.webp`
- `characters/rei/rei-neutral.webp`（現在characterレイヤーでは不使用）
- `city/city-morning.webp`
- `city/city-listening.webp`（現在Listening Stageでは不使用）
- `characters/noa/noa-neutral.webp`
- `load-road/load-road-main.webp`
- `load-road/load-road-listening.webp`（現在Listening Stageでは不使用）
- `gadget/gadget-main.webp`
- `gadget/gadget-listening.webp`（現在Listening Stageでは不使用）
- `characters/bit/bit-normal.webp`

専用差分がまだない場面は、同章の実画像を再利用し、overlay / Listening Stage演出で見え方を変える。

## 次の開発順

1. Astra利用上限回復後、修正版でTitle→Gadget Area終端まで再QA
2. 未到達だったGadget Area / BIT / 99.7%認証を重点確認
3. 残るQA指摘を修正
4. Gadget Areaのパズルを「1クリック」から短い環境操作へ改善
5. 次の`wish`章へ進む

## 次回Astra QAで重点確認
- `SCENE UNLOCKED`後、約1.1秒で確実に通常画面へ戻る
- Reload→ContinueでBGMが中断位置付近から再開する
- City背景が正常表示される
- 狭い画面でもホットスポットラベルが見える
- Listening Stageで時刻/波形が二重表示にならない
- Title→Gadget Area終端まで進行不能がない
- 連打で二重遷移しない
- Gadget Area / BIT / 99.7%認証を最後まで通過できる

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
