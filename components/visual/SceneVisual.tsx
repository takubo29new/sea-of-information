import { ART_ASSETS } from "@/data/artAssets";

function hideBrokenArt(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

export function SceneVisual({ artKey }: { artKey: string }) {
  const asset = ART_ASSETS[artKey];

  return (
    <div className={`sceneVisual sceneVisual-${asset?.overlay ?? "default"}`} aria-hidden="true">
      {asset?.background && (
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
      {asset?.character && (
        <img
          className={`sceneVisualCharacter sceneVisualCharacter-${asset.characterPosition ?? "center"}`}
          src={asset.character}
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
