"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { getActiveAudioReactiveLevels } from "@/engine/audio";
import type { TrackId } from "@/engine/model";
import { getPvDirection } from "@/data/pvTimelines";

function trackClass(track?: TrackId) {
  return track ? ` audioReactiveSurface-track-${track}` : "";
}

export function AudioReactiveSurface({
  track,
  position,
  strength = 1,
  cinematic = false
}: {
  track?: TrackId;
  position: number;
  strength?: number;
  cinematic?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const direction = track ? getPvDirection(track, position) : undefined;
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const initialStyle = useMemo(() => ({
    "--audio-energy": "0",
    "--audio-bass": "0",
    "--audio-mid": "0",
    "--audio-treble": "0",
    "--audio-light": "0.18",
    "--audio-particles": "0.12",
    "--audio-camera": "0"
  } as CSSProperties), []);

  useEffect(() => {
    let frame = 0;
    let active = true;
    let lastUpdate = 0;
    let smoothEnergy = 0;
    let smoothBass = 0;
    let smoothMid = 0;
    let smoothTreble = 0;

    const tick = (now: number) => {
      if (!active) return;

      // 30fps analysis is visually smooth after CSS interpolation and avoids
      // forcing expensive style/filter updates on every display refresh.
      if (now - lastUpdate >= 33) {
        lastUpdate = now;
        const levels = getActiveAudioReactiveLevels();
        const smoothing = 0.24;
        smoothEnergy += (Math.min(1, levels.energy * strength) - smoothEnergy) * smoothing;
        smoothBass += (Math.min(1, levels.bass * strength) - smoothBass) * smoothing;
        smoothMid += (Math.min(1, levels.mid * strength) - smoothMid) * smoothing;
        smoothTreble += (Math.min(1, levels.treble * strength) - smoothTreble) * smoothing;

        const currentDirection = directionRef.current;
        const light = (currentDirection?.light ?? 0.45) * (0.42 + smoothEnergy * 1.28);
        const particle = (currentDirection?.particles ?? 0.3) * (0.35 + smoothTreble * 1.65);
        const camera = cinematic ? (currentDirection?.camera ?? 0.02) * (0.8 + smoothBass * 1.4) : 0;
        const style = rootRef.current?.style;

        if (style) {
          style.setProperty("--audio-energy", smoothEnergy.toFixed(3));
          style.setProperty("--audio-bass", smoothBass.toFixed(3));
          style.setProperty("--audio-mid", smoothMid.toFixed(3));
          style.setProperty("--audio-treble", smoothTreble.toFixed(3));
          style.setProperty("--audio-light", Math.min(1.55, light).toFixed(3));
          style.setProperty("--audio-particles", Math.min(1.55, particle).toFixed(3));
          style.setProperty("--audio-camera", camera.toFixed(4));
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [cinematic, strength]);

  return (
    <div
      ref={rootRef}
      className={`audioReactiveSurface${cinematic ? " audioReactiveSurface-cinematic" : ""}${trackClass(track)} audioReactiveSurface-${direction?.mood ?? "drift"}`}
      style={initialStyle}
      aria-hidden="true"
    >
      <div className="audioReactiveGlow audioReactiveGlow-bass" />
      <div className="audioReactiveGlow audioReactiveGlow-high" />
      <div className="audioReactiveBeams" />

      <div className="audioReactiveSea"><i /><i /><i /></div>
      <div className="audioReactiveDawn"><i /><i /><i /><i /></div>
      <div className="audioReactiveRoad"><i /><i /><i /><i /><i /></div>
      <div className="audioReactiveGadget"><i /><i /><i /><i /></div>

      <div className="audioReactiveParticles">
        {Array.from({ length: cinematic ? 28 : 12 }, (_, index) => <i key={index} />)}
      </div>
      <div className="audioReactiveFlash" />
    </div>
  );
}
