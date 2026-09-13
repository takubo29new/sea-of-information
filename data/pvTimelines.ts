import type { TrackId } from "@/engine/model";

export type PvDirection = {
  from: number;
  to: number;
  mood: "submerged" | "drift" | "rise" | "impact" | "afterglow";
  camera: number;
  light: number;
  particles: number;
};

const SEA_OF_INFORMATION: PvDirection[] = [
  { from: 0, to: 34, mood: "submerged", camera: 0.00, light: 0.35, particles: 0.20 },
  { from: 34, to: 78, mood: "drift", camera: 0.02, light: 0.48, particles: 0.34 },
  { from: 78, to: 118, mood: "rise", camera: 0.045, light: 0.68, particles: 0.52 },
  { from: 118, to: 167, mood: "impact", camera: 0.075, light: 0.92, particles: 0.78 },
  { from: 167, to: 214, mood: "drift", camera: 0.035, light: 0.58, particles: 0.46 },
  { from: 214, to: 274, mood: "impact", camera: 0.085, light: 1.00, particles: 0.92 },
  { from: 274, to: 324, mood: "afterglow", camera: 0.025, light: 0.56, particles: 0.36 }
];

export const PV_TIMELINES: Partial<Record<TrackId, PvDirection[]>> = {
  "sea-of-information": SEA_OF_INFORMATION
};

export function getPvDirection(track: TrackId, position: number): PvDirection {
  const timeline = PV_TIMELINES[track];
  const fallback: PvDirection = { from: 0, to: Number.POSITIVE_INFINITY, mood: "drift", camera: 0.02, light: 0.45, particles: 0.30 };
  return timeline?.find(cue => position >= cue.from && position < cue.to) ?? fallback;
}
