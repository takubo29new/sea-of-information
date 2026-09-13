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
const wishSave = sanitizeGameState({ version: 1, sceneId: "wish-entry", flags: {}, unlockedMusic: ["sea-of-information", "wish"], playTimeSeconds: 90, updatedAt: "2026-09-14T00:00:00.000Z" });
assert(wishSave.unlockedMusic.includes("wish"), "Wish music must survive save sanitization");

assert((scenes["sea-dive"].hotspots?.[0].requiresTrackTime ?? 0) >= 90, "Opening must let Sea of information breathe");

const cityLoop1Station = scenes["city-loop-1"].hotspots?.find(h => h.id === "station");
assert(cityLoop1Station?.visibleWhenAll?.length === 4, "City first loop must require four observations before leaving");
assert(["city.observeClock", "city.observeChild", "city.observeBirds", "city.observeBakery"].every(flag => cityLoop1Station?.visibleWhenAll?.includes(flag)), "City first loop observation flags must gate the station");

const cityLoop2Intervention = scenes["city-loop-2"].hotspots?.find(h => h.id === "child2");
assert(cityLoop2Intervention?.visibleWhenAll?.length === 3, "City second loop must require three matches before intervention");
assert(["city.matchClock", "city.matchBirds", "city.matchBakery"].every(flag => cityLoop2Intervention?.visibleWhenAll?.includes(flag)), "City second loop comparison flags must gate intervention");
assert((cityLoop2Intervention?.requiresTrackTime ?? 0) >= 150, "City intervention must not happen before the track develops");

assert((scenes["city-investigation"].hotspots?.find(h => h.id === "aurora-path")?.requiresTrackTime ?? 0) >= 315, "City chapter must reach the closing section of City of dawn before AURORA");
assert(scenes["city-night"].onEnterFlags?.includes("city.completed"), "City chapter completion flag must be set at night");
assert(scenes["city-night"].hotspots?.some(h => h.action.type === "advance" && h.action.to === "load-road-1"), "City of Dawn must flow into Load Road");
assert((scenes["load-road-1"].hotspots?.find(h => h.id === "load-road-next")?.requiresTrackTime ?? 0) >= 120, "Load Road must have meaningful listening time");
assert(scenes["gadget-machinery"].hotspots?.find(h => h.id === "gadget-open")?.visibleWhenAll?.length === 3, "Gadget machinery must require all three restoration clues");
assert((scenes["gadget-auth"].hotspots?.[0].requiresTrackTime ?? 0) >= 175, "Gadget Area should reach the late section of the track before milestone end");

const wishScene = scenes["wish-entry"];
const wishOutcome = wishScene.hotspots?.find(h => h.id === "wish-outcomes");
assert(wishOutcome?.visibleWhenAll?.length === 3, "WISH must require three ordinary messages before checking outcomes");
assert(["wish.message1", "wish.message2", "wish.message3"].every(flag => wishOutcome?.visibleWhenAll?.includes(flag)), "WISH message flags must gate outcome review");
assert((wishOutcome?.requiresTrackTime ?? 0) >= 120, "WISH outcome reveal should wait for the first major musical section");
assert((wishScene.hotspots?.find(h => h.id === "wish-broken")?.requiresTrackTime ?? 0) >= 190, "WISH broken message should align with the later musical section");
assert((wishScene.hotspots?.find(h => h.id === "wish-bit-repair")?.requiresTrackTime ?? 0) >= 225, "BIT repair should happen after the broken message has time to land");
assert((wishScene.hotspots?.find(h => h.id === "wish-next")?.requiresTrackTime ?? 0) >= 300, "WISH should keep the player through the final musical section before Fantasy");
assert(scenes["vertical-slice-end"].enterDialogueId === "fantasyEntry", "WISH must lead into the Fantasy entry dialogue");

assert(Object.keys(scenes).length >= 21, "Current slice should include second Load Road and WISH flow");

console.log(`Engine validation passed: ${Object.keys(scenes).length} scenes, ${Object.keys(dialogues).length} dialogues.`);