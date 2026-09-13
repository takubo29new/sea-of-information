# 正式アート制作・承認フロー

SEA OF INFORMATION では、背景・キャラクター・UIを必ず別レイヤーで管理する。
完成ゲーム画面を1枚画像として生成し、そのまま背景として使用しない。

## 1. ランタイム採用条件

`data/artAssets.ts` の `approved: true` になった素材だけがゲーム内で表示される。

`approved: false` の間は、ファイルパスが登録されていてもゲームはCSS仮背景を使用する。

### 背景の必須条件
- 16:9
- 推奨 1920x1080 WebP
- 文字なし
- ロゴなし
- MENUなし
- ミニマップなし
- 波形なし
- 会話枠なし
- OBJECTIVEなし
- 探索マーカーなし
- 画面全体を前提に構図を完成させる
- `object-fit: contain` で見せても成立する構図

### キャラクター立ち絵の必須条件
- 透明背景 PNG / WebP
- UIなし
- 文字なし
- 背景なし
- 全身または膝上までが自然に収まる
- 顔・服装・色を CHARACTER_BIBLE と一致させる

## 2. 承認手順

1. `public/art/candidates/` 相当で素材を確認する
2. 文字/UIの焼き込みがないことを確認する
3. 16:9表示で不自然な拡大・クロップがないことを確認する
4. キャラ素材は透過を確認する
5. 実ブラウザで背景 + キャラ + React UIを重ねて確認する
6. 問題なければ正式パスへ配置する
7. `data/artAssets.ts` で `approved: true` にする
8. CI成功後に採用完了

## 3. Vertical Sliceで必要な正式素材

### Title
- `/art/production/title/title-background.webp`
- 16:9
- 女性Reiは遠景または後ろ姿でも可
- タイトル文字は画像へ入れない

### Sea of Information
- `/art/production/sea/sea-background.webp`
- `/art/production/characters/rei/rei-neutral.webp`
- `/art/production/characters/rei/rei-thinking.webp`（任意）

背景方針:
- 青い情報の海
- 無数の人間の記憶を感じさせる光
- 巨大な光の生物/鯨のようなモチーフは可
- 探索ポイントを置ける余白を確保

### City of Dawn
- `/art/production/city/city-morning.webp`
- `/art/production/city/city-glitch.webp`
- `/art/production/city/city-dusk.webp`
- `/art/production/city/city-night.webp`
- `/art/production/characters/noa/noa-neutral.webp`
- `/art/production/characters/noa/noa-smile.webp`

背景内に必要な視覚ランドマーク:
- 時計塔
- 少年がいる場所
- 鳥が見える空
- パン屋

これらはゲーム内ホットスポットと画面位置を合わせられること。

### Load Road
- `/art/production/load-road/load-road-background.webp`

### Gadget Area
- `/art/production/gadget/gadget-entry.webp`
- `/art/production/gadget/gadget-machinery.webp`
- `/art/production/gadget/gadget-auth.webp`
- `/art/production/characters/bit/bit-normal.webp`
- `/art/production/characters/bit/bit-alert.webp`

## 4. キャラクター基準

### Rei
- 17歳女性
- 黒〜濃紺の髪
- 白〜ライトグレー中心
- 青いDIVEデバイス
- 細身
- 装飾過多にしない
- 少し中性的で自然な雰囲気

### Noa
- 16歳女性
- オレンジのスカーフを必ず維持
- Reiより暖色寄り

### BIT
- 30〜40cm程度
- 黄色 + 黒/濃灰
- 工業用
- LCD顔
- 美少女ロボット化しない

詳細は `docs/CHARACTER_BIBLE.md` を参照。

## 5. 表示ルール

- 背景: `object-fit: contain`
- キャラクター: `object-fit: contain`
- 背景を大きく見せるためのズームは最大でも約2%程度
- 画面比率が16:9でない場合、クロップよりレターボックスを優先
- UIはReact/CSSでのみ描画する
- Listening Stageでも承認済み素材だけを使用する

## 6. 禁止事項

以下の画像は本番採用しない。

- ゲーム画面のモックアップそのもの
- 日本語セリフが画像に焼き込まれたもの
- MENU/OBJECTIVE/波形/ボタンを含むもの
- 不透明背景付きキャラクターカード
- キャラクターの性別や設定が CHARACTER_BIBLE と違うもの
- 拡大しないと使えない構図
