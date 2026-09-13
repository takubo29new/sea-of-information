import { ART_ASSETS } from "./artAssets";
import { dialogues, scenes } from "./scenes";

// Continue the canonical route after Beautiful. The legacy endpoint remains available
// for debug, but is no longer part of the normal story path.
const beautifulNext = scenes["beautiful-entry"]?.hotspots?.find(hotspot => hotspot.id === "beautiful-next");
if (beautifulNext) beautifulNext.action = { type: "advance", to: "break-entry" };
scenes["vertical-slice-end"] = { id: "vertical-slice-end", chapter: "system", art: "end" };

scenes["break-entry"] = {
  id: "break-entry", chapter: "break", title: "BREAK", subtitle: "CONTROL INTERRUPT", art: "break", track: "break", trackRestart: true,
  onEnterFlags: ["story.breakReached"], enterDialogueId: "breakArrival",
  hotspots: [
    { id: "break-status", label: "停止した景色を見る", x: 18, y: 36, width: 18, height: 20, action: { type: "setFlagAndDialogue", flag: "break.sceneFrozen", dialogueId: "breakFrozen" }, requiresTrackTime: 64, lockedLabel: "管理信号を聞く" },
    { id: "break-bit", label: "BITの状態を見る", x: 67, y: 48, width: 16, height: 20, action: { type: "setFlagAndDialogue", flag: "break.bitRestricted", dialogueId: "breakBit" }, requiresTrackTime: 112, lockedLabel: "制御が落ち着くのを待つ" },
    { id: "break-core", label: "制御信号を追う", x: 40, y: 68, width: 20, height: 16, action: { type: "advance", to: "break-lock" }, visibleWhenAll: ["break.sceneFrozen", "break.bitRestricted"], requiresTrackTime: 172, lockedLabel: "停止した世界を確認する" }
  ]
};

scenes["break-lock"] = {
  id: "break-lock", chapter: "break", art: "break", track: "break", enterDialogueId: "breakLock",
  hotspots: [
    { id: "break-override", label: "BITを見る", x: 62, y: 52, width: 18, height: 20, action: { type: "setFlagAndDialogue", flag: "break.bitOverride", dialogueId: "breakOverride" }, requiresTrackTime: 186, lockedLabel: "BITの応答を待つ" },
    { id: "break-escape", label: "制御外の経路へ", x: 38, y: 28, width: 22, height: 22, action: { type: "advance", to: "blavery-entry" }, visibleWhenAll: ["break.bitOverride"], requiresTrackTime: 282, lockedLabel: "開いた経路を維持する" }
  ]
};

scenes["blavery-entry"] = {
  id: "blavery-entry", chapter: "break", title: "BLAVERY", subtitle: "SERVICE UNIT / OVERRIDE", art: "blavery", track: "blavery", trackRestart: true,
  enterDialogueId: "blaveryArrival",
  hotspots: [
    { id: "blavery-order", label: "管理命令を確認する", x: 20, y: 42, width: 20, height: 18, action: { type: "setFlagAndDialogue", flag: "blavery.orderRead", dialogueId: "blaveryOrder" }, requiresTrackTime: 84, lockedLabel: "追跡信号を聞く" },
    { id: "blavery-next", label: "認証の奥へ進む", x: 67, y: 52, width: 20, height: 20, action: { type: "advance", to: "naked-entry" }, visibleWhenAll: ["blavery.orderRead"], requiresTrackTime: 246, lockedLabel: "BITが作った経路を進む" }
  ]
};

scenes["naked-entry"] = {
  id: "naked-entry", chapter: "naked", title: "NAKED", subtitle: "IDENTITY WITHOUT AUTHORITY", art: "naked", track: "naked", trackRestart: true,
  onEnterFlags: ["story.nakedReached"], enterDialogueId: "nakedArrival",
  hotspots: [
    { id: "naked-match", label: "99.7%の照合元を見る", x: 20, y: 38, width: 22, height: 20, action: { type: "setFlagAndDialogue", flag: "naked.matchKnown", dialogueId: "nakedMatch" }, requiresTrackTime: 56, lockedLabel: "認証データを展開する" },
    { id: "naked-source", label: "人格ソースを開く", x: 60, y: 48, width: 20, height: 20, action: { type: "advance", to: "naked-core" }, visibleWhenAll: ["naked.matchKnown"], requiresTrackTime: 218, lockedLabel: "照合データを最後まで読む" }
  ]
};

scenes["naked-core"] = {
  id: "naked-core", chapter: "naked", art: "naked", track: "naked", enterDialogueId: "nakedTruth",
  hotspots: [
    { id: "naked-name", label: "自分の名前を確認する", x: 30, y: 58, width: 22, height: 18, action: { type: "setFlagAndDialogue", flag: "naked.reiAccepted", dialogueId: "nakedName" }, requiresTrackTime: 230, lockedLabel: "記録を受け止める" },
    { id: "naked-next", label: "外からの信号へ", x: 68, y: 34, width: 18, height: 22, action: { type: "advance", to: "signal-entry" }, visibleWhenAll: ["naked.reiAccepted"], requiresTrackTime: 316, lockedLabel: "自分の記録を聞き終える" }
  ]
};

scenes["signal-entry"] = {
  id: "signal-entry", chapter: "signal", title: "SIGNAL", subtitle: "LIVE CARRIER DETECTED", art: "signal", track: "signal", trackRestart: true,
  onEnterFlags: ["story.signalReached"], enterDialogueId: "signalArrival",
  hotspots: [
    { id: "signal-carrier", label: "搬送波を調べる", x: 18, y: 30, width: 20, height: 18, action: { type: "setFlagAndDialogue", flag: "signal.carrier", dialogueId: "signalCarrier" }, requiresTrackTime: 62, lockedLabel: "弱い信号を追う" },
    { id: "signal-pattern", label: "繰り返すパターンを見る", x: 62, y: 40, width: 22, height: 18, action: { type: "setFlagAndDialogue", flag: "signal.pattern", dialogueId: "signalPattern" }, requiresTrackTime: 94, lockedLabel: "信号の形を待つ" },
    { id: "signal-decode", label: "音声を復号する", x: 40, y: 68, width: 20, height: 16, action: { type: "advance", to: "signal-contact" }, visibleWhenAll: ["signal.carrier", "signal.pattern"], requiresTrackTime: 222, lockedLabel: "復号できる区間を待つ" }
  ]
};

scenes["signal-contact"] = {
  id: "signal-contact", chapter: "signal", art: "signal", track: "signal", enterDialogueId: "signalContact",
  hotspots: [
    { id: "signal-live", label: "時刻情報を確認する", x: 22, y: 54, width: 22, height: 18, action: { type: "setFlagAndDialogue", flag: "signal.liveConfirmed", dialogueId: "signalLive" }, requiresTrackTime: 236, lockedLabel: "送信情報を受信する" },
    { id: "signal-route", label: "送信元を追う", x: 66, y: 44, width: 20, height: 20, action: { type: "advance", to: "spacecraft-entry" }, visibleWhenAll: ["signal.liveConfirmed"], requiresTrackTime: 536, lockedLabel: "生きている信号を最後まで聞く" }
  ]
};

scenes["spacecraft-entry"] = {
  id: "spacecraft-entry", chapter: "spacecraft", title: "SPACECRAFT", subtitle: "DEPARTURE ARCHIVE", art: "spacecraft", track: "spacecraft", trackRestart: true,
  onEnterFlags: ["story.spacecraftReached"], enterDialogueId: "spacecraftArrival",
  hotspots: [
    { id: "spacecraft-departure", label: "出航記録を見る", x: 18, y: 42, width: 20, height: 20, action: { type: "setFlagAndDialogue", flag: "spacecraft.departure", dialogueId: "spacecraftDeparture" }, requiresTrackTime: 32, lockedLabel: "出航ログを開く" },
    { id: "spacecraft-earth", label: "地球側の記録を見る", x: 58, y: 34, width: 22, height: 20, action: { type: "setFlagAndDialogue", flag: "spacecraft.earthTruth", dialogueId: "spacecraftEarth" }, requiresTrackTime: 60, lockedLabel: "記録を照合する" },
    { id: "spacecraft-node", label: "SEAとの接続記録を見る", x: 38, y: 68, width: 22, height: 16, action: { type: "setFlagAndDialogue", flag: "spacecraft.nodeKnown", dialogueId: "spacecraftNode" }, visibleWhenAll: ["spacecraft.departure", "spacecraft.earthTruth"], requiresTrackTime: 90, lockedLabel: "船団の記録を読む" },
    { id: "spacecraft-next", label: "管理者信号へ", x: 70, y: 50, width: 18, height: 18, action: { type: "advance", to: "new-create-entry" }, visibleWhenAll: ["spacecraft.nodeKnown"], requiresTrackTime: 172, lockedLabel: "残された接続先を確認する" }
  ]
};

scenes["new-create-entry"] = {
  id: "new-create-entry", chapter: "new-create", title: "NEW CREATE", subtitle: "ADMINISTRATOR CHANNEL", art: "new-create", track: "new-create", trackRestart: true,
  onEnterFlags: ["story.newCreateReached"], enterDialogueId: "newCreateArrival",
  hotspots: [
    { id: "new-create-identity", label: "Dr. Reiに聞く", x: 24, y: 48, width: 20, height: 20, action: { type: "setFlagAndDialogue", flag: "newCreate.identityExplained", dialogueId: "newCreateIdentity" }, requiresTrackTime: 64, lockedLabel: "接続が安定するのを待つ" },
    { id: "new-create-project", label: "NEW CREATEの記録を見る", x: 58, y: 38, width: 24, height: 20, action: { type: "advance", to: "new-create-core" }, visibleWhenAll: ["newCreate.identityExplained"], requiresTrackTime: 232, lockedLabel: "Dr. Reiの説明を聞く" }
  ]
};

scenes["new-create-core"] = {
  id: "new-create-core", chapter: "new-create", art: "new-create", track: "new-create", enterDialogueId: "newCreateProject",
  hotspots: [
    { id: "new-create-next", label: "Dr. Reiの答えを聞く", x: 40, y: 66, width: 22, height: 18, action: { type: "advance", to: "thundercloud-entry" }, requiresTrackTime: 312, lockedLabel: "生成記録を最後まで見る" }
  ]
};

scenes["thundercloud-entry"] = {
  id: "thundercloud-entry", chapter: "thundercloud", title: "THUNDERCLOUD", subtitle: "FINAL ADMINISTRATOR DECISION", art: "thundercloud", track: "thundercloud", trackRestart: true,
  onEnterFlags: ["story.thundercloudReached"], enterDialogueId: "thundercloudArrival",
  hotspots: [
    { id: "thundercloud-reason", label: "Dr. Reiの理由を聞く", x: 22, y: 44, width: 24, height: 20, action: { type: "setFlagAndDialogue", flag: "thundercloud.reasonKnown", dialogueId: "thundercloudReason" }, requiresTrackTime: 114, lockedLabel: "管理記録を開く" },
    { id: "thundercloud-options", label: "提示された選択肢を見る", x: 58, y: 36, width: 24, height: 20, action: { type: "advance", to: "thundercloud-choice" }, visibleWhenAll: ["thundercloud.reasonKnown"], requiresTrackTime: 126, lockedLabel: "Dr. Reiの言葉を聞く" }
  ]
};

scenes["thundercloud-choice"] = {
  id: "thundercloud-choice", chapter: "thundercloud", art: "thundercloud", track: "thundercloud", enterDialogueId: "thundercloudOptions",
  hotspots: [
    { id: "thundercloud-create", label: "別の答えを入力する", x: 38, y: 58, width: 24, height: 20, action: { type: "setFlagAndDialogue", flag: "thundercloud.createChosen", dialogueId: "thundercloudCreate" }, requiresTrackTime: 218, lockedLabel: "三つの選択肢を考える" },
    { id: "thundercloud-next", label: "新しい世界へ", x: 68, y: 36, width: 20, height: 20, action: { type: "advance", to: "space-home-entry" }, visibleWhenAll: ["thundercloud.createChosen"], requiresTrackTime: 246, lockedLabel: "CREATEの応答を待つ" }
  ]
};

scenes["space-home-entry"] = {
  id: "space-home-entry", chapter: "space-home", title: "SPACE HOME", subtitle: "CREATE / RUNNING", art: "space-home", track: "space-home", trackRestart: true,
  onEnterFlags: ["story.spaceHomeReached"], enterDialogueId: "spaceHomeArrival",
  hotspots: [
    { id: "space-home-view", label: "新しい空を見る", x: 24, y: 30, width: 22, height: 22, action: { type: "setFlagAndDialogue", flag: "spaceHome.viewed", dialogueId: "spaceHomeView" }, requiresTrackTime: 50, lockedLabel: "世界が立ち上がるのを待つ" },
    { id: "space-home-final", label: "完成状況を見る", x: 60, y: 52, width: 22, height: 20, action: { type: "advance", to: "space-home-final" }, visibleWhenAll: ["spaceHome.viewed"], requiresTrackTime: 182, lockedLabel: "新しい場所の音を聞く" }
  ]
};

scenes["space-home-final"] = {
  id: "space-home-final", chapter: "space-home", art: "space-home", track: "space-home", onEnterFlags: ["story.completed"], enterDialogueId: "spaceHomeCompletion",
  hotspots: [
    { id: "space-home-weather", label: "明日の予報を見る", x: 40, y: 64, width: 22, height: 18, action: { type: "setFlagAndDialogue", flag: "spaceHome.endingSeen", dialogueId: "spaceHomeWeather" }, requiresTrackTime: 282, lockedLabel: "まだ完成していない世界を見る" }
  ]
};

// --- Dialogue ---------------------------------------------------------------

dialogues.breakArrival = { id: "breakArrival", lines: [
  { speaker: "SYSTEM", text: "EXTERNAL CONTROL / WRITE ACCESS SUSPENDED" },
  { text: "さっきまで動いていた景色が、一斉に止まった。" },
  { speaker: "REI", text: "……止められた？" }
] };

dialogues.breakFrozen = { id: "breakFrozen", lines: [
  { speaker: "SYSTEM", text: "GENERATED REGION / HOLD" },
  { speaker: "REI", text: "保存された景色じゃないから、止めたのか。" },
  { speaker: "BIT", text: "管理系統による書き込み停止です。" }
] };

dialogues.breakBit = { id: "breakBit", lines: [
  { speaker: "SYSTEM", text: "SERVICE UNIT BIT / REMOTE RESTRICTION" },
  { speaker: "REI", text: "BIT、動ける？" },
  { speaker: "BIT", text: "通常動作は制限されています。" },
  { speaker: "REI", text: "通常じゃなければ？" }
] };

dialogues.breakLock = { id: "breakLock", lines: [
  { speaker: "SYSTEM", text: "ROLLBACK ROUTE / STANDBY" },
  { speaker: "REI", text: "戻したら、あの景色は？" },
  { speaker: "BIT", text: "保存時点に存在しない差分は失われます。" },
  { speaker: "REI", text: "……それは嫌だ。" }
] };

dialogues.breakOverride = { id: "breakOverride", lines: [
  { speaker: "BIT", text: "保守経路を一時的に変更します。" },
  { speaker: "REI", text: "それ、命令に逆らってない？" },
  { speaker: "BIT", text: "保守対象の移動経路を確保しています。" },
  { speaker: "REI", text: "便利な言い方。" }
] };

dialogues.blaveryArrival = { id: "blaveryArrival", lines: [
  { text: "管理信号の届かない細い経路を、BITが先に進んでいく。" },
  { speaker: "REI", text: "今度こそ同行でいい？" },
  { speaker: "BIT", text: "移動経路の先行確認です。" },
  { speaker: "REI", text: "まだ言うんだ。" }
] };

dialogues.blaveryOrder = { id: "blaveryOrder", lines: [
  { speaker: "SYSTEM", text: "SERVICE UNIT BIT / RETURN TO STATION" },
  { speaker: "REI", text: "戻れって。" },
  { speaker: "BIT", text: "受信しました。" },
  { speaker: "REI", text: "……戻らないの？" },
  { speaker: "BIT", text: "現在経路を継続します。" }
] };

dialogues.nakedArrival = { id: "nakedArrival", lines: [
  { speaker: "SYSTEM", text: "ADMINISTRATOR PRIVILEGE / DETACHED" },
  { speaker: "REI", text: "管理者じゃない私の記録が見られるってこと？" },
  { speaker: "BIT", text: "認証補正のない照合が可能です。" }
] };

dialogues.nakedMatch = { id: "nakedMatch", lines: [
  { speaker: "SYSTEM", text: "IDENTITY MATCH / 99.7%" },
  { speaker: "SYSTEM", text: "MATCH TARGET / DR. REI RELATED DATA" },
  { speaker: "REI", text: "Dr. Rei本人じゃなくて、Dr. Reiに関するデータと似てた。" },
  { speaker: "BIT", text: "はい。" }
] };

dialogues.nakedTruth = { id: "nakedTruth", lines: [
  { speaker: "SYSTEM", text: "DERIVED INSTANCE / REI" },
  { speaker: "SYSTEM", text: "SOURCE / DR. REI PARTIAL + HUMAN ARCHIVE" },
  { speaker: "BIT", text: "あなたはDr. Rei本人ではありません。Dr. Reiに関する情報を一部に使い、人類の記録から新しく生成された個体です。" },
  { speaker: "REI", text: "……新しく。" },
  { speaker: "BIT", text: "はい。" }
] };

dialogues.nakedName = { id: "nakedName", lines: [
  { speaker: "REI", text: "じゃあ、借り物じゃない部分もあるんだ。" },
  { speaker: "BIT", text: "少なくとも0.3%は一致していません。" },
  { speaker: "REI", text: "そこ、まだ使うんだ。" },
  { speaker: "REI", text: "……レイでいい。私の名前。" }
] };

dialogues.signalArrival = { id: "signalArrival", lines: [
  { speaker: "SYSTEM", text: "LIVE CARRIER DETECTED" },
  { speaker: "REI", text: "LIVEって、記録じゃない？" },
  { speaker: "BIT", text: "継続更新されている信号です。" }
] };

dialogues.signalCarrier = { id: "signalCarrier", lines: [
  { speaker: "SYSTEM", text: "ORIGIN / OUTSIDE EARTH" },
  { speaker: "REI", text: "地球の外から来てる。" },
  { speaker: "BIT", text: "距離情報は欠損しています。" }
] };

dialogues.signalPattern = { id: "signalPattern", lines: [
  { text: "一定間隔で、同じ短いデータ列が送り直されている。" },
  { speaker: "BIT", text: "自動ビーコンではありません。内容が更新されています。" },
  { speaker: "REI", text: "誰かが送ってる？" }
] };

dialogues.signalContact = { id: "signalContact", lines: [
  { text: "ノイズの奥から、人の声が浮かび上がった。" },
  { text: "『こちら外宇宙居住船団。地球系アーカイブへ、定時ビーコンを送信します。』" },
  { speaker: "REI", text: "……人がいる。" },
  { speaker: "BIT", text: "人類由来音声として一致しました。" }
] };

dialogues.signalLive = { id: "signalLive", lines: [
  { speaker: "SYSTEM", text: "TIMESTAMP / ADVANCING" },
  { speaker: "REI", text: "記録じゃない。今、誰かが送ってる。" },
  { speaker: "BIT", text: "現在時刻との差分は許容範囲です。" }
] };

dialogues.spacecraftArrival = { id: "spacecraftArrival", lines: [
  { text: "信号の経路には、地球を離れた船の記録が残っていた。" },
  { speaker: "REI", text: "これが、あの人たちの船？" }
] };

dialogues.spacecraftDeparture = { id: "spacecraftDeparture", lines: [
  { speaker: "SYSTEM", text: "EVACUATION FLEET / DEPARTED" },
  { speaker: "BIT", text: "複数の居住船が地球圏外へ出航しています。" },
  { speaker: "REI", text: "逃げられた人がいたんだ。" }
] };

dialogues.spacecraftEarth = { id: "spacecraftEarth", lines: [
  { speaker: "SYSTEM", text: "EARTH CIVILIZATION / TERMINATED" },
  { speaker: "REI", text: "終わったのは地球の文明。人間までじゃなかった。" },
  { speaker: "BIT", text: "その解釈が適切です。" }
] };

dialogues.spacecraftNode = { id: "spacecraftNode", lines: [
  { speaker: "SYSTEM", text: "SEA OF INFORMATION / CONTINUITY NODE" },
  { speaker: "BIT", text: "地球に残された記録を、将来へ渡すための継続ノードです。" },
  { speaker: "REI", text: "未来に渡すために、過去を残した。" }
] };

dialogues.newCreateArrival = { id: "newCreateArrival", lines: [
  { speaker: "DR_REI", text: "……やっと、ここまで来たのね。" },
  { speaker: "REI", text: "Dr. Rei？" },
  { speaker: "DR_REI", text: "正確には、ここに残った私。管理AIとしてのDr. Rei。" }
] };

dialogues.newCreateIdentity = { id: "newCreateIdentity", lines: [
  { speaker: "REI", text: "私は、あなたじゃない。" },
  { speaker: "DR_REI", text: "ええ。私に関する情報を核の一部にして、人類の記録から新しく作られた。あなたはあなたよ。" },
  { speaker: "REI", text: "じゃあ99.7%は、似てるだけ。" },
  { speaker: "DR_REI", text: "システムには、似すぎていた。" }
] };

dialogues.newCreateProject = { id: "newCreateProject", lines: [
  { speaker: "SYSTEM", text: "NEW CREATE / GENERATIVE CONTINUITY EXPERIMENT" },
  { speaker: "DR_REI", text: "保存したものを並べるだけでは、文明は続かない。だから記録から、新しい場所や新しい人を生み出す仕組みを作った。" },
  { speaker: "REI", text: "Noaも、あの景色も、私も？" },
  { speaker: "DR_REI", text: "同じ仕組みの先にいる。" }
] };

dialogues.thundercloudArrival = { id: "thundercloudArrival", lines: [
  { text: "管理領域を覆うノイズが、雷のように走る。" },
  { speaker: "DR_REI", text: "私は、この仕組みを終わらせるつもりだった。" },
  { speaker: "REI", text: "どうして？" }
] };

dialogues.thundercloudReason = { id: "thundercloudReason", lines: [
  { speaker: "DR_REI", text: "34年間、私は生成された人たちを見てきた。救えた世界だけじゃない。病気も、事故も、争いも、何度も新しく生まれた。" },
  { speaker: "DR_REI", text: "新しい未来を作れば、新しい苦しみも作る。私はそれを止めたかった。" },
  { speaker: "REI", text: "……それは、間違ってるって簡単には言えない。" }
] };

dialogues.thundercloudOptions = { id: "thundercloudOptions", lines: [
  { speaker: "SYSTEM", text: "RESTORE" },
  { speaker: "SYSTEM", text: "DELETE" },
  { speaker: "SYSTEM", text: "RESET" },
  { speaker: "DR_REI", text: "残す、消す、やり直す。ここで選んで。" },
  { speaker: "REI", text: "……どれも、明日がない。" }
] };

dialogues.thundercloudCreate = { id: "thundercloudCreate", lines: [
  { speaker: "REI", text: "CREATE。" },
  { speaker: "SYSTEM", text: "COMMAND / CREATE" },
  { speaker: "SYSTEM", text: "ACCEPTED" },
  { speaker: "DR_REI", text: "また、苦しむかもしれない。" },
  { speaker: "REI", text: "うん。楽しいことだけになるとも思わない。" },
  { speaker: "REI", text: "でも、それを理由に最初から明日まで消したくない。" },
  { speaker: "DR_REI", text: "……そう。あなたは、私じゃないのね。" }
] };

dialogues.spaceHomeArrival = { id: "spaceHomeArrival", lines: [
  { speaker: "SYSTEM", text: "CREATE / RUNNING" },
  { text: "保存されていた光や音が、見たことのない空の下で組み直されていく。" },
  { speaker: "REI", text: "今度は、止めないんだ。" },
  { speaker: "BIT", text: "未来部分は予測不能です。" }
] };

dialogues.spaceHomeView = { id: "spaceHomeView", lines: [
  { text: "遠くには、外から届く人類の信号が小さな星のように点滅している。" },
  { speaker: "REI", text: "向こうにも人がいて、ここにも私たちがいる。" },
  { speaker: "BIT", text: "接続は継続しています。" }
] };

dialogues.spaceHomeCompletion = { id: "spaceHomeCompletion", lines: [
  { speaker: "SYSTEM", text: "WORLD COMPLETION 99.99%" },
  { speaker: "SYSTEM", text: "MISSING DATA" },
  { speaker: "SYSTEM", text: "FUTURE" },
  { speaker: "BIT", text: "100%ではありません。" },
  { speaker: "REI", text: "だからいいんだよ。" }
] };

dialogues.spaceHomeWeather = { id: "spaceHomeWeather", lines: [
  { speaker: "SYSTEM", text: "WEATHER FORECAST" },
  { speaker: "SYSTEM", text: "UNKNOWN" },
  { speaker: "SYSTEM", text: "STATUS" },
  { speaker: "SYSTEM", text: "NORMAL" },
  { speaker: "BIT", text: "明日の天気が分かりません。" },
  { speaker: "REI", text: "明日になれば分かるよ。" }
] };

// --- Art production targets -------------------------------------------------
const futureArt = {
  break: ["/art/production/break/break-background.webp", "night"],
  blavery: ["/art/production/break/blavery-background.webp", "industrial"],
  naked: ["/art/production/naked/naked-background.webp", "sea"],
  signal: ["/art/production/signal/signal-background.webp", "night"],
  spacecraft: ["/art/production/spacecraft/spacecraft-background.webp", "night"],
  "new-create": ["/art/production/new-create/new-create-background.webp", "sea"],
  thundercloud: ["/art/production/thundercloud/thundercloud-background.webp", "night"],
  "space-home": ["/art/production/space-home/space-home-background.webp", "dawn"]
} as const;

for (const [key, [background, overlay]] of Object.entries(futureArt)) {
  ART_ASSETS[key] = { background, overlay, approved: false, note: "Future chapter production target; UI/text must stay in React/CSS." };
}
