import type { SyntheticEvent } from "react";
import type { DialogueLine } from "@/engine/model";
import { ART_ASSETS } from "@/data/artAssets";
import { AudioReactiveSurface } from "@/components/visual/AudioReactiveSurface";

export type ReiExpression = "neutral" | "thinking" | "surprised" | "serious";

export const REI_CHARACTER: Record<ReiExpression, string> = {
  neutral: "/art/production/characters/rei/rei-neutral.png",
  thinking: "/art/production/characters/rei/rei-thinking.png",
  surprised: "/art/production/characters/rei/rei-surprised.png",
  serious: "/art/production/characters/rei/rei-serious.png"
};

const SPEAKER_CHARACTER: Partial<Record<NonNullable<DialogueLine["speaker"]>, string>> = {
  REI: REI_CHARACTER.neutral
};

/** Expression direction for the current vertical slice. */
export const REI_SCENE_EXPRESSION: Partial<Record<string, ReiExpression>> = {
  sea: "neutral",
  terminal: "thinking",
  dive: "serious",
  city: "neutral",
  "city-glitch": "surprised",
  "load-road": "neutral",
  "gadget-entry": "neutral",
  "gadget-machinery": "thinking",
  "gadget-bit": "surprised",
  "gadget-auth": "serious"
};

export function getReiCharacterForArt(artKey: string, expression?: ReiExpression) {
  const resolved = expression ?? REI_SCENE_EXPRESSION[artKey];
  return resolved ? REI_CHARACTER[resolved] : undefined;
}

function hideBrokenArt(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

export function SceneVisual({
  artKey,
  speaker,
  reiExpression
}: {
  artKey: string;
  speaker?: DialogueLine["speaker"];
  reiExpression?: ReiExpression;
}) {
  const asset = ART_ASSETS[artKey];
  const approved = Boolean(asset?.approved);

  const speakerCharacter = speaker === "REI"
    ? REI_CHARACTER[reiExpression ?? REI_SCENE_EXPRESSION[artKey] ?? "neutral"]
    : (speaker ? SPEAKER_CHARACTER[speaker] : undefined);

  // Exploration mode intentionally renders no standee. Character art appears only
  // while dialogue has an active speaker, keeping investigation hotspots unobstructed.
  const sceneCharacter = speaker && approved ? asset?.character : undefined;
  const character = speakerCharacter ?? sceneCharacter;
  const characterPosition = speakerCharacter
    ? "right"
    : (asset?.characterPosition ?? "center");
  const isReiCharacter = speaker === "REI";

  return (
    <div className={`sceneVisual sceneVisual-${asset?.overlay ?? "default"} sceneVisual-art-${artKey}${approved ? " sceneVisual-approved" : " sceneVisual-placeholder"}`} aria-hidden="true">
      <div className={`sceneVisualEnvironment sceneVisualEnvironment-${artKey}`} />
      {approved && asset?.background && (
        <img
          className="sceneVisualBackground"
          src={asset.background}
          alt=""
          draggable={false}
          onError={hideBrokenArt}
        />
      )}
      <div className="sceneVisualParallax sceneVisualParallaxBack" />
      <div className="sceneVisualLight" />
      <AudioReactiveSurface position={0} strength={0.55} />
      {character && (
        <img
          key={character}
          className={`sceneVisualCharacter sceneVisualCharacter-${characterPosition}${isReiCharacter ? " sceneVisualCharacter-rei" : ""}`}
          src={character}
          alt=""
          draggable={false}
          onError={hideBrokenArt}
        />
      )}
      <div className="sceneVisualParallax sceneVisualParallaxFront" />
      <div className="sceneVisualVignette" />
    </div>
  );
}
