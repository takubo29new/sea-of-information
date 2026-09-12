# Claude コードレビューガイド

このリポジトリは、オリジナルブラウザゲーム **SEA OF INFORMATION** です。

まずルートの`README.md`を読み、特別な指示がない限り`dev`ブランチを現在の正本として扱ってください。

## Claudeの役割

このプロジェクトでは、Claudeには主に**シニアエンジニアとしてのコードレビュー**を期待しています。

ゲームの物語・演出・製品方針を独自に作り替えるのではなく、現在の設計意図を尊重しつつ、具体的な不具合・保守性リスク・将来的な破綻要因を早めに見つけてください。

## レビュー優先順位

### 1. Critical — 進行不能・データ損失
最優先で確認してください。

- 到達不能な出口しかないシーン
- 永遠に成立しない条件
- stale closure / state不整合による誤進行
- 1回の操作でイベントが二重実行される
- 不正sceneIdや矛盾したflagを復元してしまうセーブ
- 章遷移で必要flagが失われる
- Listening Phase / 音楽ゲートから永久に抜けられない
- reload / Continueでゲームが詰む

### 2. 音声ライフサイクル
このゲームでは音楽がゲームシステムの中心です。

確認項目:
- ブラウザautoplay制限
- 同一曲を継続すべきシーンで毎回曲が頭から再生されないか
- 古い`timeupdate` / `ended`リスナーが残らないか
- Audioインスタンスが複数同時再生されないか
- 音量設定の保存/復元
- metadata読込前に`currentTime`等へ依存していないか
- unmount / scene change時のcleanup
- Listening Phaseのunlock時刻
- タブ非アクティブ→復帰時の挙動

### 3. React / TypeScript
- useEffect依存配列の誤り
- scene/dialogue/musicの切替でrace conditionが起きないか
- derived stateを不要にstate化していないか
- state/data objectを直接mutationしていないか
- 危険な型cast
- timer / listener cleanup漏れ
- unstable key
- 15曲・多数章へ拡張した際に破綻しそうな密結合

### 4. セーブ互換性
開発期間中にGameStateは何度も拡張されます。

以下を確認してください。
- version管理
- validation
- 壊れたlocalStorageへの安全なfallback
- 欠損フィールド
- 古いセーブに新しいフィールドがない場合
- 不正sceneId
- 不可能なflag組み合わせ

### 5. 入力の堅牢性
特に以下を想定してください。
- ダブルクリック
- hotspot連打
- Enter/Spaceとマウスの同時操作
- fade中クリック
- Listening Phase unlock直前/直後のクリック
- タブ切替
- dialogue中reload
- scene transition中reload

### 6. アセット・性能
実イラストと大型音源へ移行中です。

以下を指摘してください。
- 過大な画像メモリ使用
- 不要なlayout shift
- preload/lazy load不足
- 絵のレイヤーによる操作/可読性阻害
- 高負荷なanimation loop
- 不要な再レンダリング

## 絶対に「修正対象」と誤解しない設計

以下は意図的な仕様です。

- 主要曲を長めに聴かせる
- 音楽進行によるゲートそのもの
- Listening Phaseで通常UIから大きく見た目を変える
- `Scene → Event`のデータ駆動構造
- RPG要素を増やさない
- 15曲を15ステージに機械的対応させない

問題なのは「待つこと」自体ではなく、**なぜ待っているか分からない・退屈・壊れて見える・解除されない**状態です。

## レビュー結果の形式

以下の順番で返してください。

### Critical
各項目:
- ファイル + 該当箇所
- 再現条件
- 何が起きるか
- なぜ重要か
- 最小の安全な修正案

### Medium
同形式。

### Minor
簡潔で構いません。

### 問題なしと確認できた点
一度確認して問題なかった重要システムも短く書いてください。

### 追加すべきテスト
現実的に回帰バグを捕まえられるものだけ挙げてください。

Criticalがなければ、明示的に

**Critical blockerなし**

と書いてください。

個人的に別アーキテクチャが好みというだけの理由で大規模リライトを提案しないでください。現在の構造に具体的な正しさ・保守性問題がある場合のみ、段階的な改善案を出してください。

## 現在のレビュー対象

現時点では特に以下を確認してください。

- `Sea of information`
- `City of Dawn`
- Listening Phase基盤
- City of Dawn後の`Load road`
- `Gadget Area`
- BIT登場
- `IDENTITY MATCH 99.7%`までの進行

今後章が増えたら、READMEの「現在進行中」を優先してください。
