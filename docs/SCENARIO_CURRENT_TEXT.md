# SEA OF INFORMATION — 現行ゲーム内テキスト集

最終更新: 2026-09-14
対象: `dev`

この資料は、**現在ゲーム内でプレイヤーが実際に目にする文章だけ**をレビューするための索引です。

設定資料に存在しても、この資料群に存在しない台詞を「現在ゲーム内で表示される台詞」として扱わないでください。

## 章別資料

- `docs/scenario-text/00_COMMON.md` — タイトル・OBJECTIVE・共通UI
- `docs/scenario-text/01_SEA.md` — Sea of information
- `docs/scenario-text/02_CITY.md` — City of Dawn
- `docs/scenario-text/03_LOAD_ROAD.md` — Load road（1回目 / 2回目）
- `docs/scenario-text/04_GADGET.md` — Gadget Area / BIT / 99.7%
- `docs/scenario-text/05_WISH_ENTRY.md` — WISH本編 / BIT自主復旧 / Fantasy入口
- `docs/scenario-text/06_FANTASY_TO_SPACE_HOME.md` — FantasyからSpace Homeのエンディングまで

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
