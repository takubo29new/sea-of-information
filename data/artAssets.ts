export type ArtAsset = {
  background?: string;
  character?: string;
  characterPosition?: "left" | "center" | "right";
  listeningArt?: string;
  overlay?: "sea" | "dawn" | "dusk" | "night" | "industrial" | "road";
};

/**
 * 実イラストをシーンロジックから分離して管理する。
 * 専用差分が未配置の場面は、同章の実画像を再利用し、
 * overlay / Listening Stage 側の演出で見え方を変える。
 */
export const ART_ASSETS: Record<string, ArtAsset> = {
  title: {
    background: "/art/title/title-keyvisual.webp",
    overlay: "sea"
  },
  sea: {
    background: "/art/sea/sea-main.webp",
    character: "/art/characters/rei/rei-neutral.webp",
    characterPosition: "center",
    listeningArt: "/art/sea/sea-main.webp",
    overlay: "sea"
  },
  terminal: {
    background: "/art/sea/sea-main.webp",
    character: "/art/characters/rei/rei-neutral.webp",
    characterPosition: "left",
    overlay: "sea"
  },
  dive: {
    background: "/art/sea/sea-main.webp",
    character: "/art/characters/rei/rei-neutral.webp",
    characterPosition: "center",
    overlay: "sea"
  },
  city: {
    background: "/art/city/city-morning.webp",
    overlay: "dawn"
  },
  "city-glitch": {
    background: "/art/city/city-morning.webp",
    overlay: "dawn"
  },
  "city-investigation": {
    background: "/art/city/city-morning.webp",
    overlay: "dawn"
  },
  noa: {
    background: "/art/city/city-morning.webp",
    character: "/art/characters/noa/noa-neutral.webp",
    characterPosition: "right",
    listeningArt: "/art/city/city-listening.webp",
    overlay: "dawn"
  },
  "aurora-gate": {
    background: "/art/city/city-morning.webp",
    overlay: "night"
  },
  aurora: {
    background: "/art/city/city-morning.webp",
    overlay: "sea"
  },
  dusk: {
    background: "/art/city/city-morning.webp",
    character: "/art/characters/noa/noa-neutral.webp",
    characterPosition: "right",
    overlay: "dusk"
  },
  night: {
    background: "/art/city/city-morning.webp",
    overlay: "night"
  },
  "load-road": {
    background: "/art/load-road/load-road-main.webp",
    listeningArt: "/art/load-road/load-road-listening.webp",
    overlay: "road"
  },
  gadget: {
    background: "/art/gadget/gadget-main.webp",
    listeningArt: "/art/gadget/gadget-listening.webp",
    overlay: "industrial"
  },
  "gadget-entry": {
    background: "/art/gadget/gadget-main.webp",
    overlay: "industrial"
  },
  "gadget-machinery": {
    background: "/art/gadget/gadget-main.webp",
    overlay: "industrial"
  },
  "gadget-bit": {
    background: "/art/gadget/gadget-main.webp",
    character: "/art/characters/bit/bit-normal.webp",
    characterPosition: "right",
    overlay: "industrial"
  },
  "gadget-auth": {
    background: "/art/gadget/gadget-main.webp",
    character: "/art/characters/bit/bit-normal.webp",
    characterPosition: "right",
    overlay: "industrial"
  },
  end: {
    background: "/art/gadget/gadget-main.webp",
    overlay: "industrial"
  }
};
