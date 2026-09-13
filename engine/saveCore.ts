import { GameState, INITIAL_STATE, isSceneId } from "./model";

export const SAVE_KEY = "sea-of-information:auto:v1";

const MUSIC_IDS = new Set([
  "sea-of-information", "city-of-dawn", "load-road", "gadget-area", "wish", "fantasy", "beautiful",
  "break", "blavery", "naked", "signal", "spacecraft", "new-create", "thundercloud", "space-home"
]);

export function sanitizeGameState(value: unknown): GameState {
  if (!value || typeof value !== "object") return { ...INITIAL_STATE };
  const input = value as Partial<GameState>;
  if (input.version !== 1 || !isSceneId(input.sceneId)) return { ...INITIAL_STATE };

  return {
    version: 1,
    sceneId: input.sceneId,
    flags: input.flags && typeof input.flags === "object" ? { ...input.flags } : {},
    unlockedMusic: Array.isArray(input.unlockedMusic)
      ? input.unlockedMusic.filter((v): v is GameState["unlockedMusic"][number] => typeof v === "string" && MUSIC_IDS.has(v))
      : ["sea-of-information"],
    playTimeSeconds: typeof input.playTimeSeconds === "number" && input.playTimeSeconds >= 0
      ? input.playTimeSeconds
      : 0,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date(0).toISOString()
  };
}
