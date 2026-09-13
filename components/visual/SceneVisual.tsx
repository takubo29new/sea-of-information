import type { SyntheticEvent } from "react";
import type { DialogueLine } from "@/engine/model";
import { ART_ASSETS } from "@/data/artAssets";

const REI_NEUTRAL = "/art/production/characters/rei/rei-neutral.png";

const SPEAKER_CHARACTER: Partial<Record<NonNullable<DialogueLine["speaker"]>, string>> = {
  REI: REI_NEUTRAL
};

const REI_SCENE_ART_KEYS = new Set([
  "sea",
  "terminal",
  "dive",
  "city",
  "city-glitch",
  "load-road",
  "gadget-entry",
  "gadget-machinery"
]);

function hideBrokenArt(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

export function SceneVisual({
  artKey,
  speaker
}: {
  artKey: string;
  speaker?: DialogueLine["speaker"];
}) {
  const asset = ART_ASSETS[artKey];
  const approved = Boolean(asset?.approved);
  const speakerCharacter = speaker ? SPEAKER_CHARACTER[speaker] : undefined;
  const sceneCharacter = approved ? asset?.character : undefined;
  const fallbackRei = REI_SCENE_ART_KEYS.has(artKey) ? REI_NEUTRAL : undefined;
  const character = speakerCharacter ?? sceneCharacter ?? fallbackRei;
  const characterPosition = speakerCharacter || fallbackRei ? "right" : (asset?.characterPosition ?? "center");
  const isFallbackCharacter = Boolean(fallbackRei && !sceneCharacter && !speakerCharacter);

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
          className={`sceneVisualCharacter sceneVisualCharacter-${characterPosition}${speakerCharacter ? " sceneVisualCharacter-speaker" : ""}${isFallbackCharacter ? " sceneVisualCharacter-fallback" : ""}`}
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
