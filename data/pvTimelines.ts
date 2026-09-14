import type { TrackId } from "@/engine/model";

export type PvDirection = {
  from: number;
  to: number;
  mood: "submerged" | "drift" | "rise" | "impact" | "afterglow";
  camera: number;
  light: number;
  particles: number;
};

const cue = (from: number, to: number, mood: PvDirection["mood"], camera: number, light: number, particles: number): PvDirection => ({
  from, to, mood, camera, light, particles
});

export const PV_TIMELINES: Record<TrackId, PvDirection[]> = {
  "sea-of-information": [
    cue(0, 34, "submerged", 0.00, 0.35, 0.20),
    cue(34, 78, "drift", 0.02, 0.48, 0.34),
    cue(78, 118, "rise", 0.045, 0.68, 0.52),
    cue(118, 167, "impact", 0.075, 0.92, 0.78),
    cue(167, 214, "drift", 0.035, 0.58, 0.46),
    cue(214, 274, "impact", 0.085, 1.00, 0.92),
    cue(274, 324, "afterglow", 0.025, 0.56, 0.36)
  ],
  "city-of-dawn": [
    cue(0, 75, "submerged", 0.012, 0.44, 0.18),
    cue(75, 155, "drift", 0.024, 0.58, 0.30),
    cue(155, 185, "impact", 0.045, 0.76, 0.42),
    cue(185, 235, "rise", 0.036, 0.72, 0.42),
    cue(235, 320, "impact", 0.052, 0.92, 0.58),
    cue(320, 344, "afterglow", 0.016, 0.78, 0.24)
  ],
  "load-road": [
    cue(0, 42, "submerged", 0.018, 0.38, 0.18),
    cue(42, 92, "drift", 0.034, 0.50, 0.30),
    cue(92, 125, "rise", 0.046, 0.62, 0.40),
    cue(125, 250, "impact", 0.070, 0.78, 0.58),
    cue(250, 324, "afterglow", 0.026, 0.48, 0.24)
  ],
  "gadget-area": [
    cue(0, 34, "submerged", 0.010, 0.30, 0.12),
    cue(34, 70, "drift", 0.025, 0.45, 0.24),
    cue(70, 108, "rise", 0.038, 0.62, 0.34),
    cue(108, 146, "impact", 0.060, 0.82, 0.48),
    cue(146, 190, "impact", 0.070, 0.94, 0.56),
    cue(190, 212, "afterglow", 0.018, 0.46, 0.18)
  ],
  wish: [
    cue(0, 47, "submerged", 0.008, 0.34, 0.16),
    cue(47, 126, "drift", 0.020, 0.50, 0.28),
    cue(126, 194, "submerged", 0.012, 0.40, 0.20),
    cue(194, 227, "rise", 0.026, 0.60, 0.32),
    cue(227, 302, "impact", 0.042, 0.78, 0.46),
    cue(302, 337, "afterglow", 0.012, 0.48, 0.18)
  ],
  fantasy: [
    cue(0, 54, "submerged", 0.012, 0.40, 0.24),
    cue(54, 180, "drift", 0.030, 0.58, 0.42),
    cue(180, 252, "rise", 0.045, 0.74, 0.54),
    cue(252, 286, "submerged", 0.010, 0.44, 0.22),
    cue(286, 412, "impact", 0.055, 0.90, 0.66),
    cue(412, 443, "afterglow", 0.016, 0.62, 0.30)
  ],
  beautiful: [
    cue(0, 38, "submerged", 0.008, 0.42, 0.18),
    cue(38, 120, "drift", 0.020, 0.64, 0.32),
    cue(120, 205, "rise", 0.032, 0.72, 0.38),
    cue(205, 270, "impact", 0.045, 0.88, 0.52),
    cue(270, 298, "rise", 0.026, 0.76, 0.40),
    cue(298, 305, "afterglow", 0.008, 0.48, 0.16)
  ],
  break: [
    cue(0, 64, "impact", 0.070, 0.72, 0.36),
    cue(64, 120, "submerged", 0.016, 0.34, 0.14),
    cue(120, 172, "drift", 0.028, 0.44, 0.24),
    cue(172, 256, "impact", 0.080, 0.86, 0.56),
    cue(256, 294, "rise", 0.050, 0.76, 0.46),
    cue(294, 302, "afterglow", 0.010, 0.34, 0.12)
  ],
  blavery: [
    cue(0, 84, "submerged", 0.014, 0.38, 0.18),
    cue(84, 150, "rise", 0.036, 0.62, 0.34),
    cue(150, 220, "impact", 0.058, 0.78, 0.50),
    cue(220, 246, "rise", 0.030, 0.66, 0.36),
    cue(246, 266, "afterglow", 0.012, 0.42, 0.18)
  ],
  naked: [
    cue(0, 56, "submerged", 0.006, 0.30, 0.10),
    cue(56, 150, "drift", 0.016, 0.42, 0.18),
    cue(150, 218, "rise", 0.030, 0.60, 0.30),
    cue(218, 316, "impact", 0.048, 0.84, 0.44),
    cue(316, 341, "afterglow", 0.010, 0.52, 0.16)
  ],
  signal: [
    cue(0, 62, "submerged", 0.008, 0.30, 0.20),
    cue(62, 160, "drift", 0.020, 0.46, 0.34),
    cue(160, 222, "rise", 0.035, 0.64, 0.46),
    cue(222, 360, "impact", 0.050, 0.80, 0.62),
    cue(360, 506, "drift", 0.026, 0.58, 0.44),
    cue(506, 548, "impact", 0.044, 0.88, 0.66),
    cue(548, 556, "afterglow", 0.008, 0.44, 0.20)
  ],
  spacecraft: [
    cue(0, 32, "submerged", 0.010, 0.34, 0.16),
    cue(32, 60, "rise", 0.026, 0.54, 0.26),
    cue(60, 90, "impact", 0.040, 0.72, 0.36),
    cue(90, 150, "drift", 0.030, 0.66, 0.40),
    cue(150, 180, "afterglow", 0.012, 0.46, 0.20)
  ],
  "new-create": [
    cue(0, 64, "submerged", 0.008, 0.34, 0.14),
    cue(64, 150, "rise", 0.025, 0.52, 0.24),
    cue(150, 232, "drift", 0.024, 0.58, 0.30),
    cue(232, 312, "impact", 0.050, 0.86, 0.52),
    cue(312, 334, "afterglow", 0.010, 0.50, 0.18)
  ],
  thundercloud: [
    cue(0, 80, "submerged", 0.016, 0.28, 0.18),
    cue(80, 114, "rise", 0.032, 0.46, 0.28),
    cue(114, 126, "impact", 0.075, 0.82, 0.50),
    cue(126, 218, "impact", 0.090, 0.94, 0.66),
    cue(218, 246, "rise", 0.046, 0.78, 0.48),
    cue(246, 253, "afterglow", 0.010, 0.42, 0.18)
  ],
  "space-home": [
    cue(0, 50, "submerged", 0.008, 0.40, 0.18),
    cue(50, 120, "drift", 0.020, 0.58, 0.30),
    cue(120, 182, "rise", 0.032, 0.72, 0.40),
    cue(182, 240, "impact", 0.046, 0.90, 0.54),
    cue(240, 282, "rise", 0.026, 0.78, 0.42),
    cue(282, 301, "afterglow", 0.010, 0.62, 0.24)
  ]
};

export function getPvDirection(track: TrackId, position: number): PvDirection {
  const timeline = PV_TIMELINES[track];
  const fallback: PvDirection = { from: 0, to: Number.POSITIVE_INFINITY, mood: "drift", camera: 0.02, light: 0.45, particles: 0.30 };
  return timeline.find(cueItem => position >= cueItem.from && position < cueItem.to) ?? timeline[timeline.length - 1] ?? fallback;
}
