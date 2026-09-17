import type { SyntheticEvent } from "react";
import { ART_ASSETS } from "@/data/artAssets";
import { getActiveListeningCue, LISTENING_TIMELINES, type ListeningTimeline } from "@/data/listeningCues";
import { AudioReactiveSurface } from "@/components/visual/AudioReactiveSurface";
import { getPvDirection } from "@/data/pvTimelines";

function hideBrokenArt(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

function formatTime(value: number) {
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

export function ListeningStage({
  track,
  title,
  position,
  duration,
  unlockAt,
  phase,
  canSkip,
  onSkip,
  characterSrc
}: {
  track: ListeningTimeline["track"];
  title: string;
  position: number;
  duration: number;
  unlockAt: number;
  phase: "listening" | "ready";
  canSkip?: boolean;
  onSkip?: () => void;
  characterSrc?: string;
}) {
  const timeline = LISTENING_TIMELINES[track];
  const activeCue = getActiveListeningCue(track, position);
  const pvDirection = getPvDirection(track, position);
  const asset = ART_ASSETS[timeline.artKey];
  const art = asset?.approved ? (asset.listeningArt ?? asset.background) : undefined;
  const progress = Math.min(100, Math.max(0, (position / duration) * 100));

  return (
    <section
      className={`listeningStage listeningStage-track-${track} listeningStage-simple listeningStage-${phase} listeningStage-${activeCue?.mood ?? "calm"} listeningStage-pv-${pvDirection.mood}${art ? " listeningStage-hasArt" : ""}${characterSrc ? " listeningStage-withCharacter" : ""}`}
      aria-live="polite"
    >
      <div className="listeningStageArtwork">
        {art && <img src={art} alt="" draggable={false} onError={hideBrokenArt} />}
        <div className="listeningStageAtmosphere" />
        <div className="listeningStageGrain" />
      </div>

      <AudioReactiveSurface track={track} position={position} strength={1.9} cinematic />

      {characterSrc && (
        <img
          className="listeningStageCharacter"
          src={characterSrc}
          alt=""
          draggable={false}
          onError={hideBrokenArt}
          aria-hidden="true"
        />
      )}

      <div className="listeningStageChrome">
        <p className="listeningStageMode">{phase === "ready" ? "SCENE UNLOCKED" : "NOW LISTENING"}</p>
        <h2>{title}</h2>
        <p className="listeningStageStoryText">
          {phase === "ready"
            ? "音が、次の場面へつながった。"
            : activeCue?.text ?? timeline.introText}
        </p>

        <div className="listeningStageWave" aria-hidden="true">
          {Array.from({ length: 64 }, (_, index) => (
            <i key={index} style={{ height: `${16 + ((index * 29 + 11) % 68)}%` }} />
          ))}
        </div>

        <div className="listeningStageProgress" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
          <b style={{ left: `${Math.min(100, Math.max(0, (unlockAt / duration) * 100))}%` }} />
        </div>

        <div className="listeningStageTimes">
          <span>{formatTime(position)}</span>
          <span>次の場面 {formatTime(unlockAt)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="listeningStageFooter">
          <p className="listeningStageHint">
            {phase === "ready"
              ? "次の操作へ戻ります。"
              : canSkip
                ? "この区間は一度体験済みです。必要ならスキップできます。"
                : "いまは音楽そのものが物語を進めています。"}
          </p>
          {phase === "listening" && canSkip && onSkip && <button className="listeningSkip" onClick={onSkip}>SKIP LISTENING</button>}
        </div>
      </div>
    </section>
  );
}
