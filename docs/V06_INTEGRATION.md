# v0.6 実イラスト / Listening Phase 統合メモ

このブランチ `chatgpt/v06-art` は、Claude が `dev` 側でレビュー修正している間に競合を避けるため、**新しい視覚レイヤーを別ファイルで先行実装**している。

## 追加済み

- `data/artAssets.ts`
  - シーンごとの背景 / キャラクター立ち絵 / Listening Phase用アートのマッピング
- `data/listeningCues.ts`
  - 楽曲内の秒数に応じてテキスト・ムード・カメラ演出を変えるタイムライン
- `components/visual/SceneVisual.tsx`
  - 実イラスト背景＋キャラクター立ち絵＋光・前景・パララックスを描画する共通レイヤー
- `components/visual/ListeningStage.tsx`
  - 既存のMusicFocusを置き換えるための専用Listening Phase UI
- `app/v06.css`
  - 上記2コンポーネントの演出スタイル

## Claude修正後の統合手順

1. Claudeの修正が `dev` に入ったことを確認する。
2. `chatgpt/v06-art` を最新 `dev` に追従させる。
3. `GameApp.tsx` の旧 `SceneArt` を `SceneVisual` に置き換える。
4. 旧 `MusicFocus` を `ListeningStage` に置き換える。
5. `scene.art` をそのまま `SceneVisual artKey={scene.art}` へ渡す。
6. Listening Stageへ以下を渡す。
   - `track={scene.track}`
   - `title={TRACK_META[scene.track].title}`
   - `position={musicPosition}`
   - `duration={TRACK_META[scene.track].duration}`
   - `unlockAt={musicFocus.until}`
   - `phase={musicFocus.phase}`
7. `public/art/` に実画像を配置する。
8. 画像が存在しない場合も進行不能にならないことを確認する。
9. Claudeレビュー → Astra QAを再実施する。

## Listening Phaseで守ること

- 「操作できない」ではなく「いま音楽が物語を進めている」と明示する。
- 曲名・現在位置・次の場面位置を表示する。
- 同じ静止画を数分出し続けない。
- 曲中のキューに合わせて短いテキスト、光、カメラ移動、グリッチ等を変える。
- `SCENE UNLOCKED` 表示後は自然に通常シーンへフェード復帰する。
- ゲート到達直前の多重入力でイベントが二重実行されないようにする。

## 実アートの優先順位

1. Title key visual
2. Sea of information main / listening
3. City of Dawn morning / loop / investigation / listening
4. Noa neutral / smile
5. Load Road main / listening
6. Gadget Area main / machinery / scan / listening
7. BIT normal / warning
8. Rei standing art

## 注意

AI画像生成時のコンセプトボードやUIモックは、**そのまま最終ゲーム背景にしない**。文字・UIが画像へ焼き込まれたものは参考資料扱いとし、ゲーム用背景は原則として文字無し・UI無しで用意する。
