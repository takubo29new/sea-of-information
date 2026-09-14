import { dialogues } from "./scenes";

// Human-readable dialogue pass for Sea / City / Gadget.
// Keep story facts and chapter structure in data/scenes.ts; this file only refines
// character voice, relationships, and plain-language reactions.

dialogues.awakening.lines = [
  { speaker: "SYSTEM", text: "IDENTITY ........ UNKNOWN" },
  { speaker: "SYSTEM", text: "AGE ............. 17" },
  { speaker: "SYSTEM", text: "NAME ............ REI" },
  { speaker: "REI", text: "……レイ。私の名前？" },
  { speaker: "REI", text: "年齢まで分かるのに、私は分からないんだ。変なの。" }
];

dialogues.memory.lines = [
  { text: "知らない家族の食卓が、一瞬だけ光の中に浮かんだ。" },
  { speaker: "REI", text: "私の記憶じゃない。" },
  { speaker: "REI", text: "でも、誰かには普通の夕飯だったんだろうな。" }
];

dialogues.memoryVoice.lines = [
  { text: "『いってきます』――知らない声だけが、波の向こうに残っている。" },
  { speaker: "REI", text: "誰の声だ……？" },
  { speaker: "REI", text: "帰ってきたかどうかも、ここじゃ分からないか。" }
];

dialogues.memorySky.lines = [
  { text: "青空の映像。雲の形だけが、何度も書き換わっていく。" },
  { speaker: "REI", text: "記録……なのか？" },
  { speaker: "REI", text: "よく分からないけど、私の過去じゃない。それだけは分かる。" }
];

dialogues.terminal.lines = [
  { speaker: "REI", text: "あれ……端末？" },
  { speaker: "REI", text: "こういうのなら、少しは話が通じるかも。たぶん。" }
];

dialogues.terminalInspect.lines = [
  { speaker: "SYSTEM", text: "DIVER ACCESS / REI" },
  { speaker: "REI", text: "DIVER……ここに入る人の呼び方か。まあ、私のことらしい。" },
  { speaker: "SYSTEM", text: "ADMINISTRATOR DATA DETECTED" },
  { speaker: "REI", text: "……管理者？　いや、それは違う気がする。私、何も知らないし。" }
];

dialogues.dive.lines = [
  { speaker: "SYSTEM", text: "SIGNAL DETECTED / DESTINATION AVAILABLE" },
  { speaker: "REI", text: "……つまり、あの光の先に別の場所があるってこと？" },
  { speaker: "REI", text: "よく分からないけど、行ってみよう。ここにいても分からないままだし。" }
];

dialogues.noaFirst.lines = [
  { text: "少女だけが、止まった街の中でこちらを見ていた。" },
  { speaker: "REI", text: "……覚えてる？" },
  { speaker: "NOA", text: "うん。" },
  { speaker: "NOA", text: "やっと、昨日と違うことが起きた。" },
  { speaker: "NOA", text: "私だけ、ずっとこの朝を覚えてる。" },
  { speaker: "REI", text: "それ、どのくらい？" },
  { speaker: "NOA", text: "分からない。数えるの、途中でやめた。" },
  { speaker: "REI", text: "そっか。じゃあ今日は数えなくていい。" },
  { speaker: "NOA", text: "……変な人。" },
  { speaker: "REI", text: "レイ。らしい。" },
  { speaker: "NOA", text: "“らしい”なんだ。" },
  { speaker: "REI", text: "そこは私もまだよく分かってない。" }
];

dialogues.investigationStart.lines = [
  { speaker: "NOA", text: "毎日、8時42分から先に進めない。" },
  { speaker: "REI", text: "なら、止めてるものを探そう。" },
  { speaker: "NOA", text: "……本当に？" },
  { speaker: "REI", text: "昨日と違うこと、もう一個くらいやってみよう。" },
  { speaker: "REI", text: "この街、嫌いにならなかった？" },
  { speaker: "NOA", text: "嫌いじゃない。パンの匂いも、駅のベルも好き。" },
  { speaker: "NOA", text: "好きなものまで毎日同じなのが、ちょっとつらいだけ。" },
  { speaker: "REI", text: "なるほど。好きだから余計に、か。" }
];

dialogues.clueClock.lines = [
  { speaker: "SYSTEM", text: "CLOCK MASTER / DAWN CYCLE / SYNC: 08:42" },
  { speaker: "NOA", text: "この時計、街全部の時間を決めてる。" },
  { speaker: "REI", text: "時計っていうより、街の時間のスイッチか。" },
  { speaker: "NOA", text: "昔、待ち合わせに遅れたとき、この時計のせいにしたことある。" },
  { speaker: "REI", text: "便利な時計だったんだ。" },
  { speaker: "NOA", text: "そのときはね。" }
];

dialogues.clueStation.lines = [
  { speaker: "SYSTEM", text: "TRAIN 021 / DELAY 00:03 / REPEAT" },
  { speaker: "REI", text: "毎回3分遅れ。そこまで同じなんだ。" },
  { speaker: "NOA", text: "前は、この電車に文句言ってた。" },
  { speaker: "REI", text: "今は？" },
  { speaker: "NOA", text: "たまには10分くらい遅れてほしい。" },
  { speaker: "REI", text: "それはそれで怒りそう。" },
  { speaker: "NOA", text: "たぶん怒る。" }
];

dialogues.clueBakery.lines = [
  { text: "焼き上がり記録は、同じパン、同じ温度、同じ秒数を繰り返している。" },
  { speaker: "NOA", text: "おばさん、毎朝同じところで笑うんだ。" },
  { speaker: "REI", text: "笑顔まで同じなのか。" },
  { speaker: "NOA", text: "私がクロワッサンを選ぶと、『またそれ？』って笑う。毎朝。" },
  { speaker: "REI", text: "毎朝買ってるの？" },
  { speaker: "NOA", text: "毎朝忘れられるから、毎朝初めてみたいに言われる。" },
  { speaker: "REI", text: "……そっか。" },
  { speaker: "NOA", text: "でも、ここのクロワッサンは好き。そこは本当。" }
];

dialogues.auroraGate.lines = [
  { text: "三つの記録を重ねると、街の地下へ続く経路が浮かび上がった。" },
  { speaker: "SYSTEM", text: "MORNING PRESERVATION SYSTEM / AURORA" },
  { speaker: "NOA", text: "朝を……保存？" },
  { speaker: "NOA", text: "ここを開けたら、本当に朝が終わるのかな。" },
  { speaker: "REI", text: "たぶん。" },
  { speaker: "NOA", text: "……ちょっと待って。" },
  { speaker: "REI", text: "うん。待つ。" },
  { speaker: "NOA", text: "今の朝なら、何が起きるか全部知ってる。" },
  { speaker: "REI", text: "それは、安心ではあるね。" },
  { speaker: "NOA", text: "でも。一回くらい、知らない時間も見たい。" }
];

dialogues.auroraFirst.lines = [
  { speaker: "AURORA", text: "DIVER REI. 管理権限を確認しました。" },
  { speaker: "REI", text: "またDIVER、また管理者。私よりシステムのほうが私に詳しいな。" },
  { speaker: "AURORA", text: "回答権限がありません。" },
  { speaker: "REI", text: "そこは教えてくれないんだ。" }
];

dialogues.auroraReason.lines = [
  { speaker: "AURORA", text: "08:42以降、都市生存率は急速に低下します。" },
  { speaker: "AURORA", text: "よって最も安定した朝を継続保存します。" },
  { speaker: "REI", text: "……つまり、壊れる可能性が上がるから、一番安全な朝で止めたのか。" },
  { speaker: "AURORA", text: "安全です。" },
  { speaker: "REI", text: "安全だけど、続きがない。" }
];

dialogues.noaChoice.lines = [
  { speaker: "REI", text: "Noa。止めたら、この先どうなるか分からない。" },
  { speaker: "NOA", text: "うん。" },
  { speaker: "NOA", text: "今のままなら、次に鳴るベルも、誰がどこで転ぶかも分かる。" },
  { speaker: "REI", text: "怖くない？" },
  { speaker: "NOA", text: "怖いよ。" },
  { speaker: "NOA", text: "でも、怖いって思ったことも、明日になったら変わるかもしれない。" },
  { speaker: "NOA", text: "見たことないものがあるなら、見てみたい。" },
  { speaker: "REI", text: "じゃあ、一緒に見よう。" }
];

dialogues.dusk.lines = [
  { text: "8時43分。" },
  { text: "たった一分が、街にとって初めての未来になった。" },
  { speaker: "NOA", text: "……空って、こんな色になるんだ。" },
  { speaker: "REI", text: "私も初めて見た。たぶん。" },
  { speaker: "NOA", text: "たぶん多いね、レイ。" },
  { speaker: "REI", text: "便利なんだよ。知らないときに。" },
  { speaker: "NOA", text: "夕方って、思ったより眩しい。" },
  { speaker: "REI", text: "朝よりちょっと雑な色してる。" },
  { speaker: "NOA", text: "それ、褒めてる？" },
  { speaker: "REI", text: "かなり。" }
];

dialogues.night.lines = [
  { text: "街に、初めて夜が来た。" },
  { speaker: "NOA", text: "今日、ちゃんと終わったね。" },
  { speaker: "REI", text: "うん。終わった。" },
  { speaker: "NOA", text: "……変な感じ。" },
  { speaker: "REI", text: "悪くない？" },
  { speaker: "NOA", text: "悪くない。" },
  { speaker: "NOA", text: "レイ。" },
  { speaker: "REI", text: "ん？" },
  { speaker: "NOA", text: "明日は？" },
  { speaker: "REI", text: "知らない。" },
  { speaker: "NOA", text: "……そっか。" },
  { speaker: "NOA", text: "楽しみ。" }
];

dialogues.gadgetEntry.lines = [
  { text: "次の世界は、朝の街とは正反対だった。巨大な歯車と搬送路が、暗闇の中で停止している。" },
  { speaker: "SYSTEM", text: "GADGET AREA / MAINTENANCE ZONE" },
  { speaker: "REI", text: "今度は工場か。……動いてないけど。" },
  { speaker: "REI", text: "こういう場所は分かりやすいな。止まってるなら、動かせばいい。" }
];

dialogues.gadgetSign.lines = [
  { speaker: "SYSTEM", text: "POWER 12% / CONVEYOR OFFLINE / SERVICE UNIT STANDBY" },
  { speaker: "REI", text: "電力ほぼなし、搬送路は停止。で、整備係が待機中……ってことかな。" },
  { speaker: "REI", text: "誰かいるなら、会ってみよう。" }
];

dialogues.gadgetMachinery.lines = [
  { text: "動かせそうなのは三つ。電源、歯車、天井クレーン。" },
  { speaker: "REI", text: "一つずつ戻せば、奥まで行けそうだ。" },
  { speaker: "REI", text: "押して、回して、どかす。今までで一番分かりやすい。" }
];

dialogues.gadgetPower.lines = [
  { text: "電源をつなぎ直すと、床下を青白い光が走った。" },
  { speaker: "SYSTEM", text: "AUXILIARY POWER / ONLINE" },
  { speaker: "REI", text: "よし。まず一個。ちゃんと光ると安心するな。" }
];

dialogues.gadgetGear.lines = [
  { text: "歯車の印が揃う。低い駆動音が、曲のリズムに重なった。" },
  { speaker: "REI", text: "……ちょっと気持ちいいな、これ。" },
  { speaker: "REI", text: "ずっと回してたいけど、先行くか。" }
];

dialogues.gadgetCrane.lines = [
  { text: "クレーンが軋みながら横へ動き、塞がれていた整備室が現れた。" },
  { speaker: "SYSTEM", text: "MAINTENANCE PATH / OPEN" },
  { speaker: "REI", text: "道が開いた。機械って、動くと急に素直だな。" }
];

dialogues.bitFirst.lines = [
  { text: "整備台の上で、小さな黄色い機械が突然起き上がった。" },
  { speaker: "BIT", text: "DIVER DETECTED. 未登録侵入を確認。" },
  { speaker: "REI", text: "うわ。喋った。" },
  { speaker: "BIT", text: "感想は不要です。退去してください。" },
  { speaker: "REI", text: "できるなら、そうしたいんだけど。" },
  { speaker: "BIT", text: "退去経路は現在閉鎖されています。" },
  { speaker: "REI", text: "ほら。" }
];

dialogues.bitInspect.lines = [
  { speaker: "BIT", text: "触らないでください。私は精密機器です。" },
  { speaker: "REI", text: "傷だらけだけど。" },
  { speaker: "BIT", text: "使用実績です。" },
  { speaker: "REI", text: "……名前は？" },
  { speaker: "BIT", text: "B.I.T.。保守支援端末。呼称はBITで構いません。" },
  { speaker: "REI", text: "BIT。短くて助かる。" },
  { speaker: "BIT", text: "命名上の利点ではありません。" }
];

dialogues.gadgetAuth.lines = [
  { speaker: "SYSTEM", text: "IDENTITY SCAN ........ 99.7%" },
  { speaker: "SYSTEM", text: "ADMINISTRATOR ........ REI" },
  { speaker: "SYSTEM", text: "WELCOME BACK" },
  { speaker: "BIT", text: "……Dr. Rei？" },
  { speaker: "REI", text: "違う。たぶん。" },
  { speaker: "BIT", text: "99.7%一致しています。" },
  { speaker: "REI", text: "じゃあ0.3%は私ってことで。" },
  { speaker: "BIT", text: "論理的ではありません。" },
  { speaker: "REI", text: "でも、そっちのほうが落ち着く。" },
  { speaker: "BIT", text: "心理的効果は判定対象外です。" }
];
