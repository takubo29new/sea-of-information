import type { CSSProperties, SyntheticEvent } from "react";
import type { DialogueLine } from "@/engine/model";
import { ART_ASSETS } from "@/data/artAssets";
import { AudioReactiveSurface } from "@/components/visual/AudioReactiveSurface";

export type ReiExpression = "neutral" | "thinking" | "surprised" | "serious";
export type NoaExpression = "neutral" | "worried" | "surprised" | "soft-smile";
type Speaker = NonNullable<DialogueLine["speaker"]>;

export const REI_CHARACTER: Record<ReiExpression, string> = {
  neutral: "/art/production/characters/rei/rei-neutral.png",
  thinking: "/art/production/characters/rei/rei-thinking.png",
  surprised: "/art/production/characters/rei/rei-surprised.png",
  serious: "/art/production/characters/rei/rei-serious.png"
};

export const NOA_CHARACTER: Record<NoaExpression, string> = {
  neutral: "/art/production/characters/noa/noa-neutral.png",
  worried: "/art/production/characters/noa/noa-worried.png",
  surprised: "/art/production/characters/noa/noa-surprised.png",
  "soft-smile": "/art/production/characters/noa/noa-soft-smile.png"
};

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
  "gadget-auth": "serious",
  wish: "thinking",
  fantasy: "surprised",
  beautiful: "neutral",
  break: "serious",
  blavery: "serious",
  naked: "thinking",
  signal: "surprised",
  spacecraft: "serious",
  "new-create": "serious",
  thundercloud: "serious",
  "space-home": "neutral"
};

export const NOA_SCENE_EXPRESSION: Partial<Record<string, NoaExpression>> = {
  noa: "neutral",
  "city-investigation": "neutral",
  "aurora-gate": "worried",
  aurora: "surprised",
  dusk: "soft-smile",
  night: "soft-smile"
};

const DIALOGUE_CAST: Partial<Record<string, Speaker[]>> = {
  noa: ["REI", "NOA"],
  "city-investigation": ["REI", "NOA"],
  "aurora-gate": ["REI", "NOA"],
  aurora: ["REI", "NOA"],
  dusk: ["REI", "NOA"],
  night: ["REI", "NOA"],
  "gadget-bit": ["REI", "BIT"],
  "gadget-auth": ["REI", "BIT"],
  wish: ["REI", "BIT"],
  fantasy: ["REI", "BIT"],
  beautiful: ["REI", "BIT"],
  break: ["REI", "BIT"],
  blavery: ["REI", "BIT"],
  naked: ["REI", "BIT"],
  signal: ["REI", "BIT"],
  spacecraft: ["REI", "BIT"],
  "new-create": ["REI", "BIT", "DR_REI"],
  thundercloud: ["REI", "BIT", "DR_REI"],
  "space-home": ["REI", "BIT"]
};

const CHARACTER_APPROVAL: Record<Speaker, boolean> = {
  REI: true,
  NOA: true,
  BIT: false,
  AURORA: false,
  DR_REI: false,
  SYSTEM: false
};

function plannedCharacterPath(speaker: Speaker, artKey: string, reiExpression?: ReiExpression) {
  if (!CHARACTER_APPROVAL[speaker]) return undefined;
  if (speaker === "REI") {
    return REI_CHARACTER[reiExpression ?? REI_SCENE_EXPRESSION[artKey] ?? "neutral"];
  }
  if (speaker === "NOA") {
    return NOA_CHARACTER[NOA_SCENE_EXPRESSION[artKey] ?? "neutral"];
  }
  return undefined;
}

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
  const directedCast = speaker ? (DIALOGUE_CAST[artKey] ?? [speaker]) : [];
  const visibleActors = directedCast
    .map(actor => ({ speaker: actor, src: plannedCharacterPath(actor, artKey, reiExpression) }))
    .filter((actor): actor is { speaker: Speaker; src: string } => Boolean(actor.src));

  return (
    <div className={`sceneVisual sceneVisual-${asset?.overlay ?? "default"} sceneVisual-art-${artKey}${approved ? " sceneVisual-approved" : " sceneVisual-placeholder"}`} aria-hidden="true">
      <div className={`sceneVisualEnvironment sceneVisualEnvironment-${artKey}`} />
      {approved && asset?.background && (
        <img className="sceneVisualBackground" src={asset.background} alt="" draggable={false} onError={hideBrokenArt} />
      )}
      <div className="sceneVisualParallax sceneVisualParallaxBack" />
      <div className="sceneVisualLight" />
      <AudioReactiveSurface position={0} strength={0.55} />

      {visibleActors.length > 0 && (
        <div className={`dialogueCharacterStage dialogueCharacterStage-count-${visibleActors.length}`}>
          {visibleActors.map((actor, index) => {
            const active = actor.speaker === speaker;
            return (
              <img
                key={`${actor.speaker}-${actor.src}`}
                className={`dialogueCharacterActor dialogueCharacterActor-${actor.speaker.toLowerCase()} dialogueCharacterActor-${active ? "active" : "inactive"}`}
                style={{ "--actor-index": index } as CSSProperties}
                src={actor.src}
                alt=""
                draggable={false}
                onError={hideBrokenArt}
              />
            );
          })}
        </div>
      )}

      <div className="sceneVisualParallax sceneVisualParallaxFront" />
      <div className="sceneVisualVignette" />
    </div>
  );
}
