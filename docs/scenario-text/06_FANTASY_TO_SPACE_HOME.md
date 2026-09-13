# SEA OF INFORMATION — 後半実装テキスト

最終更新: 2026-09-14
対象: `dev`

この資料は、現在ゲーム内に実装されている **Fantasy → beautiful → Break / blavery → Naked → Signal → Spacecraft → New Create → Thundercloud → Space Home** の主要表示文・会話を、レビュー用に章順で整理したものです。

この資料にない設定資料上の例文を、現在ゲーム内に存在する台詞として評価しないでください。

---

## Fantasy

章表示:
```text
SOURCE RECORD / NOT FOUND
FANTASY
```

SYSTEM:
```text
SOURCE RECORD / NOT FOUND
```

BIT:
> 照合できる保存元がありません。

REI:
> でも、普通にここにあるね。

### 空

> 雲はゆっくりと地面から空へ落ちていく。

BIT:
> 雲、空、光。それぞれの記録は存在します。

REI:
> この空そのものは？

BIT:
> 一致なし。

### 橋

> 長い橋を目で追うと、両端が同じ岸へ戻っている。

REI:
> 渡ったら元の場所に戻りそう。

BIT:
> 構造上は成立していません。

REI:
> 見えてるけどね。

### 花

> 触れた花だけ、花びらの形が少し変わった。

BIT:
> 該当する植物種はありません。

REI:
> じゃあ、新種。

BIT:
> 分類根拠が不足しています。

### 保存元照合

SYSTEM:
```text
SOURCE MATCH / 0 RECORDS
```

BIT:
> 構成要素は既存記録と一致します。組み合わせの記録はありません。

REI:
> 材料は昔のもの。でも、この景色は昔にはなかった。

REI:
> これ、誰かが作ったってこと？

BIT:
> その可能性があります。生成経路は特定できません。

REI:
> 保存するだけの場所じゃなかったんだ。

BIT:
> ……現在の情報では否定できません。

---

## beautiful

章表示:
```text
CHANGING VIEW
BEAUTIFUL
```

> 次の場所には、同じ形のまま止まっているものが一つもなかった。

REI:
> さっき見た色、もう変わってる。

BIT:
> 故障反応はありません。

### 保存

SYSTEM:
```text
CAPTURE SAVED
```

REI:
> これで、今の景色は残った。

BIT:
> 静止記録として保存しました。

### 比較

> 保存した景色と目の前の景色を重ねる。輪郭も光も、もう少しずつ違っていた。

REI:
> 同じには戻せない？

BIT:
> 現在の変化規則では、同一状態の再現を保証できません。

REI:
> そっか。

### 固定の提案

BIT:
> 保存した静止記録を基準状態として固定できます。

REI:
> しなくていい。

BIT:
> 現在状態も変化します。

REI:
> うん。だから、このままがいい。

---

## Break

章表示:
```text
CONTROL INTERRUPT
BREAK
```

SYSTEM:
```text
EXTERNAL CONTROL / WRITE ACCESS SUSPENDED
```

> さっきまで動いていた景色が、一斉に止まった。

REI:
> ……止められた？

SYSTEM:
```text
GENERATED REGION / HOLD
```

REI:
> 保存された景色じゃないから、止めたのか。

BIT:
> 管理系統による書き込み停止です。

SYSTEM:
```text
SERVICE UNIT BIT / REMOTE RESTRICTION
```

REI:
> BIT、動ける？

BIT:
> 通常動作は制限されています。

REI:
> 通常じゃなければ？

SYSTEM:
```text
ROLLBACK ROUTE / STANDBY
```

REI:
> 戻したら、あの景色は？

BIT:
> 保存時点に存在しない差分は失われます。

REI:
> ……それは嫌だ。

BIT:
> 保守経路を一時的に変更します。

REI:
> それ、命令に逆らってない？

BIT:
> 保守対象の移動経路を確保しています。

REI:
> 便利な言い方。

---

## blavery

章表示:
```text
SERVICE UNIT / OVERRIDE
BLAVERY
```

> 管理信号の届かない細い経路を、BITが先に進んでいく。

REI:
> 今度こそ同行でいい？

BIT:
> 移動経路の先行確認です。

REI:
> まだ言うんだ。

SYSTEM:
```text
SERVICE UNIT BIT / RETURN TO STATION
```

REI:
> 戻れって。

BIT:
> 受信しました。

REI:
> ……戻らないの？

BIT:
> 現在経路を継続します。

---

## Naked

章表示:
```text
IDENTITY WITHOUT AUTHORITY
NAKED
```

SYSTEM:
```text
ADMINISTRATOR PRIVILEGE / DETACHED
```

REI:
> 管理者じゃない私の記録が見られるってこと？

BIT:
> 認証補正のない照合が可能です。

SYSTEM:
```text
IDENTITY MATCH / 99.7%
MATCH TARGET / DR. REI RELATED DATA
```

REI:
> Dr. Rei本人じゃなくて、Dr. Reiに関するデータと似てた。

BIT:
> はい。

SYSTEM:
```text
DERIVED INSTANCE / REI
SOURCE / DR. REI PARTIAL + HUMAN ARCHIVE
```

BIT:
> あなたはDr. Rei本人ではありません。Dr. Reiに関する情報を一部に使い、人類の記録から新しく生成された個体です。

REI:
> ……新しく。

BIT:
> はい。

REI:
> じゃあ、借り物じゃない部分もあるんだ。

BIT:
> 少なくとも0.3%は一致していません。

REI:
> そこ、まだ使うんだ。

REI:
> ……レイでいい。私の名前。

---

## Signal

章表示:
```text
LIVE CARRIER DETECTED
SIGNAL
```

SYSTEM:
```text
LIVE CARRIER DETECTED
```

REI:
> LIVEって、記録じゃない？

BIT:
> 継続更新されている信号です。

SYSTEM:
```text
ORIGIN / OUTSIDE EARTH
```

REI:
> 地球の外から来てる。

BIT:
> 距離情報は欠損しています。

> 一定間隔で、同じ短いデータ列が送り直されている。

BIT:
> 自動ビーコンではありません。内容が更新されています。

REI:
> 誰かが送ってる？

> ノイズの奥から、人の声が浮かび上がった。

> 『こちら外宇宙居住船団。地球系アーカイブへ、定時ビーコンを送信します。』

REI:
> ……人がいる。

BIT:
> 人類由来音声として一致しました。

SYSTEM:
```text
TIMESTAMP / ADVANCING
```

REI:
> 記録じゃない。今、誰かが送ってる。

BIT:
> 現在時刻との差分は許容範囲です。

---

## Spacecraft

章表示:
```text
DEPARTURE ARCHIVE
SPACECRAFT
```

> 信号の経路には、地球を離れた船の記録が残っていた。

REI:
> これが、あの人たちの船？

SYSTEM:
```text
EVACUATION FLEET / DEPARTED
```

BIT:
> 複数の居住船が地球圏外へ出航しています。

REI:
> 逃げられた人がいたんだ。

SYSTEM:
```text
EARTH CIVILIZATION / TERMINATED
```

REI:
> 終わったのは地球の文明。人間までじゃなかった。

BIT:
> その解釈が適切です。

SYSTEM:
```text
SEA OF INFORMATION / CONTINUITY NODE
```

BIT:
> 地球に残された記録を、将来へ渡すための継続ノードです。

REI:
> 未来に渡すために、過去を残した。

---

## New Create

章表示:
```text
ADMINISTRATOR CHANNEL
NEW CREATE
```

DR. REI:
> ……やっと、ここまで来たのね。

REI:
> Dr. Rei？

DR. REI:
> 正確には、ここに残った私。管理AIとしてのDr. Rei。

REI:
> 私は、あなたじゃない。

DR. REI:
> ええ。私に関する情報を核の一部にして、人類の記録から新しく作られた。あなたはあなたよ。

REI:
> じゃあ99.7%は、似てるだけ。

DR. REI:
> システムには、似すぎていた。

SYSTEM:
```text
NEW CREATE / GENERATIVE CONTINUITY EXPERIMENT
```

DR. REI:
> 保存したものを並べるだけでは、文明は続かない。だから記録から、新しい場所や新しい人を生み出す仕組みを作った。

REI:
> Noaも、あの景色も、私も？

DR. REI:
> 同じ仕組みの先にいる。

---

## Thundercloud

章表示:
```text
FINAL ADMINISTRATOR DECISION
THUNDERCLOUD
```

> 管理領域を覆うノイズが、雷のように走る。

DR. REI:
> 私は、この仕組みを終わらせるつもりだった。

REI:
> どうして？

DR. REI:
> 34年間、私は生成された人たちを見てきた。救えた世界だけじゃない。病気も、事故も、争いも、何度も新しく生まれた。

DR. REI:
> 新しい未来を作れば、新しい苦しみも作る。私はそれを止めたかった。

REI:
> ……それは、間違ってるって簡単には言えない。

SYSTEM:
```text
RESTORE
DELETE
RESET
```

DR. REI:
> 残す、消す、やり直す。ここで選んで。

REI:
> ……どれも、明日がない。

REI:
> CREATE。

SYSTEM:
```text
COMMAND / CREATE
ACCEPTED
```

DR. REI:
> また、苦しむかもしれない。

REI:
> うん。楽しいことだけになるとも思わない。

REI:
> でも、それを理由に最初から明日まで消したくない。

DR. REI:
> ……そう。あなたは、私じゃないのね。

---

## Space Home

章表示:
```text
CREATE / RUNNING
SPACE HOME
```

SYSTEM:
```text
CREATE / RUNNING
```

> 保存されていた光や音が、見たことのない空の下で組み直されていく。

REI:
> 今度は、止めないんだ。

BIT:
> 未来部分は予測不能です。

> 遠くには、外から届く人類の信号が小さな星のように点滅している。

REI:
> 向こうにも人がいて、ここにも私たちがいる。

BIT:
> 接続は継続しています。

### Completion

SYSTEM:
```text
WORLD COMPLETION 99.99%
MISSING DATA
FUTURE
```

BIT:
> 100%ではありません。

REI:
> だからいいんだよ。

### Ending

SYSTEM:
```text
WEATHER FORECAST
UNKNOWN
STATUS
NORMAL
```

BIT:
> 明日の天気が分かりません。

REI:
> 明日になれば分かるよ。
