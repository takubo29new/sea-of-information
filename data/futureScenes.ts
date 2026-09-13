import { ART_ASSETS } from "./artAssets";
import { dialogues, scenes } from "./scenes";

// Future chapters register into the shared data tables so the original vertical
// slice can stay stable while later music chapters are added in small modules.
const wishNext = scenes["wish-entry"]?.hotspots?.find(hotspot => hotspot.id === "wish-next");
if (wishNext) wishNext.action = { type: "advance", to: "fantasy-entry" };

scenes["fantasy-entry"] = {
  id: "fantasy-entry",
  chapter: "fantasy",
  title: "FANTASY",
  subtitle: "SOURCE RECORD / NOT FOUND",
  art: "fantasy",
  track: "fantasy",
  trackRestart: true,
  onEnterFlags: ["story.fantasyReached"],
  enterDialogueId: "fantasyArrival",
  hotspots: [
    { id: "fantasy-sky", label: "空を見る", x: 18, y: 20, width: 18, height: 18, action: { type: "setFlagAndDialogue", flag: "fantasy.sky", dialogueId: "fantasySky" } },
    { id: "fantasy-bridge", label: "橋を調べる", x: 42, y: 48, width: 18, height: 20, action: { type: "setFlagAndDialogue", flag: "fantasy.bridge", dialogueId: "fantasyBridge" } },
    { id: "fantasy-flowers", label: "花に触れる", x: 70, y: 58, width: 16, height: 18, action: { type: "setFlagAndDialogue", flag: "fantasy.flowers", dialogueId: "fantasyFlowers" } },
    {
      id: "fantasy-origin",
      label: "保存元を探す",
      x: 40,
      y: 70,
      width: 20,
      height: 16,
      action: { type: "advance", to: "fantasy-origin" },
      visibleWhenAll: ["fantasy.sky", "fantasy.bridge", "fantasy.flowers"],
      requiresTrackTime: 252,
      lockedLabel: "この景色をもう少し見る"
    }
  ]
};

scenes["fantasy-origin"] = {
  id: "fantasy-origin",
  chapter: "fantasy",
  art: "fantasy",
  track: "fantasy",
  enterDialogueId: "fantasyOrigin",
  hotspots: [
    {
      id: "fantasy-question",
      label: "BITに聞く",
      x: 18,
      y: 58,
      width: 18,
      height: 18,
      action: { type: "setFlagAndDialogue", flag: "fantasy.generatedSuspected", dialogueId: "fantasyQuestion" },
      requiresTrackTime: 286,
      lockedLabel: "照合結果を待つ"
    },
    {
      id: "fantasy-next",
      label: "景色の先へ進む",
      x: 68,
      y: 42,
      width: 18,
      height: 22,
      action: { type: "advance", to: "beautiful-entry" },
      visibleWhenAll: ["fantasy.generatedSuspected"],
      requiresTrackTime: 412,
      lockedLabel: "この場所の音を最後まで聞く"
    }
  ]
};

scenes["beautiful-entry"] = {
  id: "beautiful-entry",
  chapter: "beautiful",
  title: "BEAUTIFUL",
  subtitle: "CHANGING VIEW",
  art: "beautiful",
  track: "beautiful",
  trackRestart: true,
  onEnterFlags: ["story.beautifulReached"],
  enterDialogueId: "beautifulArrival",
  hotspots: [
    {
      id: "beautiful-capture",
      label: "今の景色を保存する",
      x: 24,
      y: 46,
      width: 20,
      height: 18,
      action: { type: "setFlagAndDialogue", flag: "beautiful.capture", dialogueId: "beautifulCapture" },
      requiresTrackTime: 38,
      lockedLabel: "変わっていく景色を見る"
    },
    {
      id: "beautiful-compare",
      label: "保存した景色と比べる",
      x: 58,
      y: 34,
      width: 20,
      height: 18,
      action: { type: "setFlagAndDialogue", flag: "beautiful.compared", dialogueId: "beautifulCompare" },
      visibleWhenAll: ["beautiful.capture"],
      requiresTrackTime: 120,
      lockedLabel: "景色が変わるのを待つ"
    },
    {
      id: "beautiful-fix",
      label: "BITの提案を聞く",
      x: 34,
      y: 68,
      width: 20,
      height: 16,
      action: { type: "setFlagAndDialogue", flag: "beautiful.keepChanging", dialogueId: "beautifulChoice" },
      visibleWhenAll: ["beautiful.compared"],
      requiresTrackTime: 270,
      lockedLabel: "今の景色をもう少し見る"
    },
    {
      id: "beautiful-next",
      label: "次の信号を見る",
      x: 70,
      y: 60,
      width: 18,
      height: 18,
      action: { type: "advance", to: "vertical-slice-end" },
      visibleWhenAll: ["beautiful.keepChanging"],
      requiresTrackTime: 298,
      lockedLabel: "曲の余韻を聞く"
    }
  ]
};

// Until Break / blavery receives its own track scene, the legacy endpoint serves
// as a text-only handoff. Its old QA card is hidden for this art key in CSS.
scenes["vertical-slice-end"] = {
  id: "vertical-slice-end",
  chapter: "system",
  title: "BREAK / BLAVERY",
  subtitle: "CONTROL SIGNAL",
  art: "beautiful",
  track: "beautiful",
  onEnterFlags: ["story.beautifulCompleted"],
  enterDialogueId: "breakSignal"
};

dialogues.fantasyArrival = {
  id: "fantasyArrival",
  lines: [
    { speaker: "SYSTEM", text: "SOURCE RECORD / NOT FOUND" },
    { speaker: "BIT", text: "照合できる保存元がありません。" },
    { speaker: "REI", text: "でも、普通にここにあるね。" }
  ]
};

dialogues.fantasySky = {
  id: "fantasySky",
  lines: [
    { text: "雲はゆっくりと地面から空へ落ちていく。" },
    { speaker: "BIT", text: "雲、空、光。それぞれの記録は存在します。" },
    { speaker: "REI", text: "この空そのものは？" },
    { speaker: "BIT", text: "一致なし。" }
  ]
};

dialogues.fantasyBridge = {
  id: "fantasyBridge",
  lines: [
    { text: "長い橋を目で追うと、両端が同じ岸へ戻っている。" },
    { speaker: "REI", text: "渡ったら元の場所に戻りそう。" },
    { speaker: "BIT", text: "構造上は成立していません。" },
    { speaker: "REI", text: "見えてるけどね。" }
  ]
};

dialogues.fantasyFlowers = {
  id: "fantasyFlowers",
  lines: [
    { text: "触れた花だけ、花びらの形が少し変わった。" },
    { speaker: "BIT", text: "該当する植物種はありません。" },
    { speaker: "REI", text: "じゃあ、新種。" },
    { speaker: "BIT", text: "分類根拠が不足しています。" }
  ]
};

dialogues.fantasyOrigin = {
  id: "fantasyOrigin",
  lines: [
    { speaker: "SYSTEM", text: "SOURCE MATCH / 0 RECORDS" },
    { speaker: "BIT", text: "構成要素は既存記録と一致します。組み合わせの記録はありません。" },
    { speaker: "REI", text: "材料は昔のもの。でも、この景色は昔にはなかった。" }
  ]
};

dialogues.fantasyQuestion = {
  id: "fantasyQuestion",
  lines: [
    { speaker: "REI", text: "これ、誰かが作ったってこと？" },
    { speaker: "BIT", text: "その可能性があります。生成経路は特定できません。" },
    { speaker: "REI", text: "保存するだけの場所じゃなかったんだ。" },
    { speaker: "BIT", text: "……現在の情報では否定できません。" }
  ]
};

dialogues.beautifulArrival = {
  id: "beautifulArrival",
  lines: [
    { text: "次の場所には、同じ形のまま止まっているものが一つもなかった。" },
    { speaker: "REI", text: "さっき見た色、もう変わってる。" },
    { speaker: "BIT", text: "故障反応はありません。" }
  ]
};

dialogues.beautifulCapture = {
  id: "beautifulCapture",
  lines: [
    { speaker: "SYSTEM", text: "CAPTURE SAVED" },
    { speaker: "REI", text: "これで、今の景色は残った。" },
    { speaker: "BIT", text: "静止記録として保存しました。" }
  ]
};

dialogues.beautifulCompare = {
  id: "beautifulCompare",
  lines: [
    { text: "保存した景色と目の前の景色を重ねる。輪郭も光も、もう少しずつ違っていた。" },
    { speaker: "REI", text: "同じには戻せない？" },
    { speaker: "BIT", text: "現在の変化規則では、同一状態の再現を保証できません。" },
    { speaker: "REI", text: "そっか。" }
  ]
};

dialogues.beautifulChoice = {
  id: "beautifulChoice",
  lines: [
    { speaker: "BIT", text: "保存した静止記録を基準状態として固定できます。" },
    { speaker: "REI", text: "しなくていい。" },
    { speaker: "BIT", text: "現在状態も変化します。" },
    { speaker: "REI", text: "うん。だから、このままがいい。" }
  ]
};

dialogues.breakSignal = {
  id: "breakSignal",
  lines: [
    { speaker: "SYSTEM", text: "EXTERNAL CONTROL SIGNAL DETECTED" },
    { speaker: "REI", text: "……今度は何？" },
    { speaker: "BIT", text: "管理系統からの信号です。" }
  ]
};

ART_ASSETS.fantasy = {
  background: "/art/production/fantasy/fantasy-background.webp",
  overlay: "sea",
  approved: false,
  note: "Generated landscape: familiar components combined into an impossible place; no baked UI/text."
};

ART_ASSETS.beautiful = {
  background: "/art/production/beautiful/beautiful-background.webp",
  overlay: "dusk",
  approved: false,
  note: "Continuously changing generated vista; one composition should support capture/compare storytelling."
};
