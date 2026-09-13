export const SCENE_IDS: readonly string[] = [
  "title", "sea-awakening", "sea-terminal", "sea-dive", "city-loop-1", "city-loop-2",
  "city-intervention", "city-noa", "city-investigation", "city-aurora-gate", "city-aurora",
  "city-dusk", "city-night", "load-road-1", "gadget-entry", "gadget-machinery",
  "gadget-bit", "gadget-auth", "load-road-2", "wish-entry", "fantasy-entry", "fantasy-origin",
  "beautiful-entry", "break-entry", "break-lock", "blavery-entry", "naked-entry", "naked-core",
  "signal-entry", "signal-contact", "spacecraft-entry", "new-create-entry", "new-create-core",
  "thundercloud-entry", "thundercloud-choice", "space-home-entry", "space-home-final", "vertical-slice-end"
];

/**
 * Later music chapters register their scenes from separate modules. Scene IDs therefore
 * use a string type, while saves are still strictly checked against SCENE_IDS and every
 * transition target is validated by the engine test suite.
 */
export type SceneId = string;

export function isSceneId(value: unknown): value is SceneId {
  return typeof value === "string" && SCENE_IDS.includes(value);
}

export type TrackId =
  | "sea-of-information"
  | "city-of-dawn"
  | "load-road"
  | "gadget-area"
  | "wish"
  | "fantasy"
  | "beautiful"
  | "break"
  | "blavery"
  | "naked"
  | "signal"
  | "spacecraft"
  | "new-create"
  | "thundercloud"
  | "space-home";

export type HotspotAction =
  | { type: "advance"; to: SceneId }
  | { type: "dialogue"; dialogueId: string }
  | { type: "setFlagAndAdvance"; flag: string; to: SceneId }
  | { type: "setFlagAndDialogue"; flag: string; dialogueId: string };

export type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  action: HotspotAction;
  visibleWhen?: { flag: string; equals: boolean };
  visibleWhenAll?: string[];
  /** Earliest position in the current track at which this interaction may advance. */
  requiresTrackTime?: number;
  lockedLabel?: string;
};

export type Scene = {
  id: SceneId;
  chapter:
    | "prologue"
    | "city-of-dawn"
    | "transit"
    | "gadget-area"
    | "wish"
    | "fantasy"
    | "beautiful"
    | "break"
    | "naked"
    | "signal"
    | "spacecraft"
    | "new-create"
    | "thundercloud"
    | "space-home"
    | "system";
  title?: string;
  subtitle?: string;
  art:
    | "title"
    | "sea"
    | "terminal"
    | "dive"
    | "city"
    | "city-glitch"
    | "noa"
    | "city-investigation"
    | "aurora-gate"
    | "aurora"
    | "dusk"
    | "night"
    | "load-road"
    | "gadget-entry"
    | "gadget-machinery"
    | "gadget-bit"
    | "gadget-auth"
    | "wish"
    | "fantasy"
    | "beautiful"
    | "break"
    | "blavery"
    | "naked"
    | "signal"
    | "spacecraft"
    | "new-create"
    | "thundercloud"
    | "space-home"
    | "end";
  track?: TrackId;
  trackRestart?: boolean;
  hotspots?: Hotspot[];
  autoAdvanceMs?: number;
  autoAdvanceTo?: SceneId;
  enterDialogueId?: string;
  onEnterFlags?: string[];
};

export type DialogueLine = {
  speaker?: "REI" | "NOA" | "BIT" | "AURORA" | "DR_REI" | "SYSTEM";
  text: string;
};

export type Dialogue = {
  id: string;
  lines: DialogueLine[];
  after?: HotspotAction;
};

export type GameState = {
  version: 1;
  sceneId: SceneId;
  flags: Record<string, boolean>;
  unlockedMusic: TrackId[];
  playTimeSeconds: number;
  updatedAt: string;
};

export const INITIAL_STATE: GameState = {
  version: 1,
  sceneId: "sea-awakening",
  flags: {},
  unlockedMusic: ["sea-of-information"],
  playTimeSeconds: 0,
  updatedAt: new Date(0).toISOString()
};
