import type { SyntheticEvent } from "react";
import type { DialogueLine } from "@/engine/model";
import { ART_ASSETS } from "@/data/artAssets";

type ReiExpression = "neutral" | "thinking" | "surprised" | "serious";

const REI_CHARACTER: Record<ReiExpression, string> = {
  neutral: "/art/production/characters/rei/rei-neutral.png",
  thinking: "/art/production/characters/rei/rei-thinking.png",
  surprised: "/art/production/characters/rei/rei-surprised.png",
  serious: "/art/production/characters/rei/rei-serious.png"
};

const SPEAKER_CHARACTER: Partial<Record<NonNullable<DialogueLine["speaker"]>, string>> = {
  REI: REI_CHARACTER.neutral
};

/**
 * Expression direction for the current vertical slice.
 * This keeps character art expressive even before dialogue-line-specific
 * expression metadata is introduced.
 */
const REI_SCENE_EXPRESSION: Partial<Record<string, ReiExpression>> = {
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

  const sceneExpression = reiExpression ?? REI_SCENE_EXPRESSION[artKey];
  const fallbackRei = sceneExpression ? REI_CHARACTER[sceneExpression] : undefined;
  const speakerCharacter = speaker === "REI"
    ? REI_CHARACTER[reiExpression ?? sceneExpression ?? "neutral"]
    : (speaker ? SPEAKER_CHARACTER[speaker] : undefined);
  const sceneCharacter = approved ? asset?.character : undefined;
  const character = speakerCharacter ?? fallbackRei ?? sceneCharacter;
  const characterPosition = speakerCharacter || fallbackRei
    ? "right"
    : (asset?.characterPosition ?? "center");
  const isReiCharacter = Boolean(speakerCharacter || fallbackRei);

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
