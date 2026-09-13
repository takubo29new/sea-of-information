import type { SyntheticEvent } from "react";
import { ART_ASSETS } from "@/data/artAssets";
import { getActiveListeningCue, LISTENING_TIMELINES, type ListeningTimeline } from "@/data/listeningCues";

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
  phase
}: {
  track: ListeningTimeline["track"];
  title: string;
  position: number;
  duration: number;
  unlockAt: number;
  phase: "listening" | "ready";
}) {
  const timeline = LISTENING_TIMELINES[track];
  const activeCue = getActiveListeningCue(track, position);
  const asset = ART_ASSETS[timeline.artKey];
  const art = asset?.listeningArt ?? asset?.background;
  const progress = Math.min(100, Math.max(0, (position / duration) * 100));

  return (
    <section
      className={`listeningStage listeningStage-${phase} listeningStage-${activeCue?.mood ?? "calm"} listeningCamera-${activeCue?.camera ?? "still"}`}
      aria-live="polite"
    >
      <div className="listeningStageArtwork">
        {art && <img src={art} alt="" draggable={false} onError={hideBrokenArt} />}
        <div className="listeningStageAtmosphere" />
        <div className="listeningStageGrain" />
      </div>

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

        <p className="listeningStageHint">
          {phase === "ready"
            ? "このまま次の場面へ戻ります。"
            : "操作不能ではありません。いまは音楽そのものが物語を進めています。"}
        </p>
      </div>
    </section>
  );
}
