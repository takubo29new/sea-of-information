import "../data/registerFutureScenes";
import { scenes, dialogues } from "../data/scenes";
import { INITIAL_STATE } from "../engine/model";
import { sanitizeGameState } from "../engine/saveCore";
import { TRACK_META } from "../engine/audio";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function equal(actual: unknown, expected: unknown, message: string) { if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`); }

for (const scene of Object.values(scenes)) {
  for (const hotspot of scene.hotspots ?? []) {
    const action = hotspot.action;
    if (action.type === "advance" || action.type === "setFlagAndAdvance") assert(scenes[action.to], `${scene.id} points to missing scene ${action.to}`);
    if (action.type === "dialogue" || action.type === "setFlagAndDialogue") assert(dialogues[action.dialogueId], `${scene.id} points to missing dialogue ${action.dialogueId}`);
    if (hotspot.requiresTrackTime != null) {
      assert(scene.track, `${scene.id}/${hotspot.id} has a music gate without a track`);
      assert(hotspot.requiresTrackTime >= 0, `${scene.id}/${hotspot.id} has a negative music gate`);
      assert(hotspot.requiresTrackTime < TRACK_META[scene.track].duration, `${scene.id}/${hotspot.id} gate exceeds track duration`);
    }
  }
  if (scene.enterDialogueId) assert(dialogues[scene.enterDialogueId], `${scene.id} has missing enter dialogue`);
}

for (const dialogue of Object.values(dialogues)) {
  assert(dialogue.lines.length > 0, `${dialogue.id} must contain at least one line`);
  const action = dialogue.after;
  if (action?.type === "advance" || action?.type === "setFlagAndAdvance") assert(scenes[action.to], `${dialogue.id} points to missing scene ${action.to}`);
  if (action?.type === "dialogue" || action?.type === "setFlagAndDialogue") assert(dialogues[action.dialogueId], `${dialogue.id} points to missing dialogue ${action.dialogueId}`);
}

const badSave = sanitizeGameState({ version: 999, sceneId: "bogus" });
equal(badSave.sceneId, INITIAL_STATE.sceneId, "Invalid save must reset scene");
const badSceneSave = sanitizeGameState({ version: 1, sceneId: "bogus", flags: {}, unlockedMusic: [] });
equal(badSceneSave.sceneId, INITIAL_STATE.sceneId, "Unknown scene must reset save safely");
const validSave = sanitizeGameState({ version: 1, sceneId: "city-loop-2", flags: { "city.loop1Seen": true }, unlockedMusic: ["sea-of-information", "city-of-dawn", "bogus"], playTimeSeconds: 42, updatedAt: "2026-09-13T00:00:00.000Z" });
equal(validSave.sceneId, "city-loop-2", "Valid save scene");
equal(validSave.unlockedMusic.join(","), "sea-of-information,city-of-dawn", "Music whitelist");
equal(validSave.playTimeSeconds, 42, "Play time preservation");
const finalSave = sanitizeGameState({
  version: 1,
  sceneId: "space-home-final",
  flags: {},
  unlockedMusic: Object.keys(TRACK_META),
  playTimeSeconds: 900,
  updatedAt: "2026-09-14T00:00:00.000Z"
});
equal(finalSave.unlockedMusic.length, Object.keys(TRACK_META).length, "All soundtrack unlocks must survive save sanitization");

assert((scenes["sea-dive"].hotspots?.[0].requiresTrackTime ?? 0) >= 90, "Opening must let Sea of information breathe");

const cityLoop1Station = scenes["city-loop-1"].hotspots?.find(h => h.id === "station");
assert(cityLoop1Station?.visibleWhenAll?.length === 4, "City first loop must require four observations before leaving");
const cityLoop2Intervention = scenes["city-loop-2"].hotspots?.find(h => h.id === "child2");
assert(cityLoop2Intervention?.visibleWhenAll?.length === 3, "City second loop must require three matches before intervention");
assert((scenes["city-investigation"].hotspots?.find(h => h.id === "aurora-path")?.requiresTrackTime ?? 0) >= 315, "City must reach the closing section before AURORA");
assert((scenes["gadget-auth"].hotspots?.[0].requiresTrackTime ?? 0) >= 175, "Gadget should reach the late track section before leaving");

const wishScene = scenes["wish-entry"];
const wishOutcome = wishScene.hotspots?.find(h => h.id === "wish-outcomes");
assert(wishOutcome?.visibleWhenAll?.length === 3, "WISH must require three ordinary messages");
const wishNext = wishScene.hotspots?.find(h => h.id === "wish-next");
assert((wishNext?.requiresTrackTime ?? 0) >= 300, "WISH should preserve its final musical section");
assert(wishNext?.action.type === "advance" && wishNext.action.to === "fantasy-entry", "WISH must flow into Fantasy");

const fantasyOrigin = scenes["fantasy-entry"].hotspots?.find(h => h.id === "fantasy-origin");
assert(fantasyOrigin?.visibleWhenAll?.length === 3, "Fantasy must require three impossible details");
const fantasyNext = scenes["fantasy-origin"].hotspots?.find(h => h.id === "fantasy-next");
assert((fantasyNext?.requiresTrackTime ?? 0) >= 410, "Fantasy should preserve its long musical arc");
assert(fantasyNext?.action.type === "advance" && fantasyNext.action.to === "beautiful-entry", "Fantasy must flow into Beautiful");

const beautifulNext = scenes["beautiful-entry"].hotspots?.find(h => h.id === "beautiful-next");
assert((beautifulNext?.requiresTrackTime ?? 0) >= 295, "Beautiful should reach its final musical section");
assert(beautifulNext?.action.type === "advance" && beautifulNext.action.to === "break-entry", "Beautiful must flow into Break");

assert(scenes["break-entry"].track === "break", "Break track must be registered");
assert(scenes["blavery-entry"].track === "blavery", "blavery must be the second musical state of the Break chapter");
assert((scenes["break-lock"].hotspots?.find(h => h.id === "break-escape")?.requiresTrackTime ?? 0) >= 280, "Break must keep the late musical escape beat");
assert((scenes["blavery-entry"].hotspots?.find(h => h.id === "blavery-next")?.requiresTrackTime ?? 0) >= 245, "blavery must reach its late section before Naked");

assert(scenes["naked-entry"].track === "naked", "Naked track must be registered");
assert(dialogues.nakedTruth.lines.some(line => line.text.includes("本人ではありません")), "Naked must plainly state that Rei is not Dr. Rei herself");
assert((scenes["naked-core"].hotspots?.find(h => h.id === "naked-next")?.requiresTrackTime ?? 0) >= 315, "Naked reveal must have time to land");

assert(scenes["signal-entry"].track === "signal", "Signal track must be registered");
assert((scenes["signal-contact"].hotspots?.find(h => h.id === "signal-route")?.requiresTrackTime ?? 0) >= 530, "Signal should use its long final section");
assert(dialogues.signalContact.lines.some(line => line.text.includes("外宇宙居住船団")), "Signal must establish living humans outside Earth");

assert(scenes["spacecraft-entry"].track === "spacecraft", "Spacecraft track must be registered");
assert(dialogues.spacecraftEarth.lines.some(line => line.text.includes("地球の文明")), "Spacecraft must distinguish Earth civilization ending from humanity ending");

assert(scenes["new-create-entry"].track === "new-create", "New create track must be registered");
assert(dialogues.newCreateIdentity.lines.some(line => line.speaker === "DR_REI"), "Dr. Rei AI must speak directly in New Create");
assert((scenes["new-create-core"].hotspots?.[0].requiresTrackTime ?? 0) >= 310, "New Create should reach its ending section before Thundercloud");

assert(scenes["thundercloud-entry"].track === "thundercloud", "Thundercloud track must be registered");
assert(dialogues.thundercloudOptions.lines.some(line => line.text === "RESTORE"), "Final decision must offer RESTORE");
assert(dialogues.thundercloudOptions.lines.some(line => line.text === "DELETE"), "Final decision must offer DELETE");
assert(dialogues.thundercloudOptions.lines.some(line => line.text === "RESET"), "Final decision must offer RESET");
assert(dialogues.thundercloudCreate.lines.some(line => line.text === "CREATE。"), "Rei must choose CREATE");

assert(scenes["space-home-entry"].track === "space-home", "Space Home track must be registered");
assert(dialogues.spaceHomeCompletion.lines.some(line => line.text === "WORLD COMPLETION 99.99%"), "Final world completion line must stay intact");
assert(dialogues.spaceHomeCompletion.lines.some(line => line.text === "100%ではありません。"), "BIT final completion line must stay intact");
assert(dialogues.spaceHomeCompletion.lines.some(line => line.text === "だからいいんだよ。"), "Rei final completion reply must stay intact");
assert(dialogues.spaceHomeWeather.lines.some(line => line.text === "明日の天気が分かりません。"), "BIT weather line must stay intact");
assert(dialogues.spaceHomeWeather.lines.some(line => line.text === "明日になれば分かるよ。"), "Rei weather reply must stay intact");

assert(Object.keys(scenes).length >= 35, "Complete soundtrack route should register the late-game scene set");

console.log(`Engine validation passed: ${Object.keys(scenes).length} scenes, ${Object.keys(dialogues).length} dialogues.`);
