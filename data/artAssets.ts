export type ArtAsset = {
  background?: string;
  character?: string;
  characterPosition?: "left" | "center" | "right";
  listeningArt?: string;
  overlay?: "sea" | "dawn" | "dusk" | "night" | "industrial" | "road";
  /** Only approved clean assets may be rendered at runtime. */
  approved?: boolean;
  /** Human-readable note for art production / review. */
  note?: string;
};

/**
 * Runtime art registry.
 *
 * IMPORTANT:
 * - baked UI/text/menu/map/waveform images must never be marked approved.
 * - background = clean 16:9 illustration only.
 * - character = transparent PNG/WebP only.
 * - UI is always rendered by React/CSS.
 *
 * Until a scene has reviewed production art, SceneVisual intentionally falls back
 * to the clean CSS environment for that art direction.
 */
export const ART_ASSETS: Record<string, ArtAsset> = {
  title: { overlay: "sea", approved: false, note: "Need clean 16:9 title key visual; no text/UI." },
  sea: { overlay: "sea", approved: false, note: "Need clean 16:9 information-sea background." },
  terminal: { overlay: "sea", approved: false, note: "Need terminal variant without baked UI." },
  dive: { overlay: "sea", approved: false, note: "Need DIVE-gate background variant." },
  city: { overlay: "dawn", approved: false, note: "Need clean City of Dawn morning background." },
  "city-glitch": { overlay: "dawn", approved: false, note: "Reuse/variant of approved city background later." },
  "city-investigation": { overlay: "dawn", approved: false, note: "Need investigation composition." },
  noa: { overlay: "dawn", approved: false, note: "Need transparent Noa standing art + clean city background." },
  "aurora-gate": { overlay: "night", approved: false },
  aurora: { overlay: "sea", approved: false },
  dusk: { overlay: "dusk", approved: false },
  night: { overlay: "night", approved: false },
  "load-road": { overlay: "road", approved: false },
  gadget: { overlay: "industrial", approved: false },
  "gadget-entry": { overlay: "industrial", approved: false },
  "gadget-machinery": { overlay: "industrial", approved: false },
  "gadget-bit": { overlay: "industrial", approved: false, note: "Need transparent BIT standing art." },
  "gadget-auth": { overlay: "industrial", approved: false },
  end: { overlay: "industrial", approved: false }
};
