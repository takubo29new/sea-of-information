export type ArtAsset = {
  background?: string;
  character?: string;
  characterPosition?: "left" | "center" | "right";
  listeningArt?: string;
  overlay?: "sea" | "dawn" | "dusk" | "night" | "industrial" | "road";
};

/**
 * v0.7.2 visual reset
 *
 * The first generated art pack contained baked text/UI and opaque character cards.
 * Those files are intentionally not used at runtime now. SceneVisual renders a clean,
 * art-direction-specific environment layer until proper clean background/transparent
 * character assets are produced.
 */
export const ART_ASSETS: Record<string, ArtAsset> = {
  title: { overlay: "sea" },
  sea: { overlay: "sea" },
  terminal: { overlay: "sea" },
  dive: { overlay: "sea" },
  city: { overlay: "dawn" },
  "city-glitch": { overlay: "dawn" },
  "city-investigation": { overlay: "dawn" },
  noa: { overlay: "dawn" },
  "aurora-gate": { overlay: "night" },
  aurora: { overlay: "sea" },
  dusk: { overlay: "dusk" },
  night: { overlay: "night" },
  "load-road": { overlay: "road" },
  gadget: { overlay: "industrial" },
  "gadget-entry": { overlay: "industrial" },
  "gadget-machinery": { overlay: "industrial" },
  "gadget-bit": { overlay: "industrial" },
  "gadget-auth": { overlay: "industrial" },
  end: { overlay: "industrial" }
};
