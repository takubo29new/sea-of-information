# WISH — 現行ゲーム内テキスト

最終更新: 2026-09-14
対象: `dev`

## 章表示

```text
PERSONAL MESSAGES
WISH
```

SYSTEM:
```text
PERSONAL MESSAGES / 4 RECORDS
```

REI:
> メッセージ？

BIT:
> 音声・文書記録です。

REI:
> じゃあ、聞いてみよう。

## 3つのメッセージ

### MESSAGE 01

> 『18歳の私へ。まだ絵、描いてますか。』

REI:
> 未来の自分宛てか。

### MESSAGE 02

> 『退院したら、駅前のラーメン。絶対。』

REI:
> ……こういうの、いいな。

### MESSAGE 03

> 『次の休み、海を見に行こう。今度こそ。』

BIT:
> 実行結果は付属していません。

REI:
> まだ聞かなくていいよ、それ。

## 結果記録

3件をすべて確認後、曲の進行に合わせて開放。

SYSTEM:
```text
OUTCOME RECORD / NOT FOUND
```

BIT:
> 3件とも、結果記録がありません。

REI:
> 起きたことじゃなくて、これからしたかったことなんだ。

## 壊れた4件目

SYSTEM:
```text
MESSAGE 04 / AUDIO DAMAGED
RESTORE NOT REQUIRED
```

REI:
> これは、聞けないか。

ナレーション:
> BITが壊れた音声の前で止まった。

BIT:
> 補助電源を3.2秒使用します。

REI:
> 何してるの？

BIT:
> 音声部のみ復旧します。

復旧音声:
> 『来年も、ここに来ようね。』

REI:
> ……直したんだ。

REI:
> それ、必要だった？

BIT:
> ……移動には不要です。

REI:
> そっか。

## Fantasy入口

WISHの終盤、約302秒以降で進行可能。

章表示:
```text
SOURCE RECORD / NOT FOUND
FANTASY
```

SYSTEM:
```text
NEXT AREA
SOURCE RECORD / NOT FOUND
```

BIT:
> 次の領域に、保存元の記録がありません。

REI:
> 記録にない場所？

BIT:
> 定義できません。

REI:
> ……じゃあ、見に行こう。

## 進行ゲート

- 3メッセージ確認 → 結果記録: 約126秒
- 壊れた4件目: 約194秒
- BITの自主復旧: 約227秒
- Fantasy入口: 約302秒

実音源 `wish.m4a` の実尺は約336.9秒。終盤約302秒以降は新しいListeningテキストを追加せず、余韻を優先する。