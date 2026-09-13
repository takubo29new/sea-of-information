import type { Dialogue, Scene, SceneId } from "../engine/model";

export const scenes: Record<SceneId, Scene> = {
  title: { id: "title", chapter: "system", art: "title" },
  "sea-awakening": {
    id: "sea-awakening", chapter: "prologue", title: "SEA OF INFORMATION", subtitle: "PROLOGUE", art: "sea", track: "sea-of-information", enterDialogueId: "awakening",
    hotspots: [
      { id: "memory-light", label: "漂う記憶に触れる", x: 66, y: 40, width: 9, height: 14, action: { type: "dialogue", dialogueId: "memory" } },
      { id: "memory-voice", label: "声の断片に触れる", x: 24, y: 31, width: 8, height: 12, action: { type: "dialogue", dialogueId: "memoryVoice" } },
      { id: "memory-sky", label: "空の記憶に触れる", x: 79, y: 63, width: 8, height: 12, action: { type: "dialogue", dialogueId: "memorySky" } },
      { id: "terminal-light", label: "遠くの光へ進む", x: 45, y: 50, width: 12, height: 28, action: { type: "advance", to: "sea-terminal" }, requiresTrackTime: 40, lockedLabel: "情報の流れを観察する" }
    ]
  },
  "sea-terminal": {
    id: "sea-terminal", chapter: "prologue", art: "terminal", track: "sea-of-information", enterDialogueId: "terminal",
    hotspots: [
      { id: "terminal", label: "端末を調べる", x: 42, y: 40, width: 16, height: 24, action: { type: "dialogue", dialogueId: "terminalInspect" } },
      { id: "terminal-echo", label: "端末の周囲を調べる", x: 68, y: 52, width: 10, height: 16, action: { type: "dialogue", dialogueId: "terminalEcho" } }
    ]
  },
  "sea-dive": {
    id: "sea-dive", chapter: "prologue", art: "dive", track: "sea-of-information", enterDialogueId: "dive",
    hotspots: [{ id: "dive-gate", label: "DIVE", x: 39, y: 30, width: 22, height: 38, action: { type: "setFlagAndAdvance", flag: "prologue.firstDive", to: "city-loop-1" }, requiresTrackTime: 115, lockedLabel: "届いている信号に耳を澄ます" }]
  },
  "city-loop-1": {
    id: "city-loop-1", chapter: "city-of-dawn", title: "CITY OF DAWN", subtitle: "08:42 / OBSERVE", art: "city", track: "city-of-dawn", trackRestart: true, onEnterFlags: ["city.loop1Seen"], enterDialogueId: "cityFirst",
    hotspots: [
      { id: "clock", label: "時計塔を記録する", x: 72, y: 17, width: 8, height: 15, action: { type: "setFlagAndDialogue", flag: "city.observeClock", dialogueId: "clock" } },
      { id: "child", label: "少年の動きを記録する", x: 31, y: 60, width: 8, height: 16, action: { type: "setFlagAndDialogue", flag: "city.observeChild", dialogueId: "childFirst" } },
      { id: "birds", label: "鳥の群れを記録する", x: 48, y: 22, width: 10, height: 10, action: { type: "setFlagAndDialogue", flag: "city.observeBirds", dialogueId: "birdsFirst" } },
      { id: "bakery", label: "パン屋を記録する", x: 84, y: 52, width: 10, height: 18, action: { type: "setFlagAndDialogue", flag: "city.observeBakery", dialogueId: "bakeryFirst" } },
      { id: "station", label: "駅へ進む", x: 7, y: 44, width: 18, height: 28, action: { type: "advance", to: "city-loop-2" }, visibleWhenAll: ["city.observeClock", "city.observeChild", "city.observeBirds", "city.observeBakery"], requiresTrackTime: 75, lockedLabel: "記録した朝の続きを聴く" }
    ]
  },
  "city-loop-2": {
    id: "city-loop-2", chapter: "city-of-dawn", title: "CITY OF DAWN", subtitle: "08:42 / COMPARE", art: "city", track: "city-of-dawn", onEnterFlags: ["city.loop2Seen"], enterDialogueId: "citySecond",
    hotspots: [
      { id: "clock2", label: "時計塔を照合する", x: 72, y: 17, width: 8, height: 15, action: { type: "setFlagAndDialogue", flag: "city.matchClock", dialogueId: "clockAgain" } },
      { id: "birds2", label: "鳥の群れを照合する", x: 48, y: 22, width: 10, height: 10, action: { type: "setFlagAndDialogue", flag: "city.matchBirds", dialogueId: "birdsAgain" } },
      { id: "bakery2", label: "パン屋を照合する", x: 84, y: 52, width: 10, height: 18, action: { type: "setFlagAndDialogue", flag: "city.matchBakery", dialogueId: "bakeryAgain" } },
      { id: "child2", label: "結果を変える：少年に声をかける", x: 31, y: 60, width: 8, height: 16, action: { type: "setFlagAndAdvance", flag: "city.childSaved", to: "city-intervention" }, visibleWhenAll: ["city.matchClock", "city.matchBirds", "city.matchBakery"], requiresTrackTime: 155, lockedLabel: "同じ朝を最後まで確かめる" }
    ]
  },
  "city-intervention": {
    id: "city-intervention", chapter: "city-of-dawn", art: "city-glitch", track: "city-of-dawn", onEnterFlags: ["city.loopBroken"], enterDialogueId: "intervention",
    hotspots: [{ id: "noa", label: "こちらを見ている少女", x: 72, y: 48, width: 10, height: 30, action: { type: "advance", to: "city-noa" }, requiresTrackTime: 185, lockedLabel: "止まった街の音を聴く" }]
  },
  "city-noa": {
    id: "city-noa", chapter: "city-of-dawn", art: "noa", track: "city-of-dawn", onEnterFlags: ["city.noaMet"], enterDialogueId: "noaFirst",
    hotspots: [{ id: "investigate", label: "Noaと街を調べる", x: 43, y: 64, width: 16, height: 20, action: { type: "advance", to: "city-investigation" }, requiresTrackTime: 235, lockedLabel: "Noaの話を聞きながら朝を見る" }]
  },
  "city-investigation": {
    id: "city-investigation", chapter: "city-of-dawn", art: "city-investigation", track: "city-of-dawn", enterDialogueId: "investigationStart",
    hotspots: [
      { id: "investigate-clock", label: "時計塔の保守盤", x: 69, y: 25, width: 11, height: 18, action: { type: "setFlagAndDialogue", flag: "city.clueClock", dialogueId: "clueClock" } },
      { id: "investigate-station", label: "駅の運行ログ", x: 8, y: 45, width: 18, height: 24, action: { type: "setFlagAndDialogue", flag: "city.clueStation", dialogueId: "clueStation" } },
      { id: "investigate-bakery", label: "パン屋の記録", x: 82, y: 51, width: 12, height: 20, action: { type: "setFlagAndDialogue", flag: "city.clueBakery", dialogueId: "clueBakery" } },
      { id: "aurora-path", label: "地下制御区画へ", x: 43, y: 66, width: 16, height: 18, action: { type: "advance", to: "city-aurora-gate" }, visibleWhenAll: ["city.clueClock", "city.clueStation", "city.clueBakery"], requiresTrackTime: 320, lockedLabel: "朝の記録を最後まで照合する" }
    ]
  },
  "city-aurora-gate": {
    id: "city-aurora-gate", chapter: "city-of-dawn", art: "aurora-gate", track: "city-of-dawn", onEnterFlags: ["city.auroraFound"], enterDialogueId: "auroraGate",
    hotspots: [{ id: "aurora-door", label: "AURORAへ接続", x: 38, y: 28, width: 24, height: 42, action: { type: "advance", to: "city-aurora" } }]
  },
  "city-aurora": {
    id: "city-aurora", chapter: "city-of-dawn", art: "aurora", track: "city-of-dawn", enterDialogueId: "auroraFirst",
    hotspots: [
      { id: "aurora-record", label: "保存理由を確認する", x: 22, y: 48, width: 16, height: 20, action: { type: "setFlagAndDialogue", flag: "city.auroraReasonKnown", dialogueId: "auroraReason" } },
      { id: "aurora-noa", label: "Noaを見る", x: 69, y: 50, width: 12, height: 26, action: { type: "setFlagAndDialogue", flag: "city.noaChoiceHeard", dialogueId: "noaChoice" } },
      { id: "aurora-stop", label: "朝の保存を終了する", x: 42, y: 64, width: 18, height: 18, action: { type: "setFlagAndAdvance", flag: "city.auroraStopped", to: "city-dusk" }, visibleWhenAll: ["city.auroraReasonKnown", "city.noaChoiceHeard"] }
    ]
  },
  "city-dusk": {
    id: "city-dusk", chapter: "city-of-dawn", art: "dusk", track: "city-of-dawn", enterDialogueId: "dusk",
    hotspots: [{ id: "first-sunset", label: "沈む太陽を見る", x: 52, y: 28, width: 24, height: 30, action: { type: "advance", to: "city-night" } }]
  },
  "city-night": {
    id: "city-night", chapter: "city-of-dawn", art: "night", track: "city-of-dawn", onEnterFlags: ["city.completed"], enterDialogueId: "night",
    hotspots: [{ id: "night-end", label: "街を離れる", x: 42, y: 65, width: 16, height: 18, action: { type: "advance", to: "load-road-1" } }]
  },
  "load-road-1": {
    id: "load-road-1", chapter: "transit", title: "LOAD ROAD", subtitle: "BETWEEN ARCHIVES", art: "load-road", track: "load-road", trackRestart: true, enterDialogueId: "loadRoadFirst",
    hotspots: [
      { id: "load-road-view", label: "流れる記憶を見る", x: 18, y: 34, width: 18, height: 24, action: { type: "dialogue", dialogueId: "loadRoadView" } },
      { id: "load-road-next", label: "次の信号へ", x: 70, y: 38, width: 16, height: 26, action: { type: "advance", to: "gadget-entry" }, requiresTrackTime: 125, lockedLabel: "移動の音に身を預ける" }
    ]
  },
  "gadget-entry": {
    id: "gadget-entry", chapter: "gadget-area", title: "GADGET AREA", subtitle: "AREA 02", art: "gadget-entry", track: "gadget-area", trackRestart: true, onEnterFlags: ["gadget.entered"], enterDialogueId: "gadgetEntry",
    hotspots: [
      { id: "gadget-sign", label: "停止した案内板", x: 16, y: 34, width: 14, height: 20, action: { type: "dialogue", dialogueId: "gadgetSign" } },
      { id: "gadget-machinery-path", label: "機械区画へ進む", x: 66, y: 44, width: 18, height: 25, action: { type: "advance", to: "gadget-machinery" }, requiresTrackTime: 42, lockedLabel: "工場のリズムを観察する" }
    ]
  },
  "gadget-machinery": {
    id: "gadget-machinery", chapter: "gadget-area", art: "gadget-machinery", track: "gadget-area", enterDialogueId: "gadgetMachinery",
    hotspots: [
      { id: "gadget-power", label: "電源をつなぎ直す", x: 12, y: 52, width: 15, height: 22, action: { type: "setFlagAndDialogue", flag: "gadget.powerRestored", dialogueId: "gadgetPower" } },
      { id: "gadget-gear", label: "歯車の印を合わせる", x: 40, y: 28, width: 18, height: 27, action: { type: "setFlagAndDialogue", flag: "gadget.gearAligned", dialogueId: "gadgetGear" } },
      { id: "gadget-crane", label: "クレーンをどかす", x: 72, y: 31, width: 16, height: 27, action: { type: "setFlagAndDialogue", flag: "gadget.craneMoved", dialogueId: "gadgetCrane" } },
      { id: "gadget-open", label: "奥の整備室へ", x: 42, y: 66, width: 17, height: 18, action: { type: "advance", to: "gadget-bit" }, visibleWhenAll: ["gadget.powerRestored", "gadget.gearAligned", "gadget.craneMoved"], requiresTrackTime: 92, lockedLabel: "復旧した機械の音を確認する" }
    ]
  },
  "gadget-bit": {
    id: "gadget-bit", chapter: "gadget-area", art: "gadget-bit", track: "gadget-area", onEnterFlags: ["gadget.bitActivated"], enterDialogueId: "bitFirst",
    hotspots: [
      { id: "bit-inspect", label: "BITを調べる", x: 58, y: 53, width: 14, height: 22, action: { type: "setFlagAndDialogue", flag: "gadget.bitInspected", dialogueId: "bitInspect" } },
      { id: "bit-terminal", label: "中央管理端末へ", x: 25, y: 30, width: 18, height: 30, action: { type: "advance", to: "gadget-auth" }, visibleWhenAll: ["gadget.bitInspected"], requiresTrackTime: 145, lockedLabel: "BITの起動音を聞く" }
    ]
  },
  "gadget-auth": {
    id: "gadget-auth", chapter: "gadget-area", art: "gadget-auth", track: "gadget-area", onEnterFlags: ["gadget.reiAdminDetected"], enterDialogueId: "gadgetAuth",
    hotspots: [
      { id: "gadget-auth-end", label: "BITと先へ進む", x: 40, y: 66, width: 20, height: 18, action: { type: "setFlagAndAdvance", flag: "gadget.bitJoined", to: "load-road-2" }, requiresTrackTime: 178, lockedLabel: "認証ログを最後まで確認する" }
    ]
  },
  "load-road-2": {
    id: "load-road-2", chapter: "transit", title: "LOAD ROAD", subtitle: "BETWEEN ARCHIVES / 02", art: "load-road", track: "load-road", trackRestart: true, enterDialogueId: "loadRoadSecond",
    hotspots: [
      { id: "load-road-bit", label: "BITに声をかける", x: 18, y: 40, width: 18, height: 22, action: { type: "dialogue", dialogueId: "loadRoadBit" } },
      { id: "load-road-wish", label: "次の保存領域へ", x: 70, y: 38, width: 16, height: 26, action: { type: "advance", to: "wish-entry" }, requiresTrackTime: 125, lockedLabel: "二人で移動の音を聞く" }
    ]
  },
  "wish-entry": {
    id: "wish-entry", chapter: "wish", title: "WISH", subtitle: "PERSONAL MESSAGES", art: "wish", track: "wish", trackRestart: true, onEnterFlags: ["story.wishReached"], enterDialogueId: "wishEntry",
    hotspots: [
      { id: "wish-message-1", label: "メッセージ 01", x: 18, y: 32, width: 16, height: 18, action: { type: "setFlagAndDialogue", flag: "wish.message1", dialogueId: "wishMessage1" } },
      { id: "wish-message-2", label: "メッセージ 02", x: 42, y: 48, width: 16, height: 18, action: { type: "setFlagAndDialogue", flag: "wish.message2", dialogueId: "wishMessage2" } },
      { id: "wish-message-3", label: "メッセージ 03", x: 68, y: 30, width: 16, height: 18, action: { type: "setFlagAndDialogue", flag: "wish.message3", dialogueId: "wishMessage3" } },
      { id: "wish-outcomes", label: "結果記録を確認する", x: 39, y: 68, width: 22, height: 16, action: { type: "setFlagAndDialogue", flag: "wish.outcomesChecked", dialogueId: "wishOutcome" }, visibleWhenAll: ["wish.message1", "wish.message2", "wish.message3"], requiresTrackTime: 126, lockedLabel: "三つのメッセージを聞く" },
      { id: "wish-broken", label: "壊れたメッセージを見る", x: 10, y: 62, width: 18, height: 16, action: { type: "setFlagAndDialogue", flag: "wish.brokenFound", dialogueId: "wishBroken" }, visibleWhenAll: ["wish.message1", "wish.message2", "wish.message3", "wish.outcomesChecked"], requiresTrackTime: 194, lockedLabel: "残された声をもう少し聞く" },
      { id: "wish-bit-repair", label: "BITを見る", x: 72, y: 62, width: 14, height: 18, action: { type: "setFlagAndDialogue", flag: "wish.bitRepaired", dialogueId: "wishBitRepair" }, visibleWhenAll: ["wish.brokenFound"], requiresTrackTime: 227, lockedLabel: "BITの判断を待つ" },
      { id: "wish-next", label: "次の領域へ", x: 40, y: 22, width: 20, height: 16, action: { type: "advance", to: "vertical-slice-end" }, visibleWhenAll: ["wish.bitRepaired"], requiresTrackTime: 302, lockedLabel: "曲の余韻を聴く" }
    ]
  },
  "vertical-slice-end": { id: "vertical-slice-end", chapter: "system", title: "FANTASY", subtitle: "SOURCE RECORD / NOT FOUND", art: "wish", track: "wish", onEnterFlags: ["story.wishCompleted"], enterDialogueId: "fantasyEntry" }
};

export const dialogues: Record<string, Dialogue> = {
  awakening: { id: "awakening", lines: [
    { speaker: "SYSTEM", text: "IDENTITY ........ UNKNOWN" }, { speaker: "SYSTEM", text: "AGE ............. 17" }, { speaker: "SYSTEM", text: "NAME ............ REI" }, { speaker: "REI", text: "……レイ。私の名前？" }
  ] },
  memory: { id: "memory", lines: [{ text: "知らない家族の食卓が、一瞬だけ光の中に浮かんだ。" }, { speaker: "REI", text: "私の記憶じゃない。" }] },
  memoryVoice: { id: "memoryVoice", lines: [{ text: "『いってきます』――知らない声だけが、波の向こうに残っている。" }, { speaker: "REI", text: "誰の声だ……？" }] },
  memorySky: { id: "memorySky", lines: [{ text: "青空の映像。雲の形だけが、何度も書き換わっていく。" }, { speaker: "REI", text: "記録……なのか？" }] },
  terminal: { id: "terminal", lines: [{ speaker: "REI", text: "あれ……端末？" }] },
  terminalEcho: { id: "terminalEcho", lines: [{ text: "端末の足元には、読めない日付のログが無数に積み重なっている。" }, { speaker: "REI", text: "ずっと動いてたのか。ここ。" }] },
  terminalInspect: { id: "terminalInspect", lines: [
    { speaker: "SYSTEM", text: "DIVER ACCESS / REI" }, { speaker: "REI", text: "DIVER……ここに入る人の呼び方か。" }, { speaker: "SYSTEM", text: "ADMINISTRATOR DATA DETECTED" }, { speaker: "REI", text: "……管理者？　それは違う気がする。" }
  ], after: { type: "advance", to: "sea-dive" } },
  dive: { id: "dive", lines: [{ speaker: "SYSTEM", text: "SIGNAL DETECTED / DESTINATION AVAILABLE" }, { speaker: "REI", text: "あの光の先に、別の場所がある。……行ってみよう。" }] },
  cityFirst: { id: "cityFirst", lines: [
    { text: "朝日。駅のベル。パンの匂い。街は、何事もなかったように動いている。" },
    { speaker: "REI", text: "まずは、この朝を覚えておこう。気になるものを全部。" }
  ] },
  clock: { id: "clock", lines: [{ speaker: "SYSTEM", text: "OBSERVE / CLOCK / 08:42" }, { speaker: "REI", text: "8時42分。記録した。" }] },
  childFirst: { id: "childFirst", lines: [{ text: "少年が石につまずき、膝をついた。" }, { speaker: "SYSTEM", text: "OBSERVE / CHILD / FALL" }] },
  birdsFirst: { id: "birdsFirst", lines: [{ text: "三羽。まるで合図を待っていたように、同時に飛び立った。" }, { speaker: "SYSTEM", text: "OBSERVE / BIRDS / 3" }] },
  bakeryFirst: { id: "bakeryFirst", lines: [{ text: "パン屋の店員が、焼き上がりの札を『8:42』に合わせる。" }, { speaker: "SYSTEM", text: "OBSERVE / BAKERY / 08:42" }] },
  citySecond: { id: "citySecond", lines: [
    { speaker: "REI", text: "……また8時42分？" },
    { text: "同じ朝なら、さっき記録したものまで同じはずだ。" },
    { speaker: "REI", text: "照合してみよう。" }
  ] },
  clockAgain: { id: "clockAgain", lines: [{ speaker: "SYSTEM", text: "MATCH / CLOCK / 08:42" }, { speaker: "REI", text: "同じ時刻。秒まで同じ。" }] },
  birdsAgain: { id: "birdsAgain", lines: [{ speaker: "SYSTEM", text: "MATCH / BIRDS / 3" }, { speaker: "REI", text: "三羽。同じ順番で飛んだ。" }] },
  bakeryAgain: { id: "bakeryAgain", lines: [{ speaker: "SYSTEM", text: "MATCH / BAKERY / 08:42" }, { speaker: "REI", text: "札を出す手の動きまで同じ。これで偶然じゃない。" }] },
  intervention: { id: "intervention", lines: [{ text: "少年が石につまずく、その一歩前。" }, { speaker: "REI", text: "危ない！" }, { text: "少年は転ばなかった。" }, { text: "次の瞬間、街の音が一拍だけ欠けた。" }, { speaker: "REI", text: "……変わった。" }] },
  noaFirst: { id: "noaFirst", lines: [
    { text: "少女だけが、止まった街の中でこちらを見ていた。" }, { speaker: "REI", text: "……覚えてる？" }, { speaker: "NOA", text: "うん。" }, { speaker: "NOA", text: "やっと、昨日と違うことが起きた。" },
    { speaker: "NOA", text: "私だけ、ずっとこの朝を覚えてる。" }
  ] },
  investigationStart: { id: "investigationStart", lines: [
    { speaker: "NOA", text: "毎日、8時42分から先に進めない。" }, { speaker: "REI", text: "なら、止めてるものを探そう。" }, { speaker: "NOA", text: "……本当に？" }, { speaker: "REI", text: "昨日と違うこと、もう一個くらいやってみよう。" }
  ] },
  clueClock: { id: "clueClock", lines: [
    { speaker: "SYSTEM", text: "CLOCK MASTER / DAWN CYCLE / SYNC: 08:42" }, { speaker: "NOA", text: "この時計、街全部の時間を決めてる。" }, { speaker: "REI", text: "時計じゃない。スイッチだ。" }
  ] },
  clueStation: { id: "clueStation", lines: [
    { speaker: "SYSTEM", text: "TRAIN 021 / DELAY 00:03 / REPEAT" }, { speaker: "REI", text: "遅延まで保存されてる。" }, { speaker: "NOA", text: "失敗も……？" }
  ] },
  clueBakery: { id: "clueBakery", lines: [
    { text: "焼き上がり記録は、同じパン、同じ温度、同じ秒数を繰り返している。" }, { speaker: "NOA", text: "おばさん、毎朝同じところで笑うんだ。" }, { speaker: "REI", text: "笑顔まで保存されてるのか。" }
  ] },
  auroraGate: { id: "auroraGate", lines: [
    { text: "三つの記録を重ねると、街の地下へ続く経路が浮かび上がった。" }, { speaker: "SYSTEM", text: "MORNING PRESERVATION SYSTEM / AURORA" }, { speaker: "NOA", text: "朝を……保存？" }
  ] },
  auroraFirst: { id: "auroraFirst", lines: [
    { speaker: "AURORA", text: "DIVER REI. 管理権限を確認しました。" }, { speaker: "REI", text: "まただ。なんで私が管理者なんだ。" }, { speaker: "AURORA", text: "回答権限がありません。" }
  ] },
  auroraReason: { id: "auroraReason", lines: [
    { speaker: "AURORA", text: "08:42以降、都市生存率は急速に低下します。" }, { speaker: "AURORA", text: "よって最も安定した朝を継続保存します。" }, { speaker: "REI", text: "壊れるのが怖くて、時間ごと止めたのか。" }, { speaker: "AURORA", text: "安全です。" }
  ] },
  noaChoice: { id: "noaChoice", lines: [
    { speaker: "REI", text: "Noa。止めたら、この先どうなるか分からない。" }, { speaker: "NOA", text: "うん。" }, { speaker: "REI", text: "怖くない？" }, { speaker: "NOA", text: "怖いよ。" }, { speaker: "NOA", text: "でも、怖いって思ったことも、明日になったら変わるかもしれない。" }
  ] },
  dusk: { id: "dusk", lines: [
    { text: "8時43分。" }, { text: "たった一分が、街にとって初めての未来になった。" }, { speaker: "NOA", text: "……空って、こんな色になるんだ。" }, { speaker: "REI", text: "私も初めて見た。たぶん。" }
  ] },
  night: { id: "night", lines: [
    { text: "街に、初めて夜が来た。" }, { speaker: "NOA", text: "レイ。" }, { speaker: "REI", text: "ん？" }, { speaker: "NOA", text: "明日は？" }, { speaker: "REI", text: "知らない。" }, { speaker: "NOA", text: "……そっか。" }, { speaker: "NOA", text: "楽しみ。" }
  ] },
  loadRoadFirst: { id: "loadRoadFirst", lines: [
    { text: "街の夜が遠ざかる。情報の海に、細い道だけが伸びていた。" },
    { speaker: "REI", text: "知らない場所に行くって、こういう感じなのかな。" }
  ] },
  loadRoadView: { id: "loadRoadView", lines: [
    { text: "道の外側を、名前のない記憶が流れていく。誰かの駅、誰かの食卓、誰かの帰り道。" },
    { speaker: "REI", text: "全部、誰かには大事だったんだろうな。" }
  ] },
  gadgetEntry: { id: "gadgetEntry", lines: [
    { text: "次の世界は、朝の街とは正反対だった。巨大な歯車と搬送路が、暗闇の中で停止している。" },
    { speaker: "SYSTEM", text: "GADGET AREA / MAINTENANCE ZONE" },
    { speaker: "REI", text: "今度は工場か。……動いてないけど。" }
  ] },
  gadgetSign: { id: "gadgetSign", lines: [
    { speaker: "SYSTEM", text: "POWER 12% / CONVEYOR OFFLINE / SERVICE UNIT STANDBY" },
    { speaker: "REI", text: "サービスユニット……誰かいるのか？" }
  ] },
  gadgetMachinery: { id: "gadgetMachinery", lines: [
    { text: "動かせそうなのは三つ。電源、歯車、天井クレーン。" },
    { speaker: "REI", text: "一つずつ戻せば、奥まで行けそうだ。" }
  ] },
  gadgetPower: { id: "gadgetPower", lines: [
    { text: "電源をつなぎ直すと、床下を青白い光が走った。" },
    { speaker: "SYSTEM", text: "AUXILIARY POWER / ONLINE" }
  ] },
  gadgetGear: { id: "gadgetGear", lines: [
    { text: "歯車の印が揃う。低い駆動音が、曲のリズムに重なった。" },
    { speaker: "REI", text: "……ちょっと気持ちいいな、これ。" }
  ] },
  gadgetCrane: { id: "gadgetCrane", lines: [
    { text: "クレーンが軋みながら横へ動き、塞がれていた整備室が現れた。" },
    { speaker: "SYSTEM", text: "MAINTENANCE PATH / OPEN" }
  ] },
  bitFirst: { id: "bitFirst", lines: [
    { text: "整備台の上で、小さな黄色い機械が突然起き上がった。" },
    { speaker: "BIT", text: "DIVER DETECTED. 未登録侵入を確認。" },
    { speaker: "REI", text: "うわ。喋った。" },
    { speaker: "BIT", text: "感想は不要です。退去してください。" },
    { speaker: "REI", text: "できるなら、そうしたいんだけど。" }
  ] },
  bitInspect: { id: "bitInspect", lines: [
    { speaker: "BIT", text: "触らないでください。私は精密機器です。" },
    { speaker: "REI", text: "傷だらけだけど。" },
    { speaker: "BIT", text: "使用実績です。" },
    { speaker: "REI", text: "……名前は？" },
    { speaker: "BIT", text: "B.I.T.。保守支援端末。呼称はBITで構いません。" }
  ] },
  gadgetAuth: { id: "gadgetAuth", lines: [
    { speaker: "SYSTEM", text: "IDENTITY SCAN ........ 99.7%" },
    { speaker: "SYSTEM", text: "ADMINISTRATOR ........ REI" },
    { speaker: "SYSTEM", text: "WELCOME BACK" },
    { speaker: "BIT", text: "……Dr. Rei？" },
    { speaker: "REI", text: "違う。たぶん。" },
    { speaker: "BIT", text: "99.7%一致しています。" },
    { speaker: "REI", text: "じゃあ0.3%は私ってことで。" },
    { speaker: "BIT", text: "論理的ではありません。" }
  ] },
  loadRoadSecond: { id: "loadRoadSecond", lines: [
    { text: "工場の音が遠ざかる。LOAD ROADには、今度はもう一つ小さな足音が続いていた。" },
    { speaker: "REI", text: "……ついてくるんだ。" },
    { speaker: "BIT", text: "保守対象の監視です。同行ではありません。" },
    { speaker: "REI", text: "はいはい。" }
  ] },
  loadRoadBit: { id: "loadRoadBit", lines: [
    { speaker: "REI", text: "目的地、分かる？" },
    { speaker: "BIT", text: "不明です。" },
    { speaker: "REI", text: "じゃあ同じだ。" },
    { speaker: "BIT", text: "私は地図情報を欠損しています。あなたとは理由が異なります。" },
    { speaker: "REI", text: "そこは同じでいいでしょ。" }
  ] },
  wishEntry: { id: "wishEntry", lines: [
    { speaker: "SYSTEM", text: "PERSONAL MESSAGES / 4 RECORDS" },
    { speaker: "REI", text: "メッセージ？" },
    { speaker: "BIT", text: "音声・文書記録です。" },
    { speaker: "REI", text: "じゃあ、聞いてみよう。" }
  ] },
  wishMessage1: { id: "wishMessage1", lines: [
    { speaker: "SYSTEM", text: "MESSAGE 01" },
    { text: "『18歳の私へ。まだ絵、描いてますか。』" },
    { speaker: "REI", text: "未来の自分宛てか。" }
  ] },
  wishMessage2: { id: "wishMessage2", lines: [
    { speaker: "SYSTEM", text: "MESSAGE 02" },
    { text: "『退院したら、駅前のラーメン。絶対。』" },
    { speaker: "REI", text: "……こういうの、いいな。" }
  ] },
  wishMessage3: { id: "wishMessage3", lines: [
    { speaker: "SYSTEM", text: "MESSAGE 03" },
    { text: "『次の休み、海を見に行こう。今度こそ。』" },
    { speaker: "BIT", text: "実行結果は付属していません。" },
    { speaker: "REI", text: "まだ聞かなくていいよ、それ。" }
  ] },
  wishOutcome: { id: "wishOutcome", lines: [
    { speaker: "SYSTEM", text: "OUTCOME RECORD / NOT FOUND" },
    { speaker: "BIT", text: "3件とも、結果記録がありません。" },
    { speaker: "REI", text: "起きたことじゃなくて、これからしたかったことなんだ。" }
  ] },
  wishBroken: { id: "wishBroken", lines: [
    { speaker: "SYSTEM", text: "MESSAGE 04 / AUDIO DAMAGED" },
    { speaker: "SYSTEM", text: "RESTORE NOT REQUIRED" },
    { speaker: "REI", text: "これは、聞けないか。" },
    { text: "BITが壊れた音声の前で止まった。" }
  ] },
  wishBitRepair: { id: "wishBitRepair", lines: [
    { speaker: "BIT", text: "補助電源を3.2秒使用します。" },
    { speaker: "REI", text: "何してるの？" },
    { speaker: "BIT", text: "音声部のみ復旧します。" },
    { text: "『来年も、ここに来ようね。』" },
    { speaker: "REI", text: "……直したんだ。" },
    { speaker: "REI", text: "それ、必要だった？" },
    { speaker: "BIT", text: "……移動には不要です。" },
    { speaker: "REI", text: "そっか。" }
  ] },
  fantasyEntry: { id: "fantasyEntry", lines: [
    { speaker: "SYSTEM", text: "NEXT AREA" },
    { speaker: "SYSTEM", text: "SOURCE RECORD / NOT FOUND" },
    { speaker: "BIT", text: "次の領域に、保存元の記録がありません。" },
    { speaker: "REI", text: "記録にない場所？" },
    { speaker: "BIT", text: "定義できません。" },
    { speaker: "REI", text: "……じゃあ、見に行こう。" }
  ] }
};
