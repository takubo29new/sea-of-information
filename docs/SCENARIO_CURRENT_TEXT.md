# SEA OF INFORMATION — 現行ゲーム内テキスト集

最終更新: 2026-09-15
対象: `dev`

この資料は、**現在ゲーム内でプレイヤーが実際に目にする文章だけ**をレビューするための索引です。

設定資料に存在しても、この資料群に存在しない台詞を「現在ゲーム内で表示される台詞」として扱わないでください。

## 章別資料

- `docs/scenario-text/00_COMMON.md` — タイトル・OBJECTIVE・共通UI
- `docs/scenario-text/01_SEA.md` — Sea of information（人間的なRei反応・DIVER / ADMINISTRATOR補助）
- `docs/scenario-text/02_CITY.md` — City of Dawn（Noa会話増補・関係性・AURORA前の迷い）
- `docs/scenario-text/03_LOAD_ROAD.md` — Load road（1回目 / 2回目）
- `docs/scenario-text/04_GADGET.md` — Gadget Area / BIT / 99.7%（平易な操作文言・Reiリアクション増補）
- `docs/scenario-text/05_WISH_ENTRY.md` — WISH本編 / BIT自主復旧 / Fantasy入口
- `docs/scenario-text/06_FANTASY_TO_SPACE_HOME.md` — FantasyからSpace Homeのエンディングまで

## 2026-09-15 会話ポリッシュ

世界観・設定・章順・キャラクター設定・結末は変更せず、以下のみを現行実装へ反映しました。

- Noaの登場後の会話量を増やし、City of Dawnの街への個人的な思い出を追加
- ReiとNoaの雑談・軽いやり取りを追加し、調査だけで関係が終わらないよう調整
- AURORA前にNoaが迷い、Reiが待つ短い間を追加
- Sea序盤ではReiがSYSTEM用語を普通の言葉へ言い換えるよう調整
- Gadget Areaでは専門用語に日本語補助を付け、操作目的を先に理解できる文言へ変更
- BITの機械的な口調と既存の強い短文は維持
- Listening Stageの文章量・タイミングは変更していない

## レビュー時の優先資料

1. この章別テキスト集
2. `docs/SCENARIO_DIRECTION.md`
3. `docs/SCENARIO_READABILITY.md`
4. `docs/CHARACTER_BIBLE.md`

## 現在の実装範囲

収録済みのストーリー用楽曲について、以下の正規ルートを実装済みです。

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

`Newborn10` は企画対象外です。

後半のグラフィックは production target のみ登録され、正式素材が未承認のものはCSSフォールバックを使用します。

今後のシナリオレビューでは、実装済み台詞の評価にはこの資料群を一次資料として使用してください。
