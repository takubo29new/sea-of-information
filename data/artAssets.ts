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
 * Paths below are production targets. While approved=false, runtime intentionally
 * ignores them and keeps the clean CSS fallback.
 */
export const ART_ASSETS: Record<string, ArtAsset> = {
  title: {
    background: "/art/production/title/title-background.webp",
    overlay: "sea",
    approved: true,
    note: "Approved production title background; UI remains React/CSS."
  },
  sea: {
    background: "/art/production/sea/sea-background.webp",
    character: "/art/production/characters/rei/rei-neutral.png",
    characterPosition: "right",
    overlay: "sea",
    approved: true,
    note: "Approved clean information-sea background + transparent Rei candidate."
  },
  terminal: {
    background: "/art/production/sea/sea-terminal.webp",
    character: "/art/production/characters/rei/rei-thinking.webp",
    characterPosition: "left",
    overlay: "sea",
    approved: false
  },
  dive: {
    background: "/art/production/sea/sea-dive.webp",
    character: "/art/production/characters/rei/rei-neutral.png",
    characterPosition: "left",
    overlay: "sea",
    approved: false
  },
  city: {
    background: "/art/production/city/city-morning.webp",
    character: "/art/production/characters/rei/rei-neutral.png",
    characterPosition: "left",
    overlay: "dawn",
    approved: false,
    note: "Clock / child / birds / bakery landmarks must align with hotspots."
  },
  "city-glitch": {
    background: "/art/production/city/city-glitch.webp",
    character: "/art/production/characters/rei/rei-thinking.webp",
    characterPosition: "left",
    overlay: "dawn",
    approved: false
  },
  "city-investigation": {
    background: "/art/production/city/city-morning.webp",
    character: "/art/production/characters/noa/noa-neutral.webp",
    characterPosition: "right",
    overlay: "dawn",
    approved: false
  },
  noa: {
    background: "/art/production/city/city-morning.webp",
    character: "/art/production/characters/noa/noa-neutral.webp",
    characterPosition: "right",
    overlay: "dawn",
    approved: false,
    note: "Noa must keep orange scarf."
  },
  "aurora-gate": {
    background: "/art/production/city/city-aurora-gate.webp",
    overlay: "night",
    approved: false
  },
  aurora: {
    background: "/art/production/city/city-aurora.webp",
    character: "/art/production/characters/noa/noa-neutral.webp",
    characterPosition: "right",
    overlay: "sea",
    approved: false
  },
  dusk: {
    background: "/art/production/city/city-dusk.webp",
    character: "/art/production/characters/noa/noa-smile.webp",
    characterPosition: "right",
    overlay: "dusk",
    approved: false
  },
  night: {
    background: "/art/production/city/city-night.webp",
    character: "/art/production/characters/noa/noa-smile.webp",
    characterPosition: "right",
    overlay: "night",
    approved: false
  },
  "load-road": {
    background: "/art/production/load-road/load-road-background.webp",
    character: "/art/production/characters/rei/rei-neutral.png",
    characterPosition: "left",
    overlay: "road",
    approved: false
  },
  gadget: { overlay: "industrial", approved: false },
  "gadget-entry": {
    background: "/art/production/gadget/gadget-entry.webp",
    character: "/art/production/characters/rei/rei-neutral.png",
    characterPosition: "left",
    overlay: "industrial",
    approved: false
  },
  "gadget-machinery": {
    background: "/art/production/gadget/gadget-machinery.webp",
    character: "/art/production/characters/rei/rei-thinking.webp",
    characterPosition: "left",
    overlay: "industrial",
    approved: false
  },
  "gadget-bit": {
    background: "/art/production/gadget/gadget-machinery.webp",
    character: "/art/production/characters/bit/bit-normal.webp",
    characterPosition: "right",
    overlay: "industrial",
    approved: false,
    note: "BIT is a small industrial robot, not a humanoid girl."
  },
  "gadget-auth": {
    background: "/art/production/gadget/gadget-auth.webp",
    character: "/art/production/characters/bit/bit-alert.webp",
    characterPosition: "right",
    overlay: "industrial",
    approved: false
  },
  end: { overlay: "industrial", approved: false }
};
