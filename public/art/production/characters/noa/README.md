# Noa production sprites

Noa の正式立ち絵素材配置先。

2026-09-15 時点でユーザー承認済みの新しい髪型を正式デザイン基準とする。
旧Noaデザインへ戻さないこと。

## Required files

```text
public/art/production/characters/noa/
├─ noa-neutral.png
├─ noa-worried.png
├─ noa-surprised.png
└─ noa-soft-smile.png
```

## Source mapping

今回チャットで正式採用された4枚の対応:

- `noa-neutral.png` — 基本表情。落ち着いた正面表情
- `noa-worried.png` — 不安・戸惑い。眉が下がった表情
- `noa-surprised.png` — 驚き。目と口がやや大きく開いた表情
- `noa-soft-smile.png` — 控えめで柔らかい笑顔

## Runtime mapping

`components/visual/SceneVisual.tsx` の `NOA_CHARACTER` が上記4ファイルを参照する。

シーンごとの現在の表情:

- `noa` → neutral
- `city-investigation` → neutral
- `aurora-gate` → worried
- `aurora` → surprised
- `dusk` → soft-smile
- `night` → soft-smile

## Rules

- 透明背景PNG
- UI・文字・背景を焼き込まない
- 顔立ち、髪型、髪色、衣装、オレンジのマフラー、体型を4差分で維持
- 2026-09-15承認版の、以前より少し整理された髪型を正式基準にする
- Noaは16歳。過度に大人っぽい演出や別衣装への変更をしない
- 表情差分で別人化させない
