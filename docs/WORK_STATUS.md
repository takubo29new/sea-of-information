# 最新作業状況

最終更新: 2026-09-13

## 現在のマイルストーン

**Vertical Slice v0.5**

### 実装済み
- Sea of information
- City of Dawn 完走
- Listening Phase UI
- City of Dawn後のLoad Road
- Gadget Area入口
- 電源・歯車・クレーンの3系統復旧
- BIT初登場
- BITとの最初の会話
- `IDENTITY SCAN 99.7% / ADMINISTRATOR REI / WELCOME BACK`
- Music ArchiveへLoad road / Gadget areaを追加
- 15曲の実音源を`public/audio/`へ配置

### 検証済み
- Scene参照
- Dialogue参照
- 音楽ゲートが曲長を超えていないこと
- Load Roadの最低Listening時間
- Gadget Areaの3条件パズル
- Gadget Area終盤まで曲を聴かせるゲート

エンジン検証結果:

`19 scenes / 40 dialogues`

## 現在の重要課題

### 1. 実イラスト置換
既存章も対象。

優先順:
1. Title
2. Sea of information
3. City of Dawn探索
4. Noa
5. City of Dawn夕方/夜
6. Load Road
7. Gadget Area
8. BIT

CSS描画はフォールバック・演出補助として残してよいが、完成版の主役にはしない。

### 2. Listening Phase磨き込み
現状は専用フルスクリーンUIへ切り替わる。

次に改善する項目:
- 曲のセクションごとの背景/短文変化
- unlock直前の演出
- Scene復帰時のfade品質
- タブ切替/リロード時の挙動
- 「待機画面」感の削減

### 3. Gadget Areaのゲーム性
現状はhotspotベースの3系統復旧。

次段階ではクリック一発ではなく、短い環境操作として見せる候補:
- 歯車の位相合わせ
- 電源ライン接続
- クレーン位置合わせ

ただし複雑なパズルにはしない。曲とテンポを邪魔しない短さを優先。

## 次の開発順

1. v0.5をClaudeへコードレビュー依頼
2. 指摘修正
3. 実イラスト素材を既存章＋Gadget Areaへ統合
4. Astraで実ブラウザQA
5. QA修正
6. 次の`wish`章へ進む

## AI分担

- ChatGPT: メイン実装・統合・修正
- Claude: コードレビュー
- Astra: ブラウザQA

詳細は以下:
- `README.md`
- `docs/CLAUDE_REVIEW.md`
- `docs/ASTRA_QA.md`
