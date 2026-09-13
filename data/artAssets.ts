export type ArtAsset = {
  background?: string;
  character?: string;
  characterPosition?: "left" | "center" | "right";
  listeningArt?: string;
  overlay?: "sea" | "dawn" | "dusk" | "night" | "industrial" | "road";
};

/**
 * 実イラストをシーンロジックから分離して管理する。
 * 画像が未配置の場合でもランタイム進行は継続できる。
 */
export const ART_ASSETS: Record<string, ArtAsset> = {
  title: {
    background: "/art/title/title-keyvisual.webp",
    overlay: "sea"
  },
  sea: {
    background: "/art/sea/sea-main.webp",
    listeningArt: "/art/sea/sea-listening.webp",
    overlay: "sea"
  },
  terminal: {
    background: "/art/sea/sea-terminal.webp",
    overlay: "sea"
  },
  dive: {
    background: "/art/sea/sea-dive.webp",
    overlay: "sea"
  },
  city: {
    background: "/art/city/city-morning.webp",
    overlay: "dawn"
  },
  "city-glitch": {
    background: "/art/city/city-loop.webp",
    overlay: "dawn"
  },
  "city-investigation": {
    background: "/art/city/city-investigation.webp",
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
    background: "/art/city/aurora-gate.webp",
    overlay: "night"
  },
  aurora: {
    background: "/art/city/aurora-core.webp",
    overlay: "sea"
  },
  dusk: {
    background: "/art/city/city-dusk.webp",
    character: "/art/characters/noa/noa-smile.webp",
    characterPosition: "right",
    overlay: "dusk"
  },
  night: {
    background: "/art/city/city-night.webp",
    overlay: "night"
  },
  "load-road": {
    background: "/art/load-road/load-road-main.webp",
    listeningArt: "/art/load-road/load-road-listening.webp",
    overlay: "road"
  },

  /* Listening Stage用の共通Gadgetキー */
  gadget: {
    background: "/art/gadget/gadget-main.webp",
    listeningArt: "/art/gadget/gadget-listening.webp",
    overlay: "industrial"
  },

  /* 現在のScene.artと一致するキー */
  "gadget-entry": {
    background: "/art/gadget/gadget-main.webp",
    overlay: "industrial"
  },
  "gadget-machinery": {
    background: "/art/gadget/gadget-machinery.webp",
    overlay: "industrial"
  },
  "gadget-bit": {
    background: "/art/gadget/gadget-main.webp",
    character: "/art/characters/bit/bit-normal.webp",
    characterPosition: "right",
    overlay: "industrial"
  },
  "gadget-auth": {
    background: "/art/gadget/gadget-scan.webp",
    character: "/art/characters/bit/bit-warning.webp",
    characterPosition: "right",
    overlay: "industrial"
  },
  end: {
    background: "/art/gadget/gadget-scan.webp",
    overlay: "industrial"
  }
};
