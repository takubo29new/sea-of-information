import { TRACK_META } from "@/engine/audio";
import type { TrackId } from "@/engine/model";

export function TrackTransition({
  current,
  next,
  onConfirm,
  onCancel
}: {
  current: TrackId;
  next: TrackId;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="trackTransitionBackdrop" role="dialog" aria-modal="true" aria-label="次の曲へ進む">
      <section className="trackTransitionCard">
        <small>NEXT ARCHIVE</small>
        <div className="trackTransitionRoute">
          <div><span>NOW</span><strong>{TRACK_META[current].title}</strong></div>
          <i>→</i>
          <div><span>NEXT</span><strong>{TRACK_META[next].title}</strong></div>
        </div>
        <p>ここから次の曲・次の場面へ移ります。</p>
        <div className="trackTransitionActions">
          <button onClick={onCancel}>もう少しこの場面にいる</button>
          <button className="primary" onClick={onConfirm}>次の曲へ進む</button>
        </div>
      </section>
    </div>
  );
}
