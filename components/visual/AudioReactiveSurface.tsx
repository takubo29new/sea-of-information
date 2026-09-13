"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { getActiveAudioReactiveLevels, type AudioReactiveLevels } from "@/engine/audio";
import type { TrackId } from "@/engine/model";
import { getPvDirection } from "@/data/pvTimelines";

const ZERO: AudioReactiveLevels = { energy: 0, bass: 0, mid: 0, treble: 0 };

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
  const [levels, setLevels] = useState<AudioReactiveLevels>(ZERO);

  useEffect(() => {
    let frame = 0;
    let active = true;
    const tick = () => {
      if (!active) return;
      setLevels(getActiveAudioReactiveLevels());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const direction = track ? getPvDirection(track, position) : undefined;
  const energy = Math.min(1, levels.energy * strength);
  const bass = Math.min(1, levels.bass * strength);
  const mid = Math.min(1, levels.mid * strength);
  const treble = Math.min(1, levels.treble * strength);
  const light = (direction?.light ?? 0.45) * (0.42 + energy * 1.28);
  const particle = (direction?.particles ?? 0.3) * (0.35 + treble * 1.65);
  const camera = cinematic ? (direction?.camera ?? 0.02) * (0.8 + bass * 1.4) : 0;

  const style = {
    "--audio-energy": energy.toFixed(3),
    "--audio-bass": bass.toFixed(3),
    "--audio-mid": mid.toFixed(3),
    "--audio-treble": treble.toFixed(3),
    "--audio-light": Math.min(1.55, light).toFixed(3),
    "--audio-particles": Math.min(1.55, particle).toFixed(3),
    "--audio-camera": camera.toFixed(4)
  } as CSSProperties;

  return (
    <div
      className={`audioReactiveSurface${cinematic ? " audioReactiveSurface-cinematic" : ""} audioReactiveSurface-${direction?.mood ?? "drift"}`}
      style={style}
      aria-hidden="true"
    >
      <div className="audioReactiveGlow audioReactiveGlow-bass" />
      <div className="audioReactiveGlow audioReactiveGlow-high" />
      <div className="audioReactiveBeams" />
      <div className="audioReactiveRings"><i /><i /><i /></div>
      <div className="audioReactiveWater" />
      <div className="audioReactiveStreaks"><i /><i /><i /><i /><i /><i /></div>
      <div className="audioReactiveParticles">
        {Array.from({ length: cinematic ? 46 : 18 }, (_, index) => <i key={index} />)}
      </div>
      <div className="audioReactiveFlash" />
    </div>
  );
}
