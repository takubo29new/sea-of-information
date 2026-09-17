# SEA OF INFORMATION — 全曲ビジュアル正式方針

最終更新: 2026-09-17

全15曲について、背景グラフィックと曲別アニメーションの正式方向を固定する。
UI・文字・ロゴは背景画像へ焼き込まず、React/CSSで描画する。
静止背景が未承認の場面では `v20-full-track-visuals.css` のプロシージャル背景を正式フォールバックとして使用する。

| Track | 背景の中心 | 曲別モーション |
| --- | --- | --- |
| Sea of information | 情報の海、青い記憶光 | 水面リップル、情報粒子 |
| City of Dawn | 8:42の生活感ある街 | 朝光、塵、暖色シャフト |
| Load Road | 記憶世界間の移動路 | 奥行きライン、前進ストリーム |
| Gadget Area | 停止した工業区画 | スキャン、機械グリッド、回路パルス |
| wish | 個人的メッセージ保管領域 | 漂うメッセージ断片 |
| Fantasy | 記録元のない不可能な景色 | 浮遊リング、歪んだ遠近 |
| beautiful | 変化し続ける柔らかな景色 | 光片・花びらのような漂い |
| Break | 書き込み停止された世界 | フリーズバー、走査グリッチ |
| blavery | 工業的な脱出経路 | 前方へ抜けるパルス |
| Naked | 最小限の識別空間 | 縦方向の識別スキャン |
| Signal | 地球外ライブ信号 | 電波リング、遠方信号粒子 |
| Spacecraft | 居住船団の航路 | 星間ルートストリーク |
| New create | 生成継続実験中枢 | 情報ノードの形成・接続 |
| Thundercloud | 最終対話の暗雲 | 控えめな稲光、圧迫する明滅 |
| Space Home | CREATE後の開かれた地平線 | 上昇する星、穏やかな地平光 |

## 実装

- `data/pvTimelines.ts`
  - 全15曲の音楽進行に応じた `submerged / drift / rise / impact / afterglow` を定義。
- `components/visual/AudioReactiveSurface.tsx`
  - 後半曲用の共通 motif レイヤーを追加。
- `app/v16-track-visualizers.css`
  - Sea / City / Load Road / Gadget の既存専用アニメーション。
- `app/v20-full-track-visuals.css`
  - wish 以降11曲の背景と専用アニメーション。
- `data/backgroundTargets.ts`
  - 全15曲の静止背景正式パスと制作方向。

## 静止背景の扱い

全15曲の制作再開時は、[STG全体設計の構図要件](STG_OVERALL_DESIGN.md#stg対応背景の制作要件)も適用する。
Load Road / Break / Signal / Thundercloudは戦闘の視認性、Space Homeは非戦闘フライトの余白を確保する。
Breakの具体的な背景条件は[Stage 2詳細設計](STG_BREAK_STAGE2_DESIGN.md#break背景への発注条件)を参照。
これらは制作・将来実装向けの設計であり、後半STGや正式背景の採用が完了したという意味ではない。

`data/backgroundTargets.ts` のパスを正式な納品先とする。
正式イラストが承認されるまではプロシージャル背景を使用し、未承認画像をランタイムへ自動表示しない。

静止イラスト制作時の共通条件:

- 16:9
- 背景のみ
- キャラクターを描き込まない（シーン上必要な場合を除く）
- UI / テキスト / ロゴ / 波形を焼き込まない
- ホットスポットが必要な探索背景では主要物の位置を実装と合わせる
- 過度なPV的グリッチや巨大な動きに頼らない
- Listening Stageでは音楽を主役にする

## パフォーマンス

曲別アニメーションは原則 `opacity` と `transform` を中心にする。
`prefers-reduced-motion` では主要アニメーションを停止する。
音声解析は既存の30fps更新を維持し、Reactの毎フレーム再レンダーを発生させない。
