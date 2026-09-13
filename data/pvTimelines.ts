import type { TrackId } from "@/engine/model";

export type PvMood = "submerged" | "drift" | "rise" | "impact" | "afterglow" | "break";
export type PvShot = "ocean" | "arrival" | "wide" | "portrait" | "cross" | "climax" | "outro";
export type PvCharacterPlacement = "hidden" | "left" | "center" | "right";
export type PvUiMode = "full" | "minimal" | "ghost";

export type PvDirection = {
  from: number;
  to: number;
  mood: PvMood;
  shot: PvShot;
  character: PvCharacterPlacement;
  ui: PvUiMode;
  camera: number;
  light: number;
  particles: number;
};

/**
 * SEA OF INFORMATION — first full PV direction pass.
 * These are intentionally broad editorial beats rather than beat-perfect cuts.
 * Once the overall visual language is approved, individual boundaries can be
 * tightened against the master track.
 */
const SEA_OF_INFORMATION: PvDirection[] = [
  // Cold open: let the information sea establish itself before showing Rei.
  { from: 0, to: 32, mood: "submerged", shot: "ocean", character: "hidden", ui: "minimal", camera: 0.00, light: 0.28, particles: 0.18 },

  // Rei slowly enters the image; still restrained.
  { from: 32, to: 66, mood: "drift", shot: "arrival", character: "right", ui: "full", camera: 0.035, light: 0.48, particles: 0.34 },

  // Open the frame up and move the visual weight across the screen.
  { from: 66, to: 96, mood: "rise", shot: "wide", character: "left", ui: "minimal", camera: 0.065, light: 0.64, particles: 0.50 },

  // First portrait push-in.
  { from: 96, to: 118, mood: "rise", shot: "portrait", character: "center", ui: "ghost", camera: 0.105, light: 0.76, particles: 0.58 },

  // First large impact section.
  { from: 118, to: 158, mood: "impact", shot: "climax", character: "center", ui: "ghost", camera: 0.155, light: 1.08, particles: 0.92 },

  // Pull away and give the eye somewhere to rest.
  { from: 158, to: 181, mood: "break", shot: "ocean", character: "hidden", ui: "ghost", camera: 0.018, light: 0.24, particles: 0.16 },

  // Re-entry from the opposite side makes the composition visibly change.
  { from: 181, to: 214, mood: "drift", shot: "cross", character: "left", ui: "minimal", camera: 0.055, light: 0.58, particles: 0.46 },

  // Long second climax. Stronger than the first.
  { from: 214, to: 258, mood: "impact", shot: "climax", character: "right", ui: "ghost", camera: 0.185, light: 1.18, particles: 1.00 },

  // Final portrait before release.
  { from: 258, to: 283, mood: "rise", shot: "portrait", character: "center", ui: "minimal", camera: 0.125, light: 0.82, particles: 0.70 },

  // Let the track breathe out and return to the game language.
  { from: 283, to: 324, mood: "afterglow", shot: "outro", character: "right", ui: "full", camera: 0.035, light: 0.48, particles: 0.30 }
];

export const PV_TIMELINES: Partial<Record<TrackId, PvDirection[]>> = {
  "sea-of-information": SEA_OF_INFORMATION
};

const FALLBACK: PvDirection = {
  from: 0,
  to: Number.POSITIVE_INFINITY,
  mood: "drift",
  shot: "wide",
  character: "right",
  ui: "full",
  camera: 0.02,
  light: 0.45,
  particles: 0.30
};

export function getPvDirection(track: TrackId, position: number): PvDirection {
  const timeline = PV_TIMELINES[track];
  return timeline?.find(cue => position >= cue.from && position < cue.to) ?? FALLBACK;
}
