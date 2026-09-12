import { scenes, dialogues } from "../data/scenes";
import { INITIAL_STATE } from "../engine/model";
import { sanitizeGameState } from "../engine/saveCore";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function equal(actual: unknown, expected: unknown, message: string) { if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`); }

for (const scene of Object.values(scenes)) {
  for (const hotspot of scene.hotspots ?? []) {
    const action = hotspot.action;
    if (action.type === "advance" || action.type === "setFlagAndAdvance") assert(scenes[action.to], `${scene.id} points to missing scene ${action.to}`);
    if (action.type === "dialogue" || action.type === "setFlagAndDialogue") assert(dialogues[action.dialogueId], `${scene.id} points to missing dialogue ${action.dialogueId}`);
    if (hotspot.requiresTrackTime != null) { assert(scene.track, `${scene.id}/${hotspot.id} has a music gate without a track`); assert(hotspot.requiresTrackTime >= 0, `${scene.id}/${hotspot.id} has a negative music gate`); }
  }
  if (scene.enterDialogueId) assert(dialogues[scene.enterDialogueId], `${scene.id} has missing enter dialogue`);
}
for (const dialogue of Object.values(dialogues)) assert(dialogue.lines.length > 0, `${dialogue.id} must contain at least one line`);
const badSave = sanitizeGameState({ version: 999, sceneId: "bogus" }); equal(badSave.sceneId, INITIAL_STATE.sceneId, "Invalid save must reset scene");
const validSave = sanitizeGameState({ version: 1, sceneId: "city-loop-2", flags: {}, unlockedMusic: ["sea-of-information", "city-of-dawn", "bogus"], playTimeSeconds: 42, updatedAt: "2026-09-13T00:00:00.000Z" });
equal(validSave.unlockedMusic.join(","), "sea-of-information,city-of-dawn", "Music whitelist");
assert((scenes["sea-dive"].hotspots?.[0].requiresTrackTime ?? 0) >= 90, "Opening must let the track breathe");
assert((scenes["city-investigation"].hotspots?.find(h => h.id === "aurora-path")?.requiresTrackTime ?? 0) >= 315, "City chapter must reach the closing section before AURORA");
console.log(`Engine validation passed: ${Object.keys(scenes).length} scenes, ${Object.keys(dialogues).length} dialogues.`);
