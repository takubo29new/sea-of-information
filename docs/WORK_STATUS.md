# 最新作業状況

最終更新: 2026-09-13

## 現在のマイルストーン

**Vertical Slice v0.7 — ビジュアル再設計 / Cityゲーム性改善中**

### 実装済み
- Sea of information
- City of Dawn 完走
- City of Dawn後のLoad Road
- Gadget Area入口〜3系統復旧
- BIT初登場
- `IDENTITY SCAN 99.7% / ADMINISTRATOR REI / WELCOME BACK`
- Music ArchiveへLoad road / Gadget areaを追加
- 15曲の実音源を`public/audio/`へ配置

## 2026-09-13 方針変更: ビジュアル再設計

ユーザー確認で、初期生成アートに以下の問題が判明したため、完成版素材としての使用を停止した。

- 背景画像そのものにタイトル文字・日本語コピー・MENU・ミニマップ・波形などのUIが焼き込まれていた
- React側UIと生成画像内UIが二重化していた
- キャラクター素材が透過立ち絵ではなく、背景付きカード画像だった
- `cover`表示とズーム演出により背景が過度に拡大されて見えた
- ホットスポットがWeb UI的で、ゲーム世界と馴染んでいなかった

現在は問題アートをランタイムから外し、CSSによるクリーンな仮背景へ戻している。

今後の画像必須条件:
- 背景: 16:9、文字なし、ロゴなし、UIなし、MENUなし、ミニマップなし
- キャラクター: 背景透過、UIなし、文字なし
- 完成ゲーム画面を1枚画像として生成して背景に使用しない
- 背景 / キャラクター / UIを必ず別レイヤーとして管理する

## Rei 設定変更

Reiは正式に**17歳の女性主人公**へ変更した。

- 黒〜濃紺の髪
- 細身
- 白〜ライトグレーの服
- 青いDIVEデバイス
- 一人称は基本「私」
- 過度に女性的な語尾にはしない
- Dr. Reiは生前男性のまま
- 性別・年齢が異なることは、99.7%一致しても同一人物ではないことを視覚的に示す要素として扱う

追加済み:
- `docs/CHARACTER_BIBLE.md`
- `scripts/check-rei-dialogue.mjs`
- `npm run check:rei`
- Reiの「俺」「僕」混入チェック

## Sea of information 序盤ゲーム性

最初の探索に明確な目的を追加済み。

`3つの記憶断片を復元する → 3/3 → 新しい信号出現 → 次の場所へ`

探索済みポイントは視覚的に沈静化し、Objective側にも進捗を返す。

## City of Dawn ゲーム性改善

最初の2ループを、単なるクリック巡回から**観察 → 比較 → 介入**の短い推理ゲームへ変更。

### 1周目: OBSERVE
以下4つをすべて記録する。
- 時計塔 / 08:42
- 少年 / 転倒
- 鳥 / 3羽
- パン屋 / 08:42

4つの観察フラグが揃うまで駅への進行ポイントは出現しない。

保存フラグ:
- `city.observeClock`
- `city.observeChild`
- `city.observeBirds`
- `city.observeBakery`

### 2周目: COMPARE
前周の記録と以下3項目を照合する。
- 時計塔
- 鳥
- パン屋

3つすべてが一致して初めて、少年へ介入する選択肢が出現する。

保存フラグ:
- `city.matchClock`
- `city.matchBirds`
- `city.matchBakery`

介入:
`結果を変える：少年に声をかける`

プレイヤー自身が「これは同じ朝だ」と確認してからループを壊す構造にした。

回帰テストも追加済み:
- 1周目は4観察必須
- 2周目は3一致必須
- 既存の音楽ゲートも維持

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
   - 旧実画像はランタイムから外し、クリーンな仮背景へ戻した。
   - ホットスポットは世界内の小さな探索シグナルとして再設計。

3. Reload→Continueで曲が0:00から再開
   - 再生位置をtrack単位でlocalStorageへ1秒間隔保存。
   - Continue時に保存位置を読み、AudioManager.seek()で復帰。
   - NEW GAME時は保存した曲位置をクリア。

4. 狭い画面でホットスポットラベルが透明
   - 900px以下またはpointer: coarseで常時表示へ変更。

### Minor指摘と対応
1. Listening用実画像に焼き込まれた時刻/波形と実UIが重複
   - 焼き込みUIを含む画像はランタイム不使用。

2. Rei立ち絵が長方形のまま背景に重なる
   - 背景透過の正式素材完成までcharacterレイヤー表示停止。

## Claudeレビュー修正済み
- Listening Phase離脱時の状態リーク対策
- シーン遷移/会話送りの多重発火対策
- セーブ処理の安全化
- 画像欠損時のフォールバック
- 未定義CSSの補完
- 表記統一
- 音楽進捗表示を実音源のduration基準へ変更

## Listening Phase 現在仕様

`通常画面 → Listening Stage → 曲同期の短文/光/カメラ変化 → SCENE UNLOCKED → 約1.1秒 → 通常シーンへ復帰 → 次イベント`

意図:
- 「入力が壊れている」と誤解させない
- 「いま音楽そのものが物語を進めている」と明示する
- 単なる残り時間待機画面にしない

## CI / 自動チェック

追加済み:
- TypeScript typecheck
- Rei dialogue consistency check
- engine/data validation test
- production build

`npm run check`でローカル確認可能。

## 次の開発順

1. City of DawnのOBSERVE / COMPARE進捗を画面上で分かる小型UIへ反映
2. Gadget Areaの3系統復旧を「1クリック」から短い実操作へ改善
3. 正式なゲーム用背景・女性Rei / Noa / BIT透過立ち絵を再制作
4. Astra利用上限回復後、Title→Gadget Area終端まで再QA
5. 残るQA指摘を修正
6. `wish`章へ進む

## 次回Astra QAで重点確認
- Sea序盤のObjectiveが直感的か
- City 1周目で4観察を自然に理解できるか
- City 2周目で3一致→少年への介入という推理の流れが伝わるか
- `SCENE UNLOCKED`後、約1.1秒で確実に通常画面へ戻る
- Reload→ContinueでBGMが中断位置付近から再開する
- 狭い画面でもホットスポットが見える
- Title→Gadget Area終端まで進行不能がない
- Gadget Area / BIT / 99.7%認証を最後まで通過できる

## AI分担
- ChatGPT: メイン実装・統合・修正
- Claude: コードレビュー＋指摘修正
- Astra: 実ブラウザQA

詳細:
- `README.md`
- `docs/CHARACTER_BIBLE.md`
- `docs/CLAUDE_REVIEW.md`
- `docs/ASTRA_QA.md`
- `docs/ART_DIRECTION.md`
- `docs/AI_COLLAB.md`
