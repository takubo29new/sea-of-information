"use client";

import { useEffect, useRef, useState } from "react";
import { getActiveAudioPlaybackState } from "@/engine/audio";

const UNLOCK_AT = 125;
const HUD_INTERVAL = 180;

type EntityKind = "noise" | "node" | "memory";
type Entity = {
  id: string;
  kind: EntityKind;
  x: number;
  y: number;
  vx: number;
  hp?: number;
  memoryIndex?: number;
  tutorial?: boolean;
};
type Shot = { x: number; y: number; vx: number };
type HudState = {
  sync: number;
  memories: number;
  repaired: number;
  damage: number;
  progress: number;
  phase: string;
};

type GameRuntime = {
  player: { x: number; y: number };
  sync: number;
  memories: boolean[];
  repaired: number;
  damage: number;
  resyncs: number;
  entities: Entity[];
  shots: Shot[];
  spawned: Set<string>;
  origin: number | null;
  previousAudioPosition: number;
  lastShotAt: number;
  lastHudAt: number;
  invulnerableUntil: number;
  completeSaved: boolean;
};

const MEMORY_ECHOES = [
  "パン屋のシャッターが閉まる音。朝だけだった街に、初めて夜が来た。",
  "駅のホームに最後のアナウンスが残っている。『本日の運行は終了しました』。",
  "Noaの声が一瞬だけ混ざる。『……またね。』"
];

function isLoadRoadActive() {
  return Boolean(document.querySelector(".gameScreen.art-load-road"));
}

function isOverlayOpen() {
  return Boolean(document.querySelector(".dialogueBox, .modalBackdrop, .listeningStage, .trackTransition"));
}

function makeRuntime(): GameRuntime {
  return {
    player: { x: 0.2, y: 0.5 },
    sync: 100,
    memories: [false, false, false],
    repaired: 0,
    damage: 0,
    resyncs: 0,
    entities: [],
    shots: [],
    spawned: new Set<string>(),
    origin: null,
    previousAudioPosition: 0,
    lastShotAt: 0,
    lastHudAt: 0,
    invulnerableUntil: 0,
    completeSaved: false
  };
}

function phaseFor(elapsed: number) {
  if (elapsed < 5) return "DIVE LINK";
  if (elapsed < 11) return "MOVE";
  if (elapsed < 18) return "MEMORY";
  if (elapsed < 25) return "NOISE";
  if (elapsed < 33) return "SYNC SHOT";
  if (elapsed < 92) return "ROUTE STABILIZE";
  return "FINAL APPROACH";
}

function spawn(runtime: GameRuntime, entity: Entity) {
  if (runtime.spawned.has(entity.id)) return;
  runtime.spawned.add(entity.id);
  runtime.entities.push(entity);
}

function spawnTimeline(runtime: GameRuntime, elapsed: number) {
  if (elapsed >= 11) spawn(runtime, { id: "memory-0", kind: "memory", x: 1.08, y: 0.5, vx: -0.12, memoryIndex: 0, tutorial: true });
  if (elapsed >= 18) spawn(runtime, { id: "noise-tutorial", kind: "noise", x: 1.08, y: 0.34, vx: -0.16, tutorial: true });
  if (elapsed >= 25) spawn(runtime, { id: "node-tutorial", kind: "node", x: 1.08, y: 0.58, vx: -0.105, hp: 2, tutorial: true });
  if (elapsed >= 58) spawn(runtime, { id: "memory-1", kind: "memory", x: 1.08, y: 0.68, vx: -0.13, memoryIndex: 1 });
  if (elapsed >= 100) spawn(runtime, { id: "memory-2", kind: "memory", x: 1.08, y: 0.42, vx: -0.14, memoryIndex: 2 });

  if (elapsed < 32) return;
  const noiseIndex = Math.floor((elapsed - 32) / 3.7);
  for (let i = Math.max(0, noiseIndex - 2); i <= noiseIndex; i += 1) {
    const at = 32 + i * 3.7;
    if (elapsed < at) continue;
    const intensity = elapsed > 78 ? 1.2 : 1;
    spawn(runtime, {
      id: `noise-${i}`,
      kind: "noise",
      x: 1.08,
      y: 0.18 + (((i * 47 + 19) % 66) / 100),
      vx: -(0.15 + (i % 3) * 0.018) * intensity
    });
  }

  const nodeIndex = Math.floor((elapsed - 38) / 8.5);
  for (let i = Math.max(0, nodeIndex - 1); i <= nodeIndex; i += 1) {
    const at = 38 + i * 8.5;
    if (elapsed < at) continue;
    spawn(runtime, {
      id: `node-${i}`,
      kind: "node",
      x: 1.08,
      y: 0.22 + (((i * 61 + 7) % 58) / 100),
      vx: -0.09,
      hp: elapsed > 82 ? 3 : 2
    });
  }
}

function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = Math.PI / 3 * i;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawStage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  runtime: GameRuntime,
  elapsed: number,
  paused: boolean
) {
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width, height);

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = "rgba(118,220,255,.24)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i += 1) {
    const y = height * (0.18 + i * 0.08);
    ctx.beginPath();
    ctx.moveTo(width * 0.08, y);
    ctx.lineTo(width, y - height * 0.04);
    ctx.stroke();
  }
  ctx.restore();

  for (const entity of runtime.entities) {
    const x = entity.x * width;
    const y = entity.y * height;
    if (entity.kind === "noise") {
      const r = scale * 0.022;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(elapsed * 0.9 + x * 0.002);
      ctx.strokeStyle = "rgba(255,105,91,.95)";
      ctx.fillStyle = "rgba(255,67,54,.16)";
      ctx.shadowColor = "rgba(255,72,55,.6)";
      ctx.shadowBlur = 18;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r, -r * 0.2);
      ctx.lineTo(-r * 0.2, -r);
      ctx.lineTo(r * 0.8, -r * 0.55);
      ctx.lineTo(r, r * 0.35);
      ctx.lineTo(r * 0.1, r);
      ctx.lineTo(-r * 0.85, r * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, -r * 0.55);
      ctx.lineTo(r * 0.45, r * 0.6);
      ctx.moveTo(r * 0.52, -r * 0.52);
      ctx.lineTo(-r * 0.5, r * 0.48);
      ctx.stroke();
      ctx.restore();
    } else if (entity.kind === "memory") {
      const r = scale * 0.016;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.strokeStyle = "rgba(187,247,255,.98)";
      ctx.fillStyle = "rgba(91,218,255,.2)";
      ctx.shadowColor = "rgba(97,224,255,.9)";
      ctx.shadowBlur = 24;
      ctx.lineWidth = 2;
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.strokeRect(-r, -r, r * 2, r * 2);
      ctx.restore();
    } else {
      const r = scale * 0.025;
      ctx.save();
      ctx.strokeStyle = "rgba(255,201,91,.96)";
      ctx.fillStyle = "rgba(255,177,52,.12)";
      ctx.shadowColor = "rgba(255,188,65,.58)";
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2;
      drawHex(ctx, x, y, r);
      ctx.fill();
      ctx.stroke();
      drawHex(ctx, x, y, r * 0.48);
      ctx.stroke();
      ctx.restore();
    }

    if (entity.tutorial) {
      ctx.save();
      ctx.font = `${Math.max(10, Math.round(scale * 0.013))}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.fillStyle = entity.kind === "noise" ? "#ffb1a6" : entity.kind === "node" ? "#ffd88f" : "#b9f4ff";
      const label = entity.kind === "noise" ? "NOISE — AVOID" : entity.kind === "node" ? "BROKEN NODE — SPACE" : "MEMORY FRAGMENT — COLLECT";
      ctx.fillText(label, x, y - scale * 0.045);
      ctx.restore();
    }
  }

  ctx.save();
  ctx.strokeStyle = "rgba(181,244,255,.95)";
  ctx.shadowColor = "rgba(105,225,255,.8)";
  ctx.shadowBlur = 10;
  ctx.lineWidth = Math.max(1.5, scale * 0.002);
  for (const shot of runtime.shots) {
    ctx.beginPath();
    ctx.moveTo(shot.x * width - scale * 0.02, shot.y * height);
    ctx.lineTo(shot.x * width + scale * 0.01, shot.y * height);
    ctx.stroke();
  }
  ctx.restore();

  const px = runtime.player.x * width;
  const py = runtime.player.y * height;
  const size = scale * 0.025;
  ctx.save();
  ctx.translate(px, py);
  ctx.strokeStyle = "rgba(220,250,255,.98)";
  ctx.fillStyle = "rgba(77,198,240,.2)";
  ctx.shadowColor = "rgba(99,222,255,.85)";
  ctx.shadowBlur = 22;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size * 1.2, 0);
  ctx.lineTo(-size, -size * 0.75);
  ctx.lineTo(-size * 0.55, 0);
  ctx.lineTo(-size, size * 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-size * 1.05, 0);
  ctx.lineTo(-size * 2.1, 0);
  ctx.stroke();
  ctx.restore();

  if (elapsed < 10) {
    ctx.save();
    ctx.font = `${Math.max(10, Math.round(scale * 0.012))}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(211,247,255,.86)";
    ctx.fillText("DIVE SIGNAL / REI", px, py - size * 1.8);
    ctx.restore();
  }

  if (paused) {
    ctx.fillStyle = "rgba(0,5,10,.28)";
    ctx.fillRect(0, 0, width, height);
  }
}

export function LoadRoadShootingStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef(new Set<string>());
  const runtimeRef = useRef<GameRuntime>(makeRuntime());
  const pausedRef = useRef(true);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(true);
  const [echo, setEcho] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState<{ rank: string; memories: number } | null>(null);
  const [hud, setHud] = useState<HudState>({ sync: 100, memories: 0, repaired: 0, damage: 0, progress: 0, phase: "DIVE LINK" });

  useEffect(() => {
    const syncScene = () => {
      const nextActive = isLoadRoadActive();
      const nextPaused = isOverlayOpen();
      activeRef.current = nextActive;
      pausedRef.current = nextPaused;
      setActive(nextActive);
      setPaused(nextPaused);
      if (!nextActive) {
        runtimeRef.current = makeRuntime();
        setComplete(false);
        setResult(null);
        setEcho(null);
        setHud({ sync: 100, memories: 0, repaired: 0, damage: 0, progress: 0, phase: "DIVE LINK" });
      }
    };
    syncScene();
    const observer = new MutationObserver(syncScene);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const gameplayKey = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key);
      if (!gameplayKey || pausedRef.current) return;
      event.preventDefault();
      if (key === " ") return;
      keysRef.current.add(key);
    };
    const onUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", onDown, { passive: false });
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      keysRef.current.clear();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onShoot = (event: KeyboardEvent) => {
      if (event.code !== "Space" || pausedRef.current || event.repeat) return;
      const runtime = runtimeRef.current;
      const now = performance.now();
      if (now - runtime.lastShotAt < 170) return;
      runtime.lastShotAt = now;
      runtime.shots.push({ x: runtime.player.x + 0.025, y: runtime.player.y, vx: 0.78 });
    };
    window.addEventListener("keydown", onShoot);
    return () => window.removeEventListener("keydown", onShoot);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const runtime = runtimeRef.current;
      const audio = getActiveAudioPlaybackState();
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const stagePaused = pausedRef.current || audio.paused || audio.track !== "load-road";

      if (!stagePaused && runtime.origin === null) {
        runtime.origin = audio.position;
        runtime.previousAudioPosition = audio.position;
      }

      const elapsed = runtime.origin === null ? 0 : Math.max(0, audio.position - runtime.origin);
      const dt = Math.min(0.034, Math.max(0, (now - previous) / 1000));
      previous = now;

      if (!stagePaused && audio.position < UNLOCK_AT) {
        spawnTimeline(runtime, elapsed);
        const keys = keysRef.current;
        let dx = 0;
        let dy = 0;
        if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
        if (keys.has("arrowright") || keys.has("d")) dx += 1;
        if (keys.has("arrowup") || keys.has("w")) dy -= 1;
        if (keys.has("arrowdown") || keys.has("s")) dy += 1;
        if (dx || dy) {
          const length = Math.hypot(dx, dy) || 1;
          runtime.player.x = Math.max(0.08, Math.min(0.82, runtime.player.x + (dx / length) * 0.42 * dt));
          runtime.player.y = Math.max(0.14, Math.min(0.86, runtime.player.y + (dy / length) * 0.42 * dt));
        }

        for (const entity of runtime.entities) entity.x += entity.vx * dt;
        for (const shot of runtime.shots) shot.x += shot.vx * dt;
        runtime.shots = runtime.shots.filter(shot => shot.x < 1.1);

        for (const shot of runtime.shots) {
          for (const entity of runtime.entities) {
            if (entity.kind !== "node" || (entity.hp ?? 0) <= 0) continue;
            if (Math.abs(shot.x - entity.x) < 0.035 && Math.abs(shot.y - entity.y) < 0.06) {
              entity.hp = (entity.hp ?? 1) - 1;
              shot.x = 2;
              if (entity.hp <= 0) {
                runtime.repaired += 1;
                runtime.sync = Math.min(100, runtime.sync + 5);
                entity.x = -2;
              }
            }
          }
        }

        for (const entity of runtime.entities) {
          if (entity.x < -0.08) {
            if (entity.kind === "node" && (entity.hp ?? 0) > 0) {
              runtime.sync = Math.max(0, runtime.sync - 8);
              runtime.damage += 1;
            }
            continue;
          }
          const dxp = Math.abs(entity.x - runtime.player.x);
          const dyp = Math.abs(entity.y - runtime.player.y);
          if (dxp > 0.042 || dyp > 0.06) continue;

          if (entity.kind === "noise" && now >= runtime.invulnerableUntil) {
            runtime.invulnerableUntil = now + 700;
            runtime.sync = Math.max(0, runtime.sync - 18);
            runtime.damage += 1;
            entity.x = -2;
          } else if (entity.kind === "memory" && typeof entity.memoryIndex === "number") {
            const index = entity.memoryIndex;
            if (!runtime.memories[index]) {
              runtime.memories[index] = true;
              runtime.sync = Math.min(100, runtime.sync + 7);
              setEcho(MEMORY_ECHOES[index]);
              window.setTimeout(() => setEcho(current => current === MEMORY_ECHOES[index] ? null : current), 3300);
            }
            entity.x = -2;
          }
        }

        if (runtime.sync <= 0) {
          runtime.sync = 45;
          runtime.resyncs += 1;
          runtime.damage += 2;
        }

        runtime.entities = runtime.entities.filter(entity => entity.x > -0.08);
      }

      const memoryCount = runtime.memories.filter(Boolean).length;
      if (audio.track === "load-road" && audio.position >= UNLOCK_AT && !runtime.completeSaved) {
        runtime.completeSaved = true;
        const rank = runtime.damage === 0 && runtime.resyncs === 0 && memoryCount === 3
          ? "PERFECT SYNC"
          : runtime.resyncs === 0 && memoryCount >= 2
            ? "STABLE"
            : "DEGRADED";
        const stored = { rank, memories: memoryCount, damage: runtime.damage, repaired: runtime.repaired };
        window.localStorage.setItem("sea-of-information:load-road-result", JSON.stringify(stored));
        setResult({ rank, memories: memoryCount });
        setComplete(true);
      }

      if (now - runtime.lastHudAt >= HUD_INTERVAL) {
        runtime.lastHudAt = now;
        setHud({
          sync: Math.round(runtime.sync),
          memories: memoryCount,
          repaired: runtime.repaired,
          damage: runtime.damage,
          progress: Math.min(100, Math.round((audio.position / UNLOCK_AT) * 100)),
          phase: phaseFor(elapsed)
        });
      }

      drawStage(ctx, width, height, runtime, elapsed, stagePaused);
      runtime.previousAudioPosition = audio.position;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  const advance = () => {
    const next = document.querySelector<HTMLButtonElement>(".gameScreen.art-load-road .nowPlayingNext")
      ?? Array.from(document.querySelectorAll<HTMLButtonElement>(".gameScreen.art-load-road .hotspot")).find(button => (button.textContent ?? "").includes("次の信号へ"));
    next?.click();
  };

  return (
    <section className={`loadRoadStg loadRoadStg-v2${paused ? " loadRoadStg-paused" : ""}`} aria-label="Load Road DIVE synchronization stage">
      <canvas ref={canvasRef} className="loadRoadStgCanvas" aria-hidden="true" />

      <div className="loadRoadStgHud">
        <div className="loadRoadStgHudSync"><small>SYNC</small><strong>{hud.sync}%</strong><i><b style={{ width: `${hud.sync}%` }} /></i></div>
        <div><small>MEMORY</small><strong>{hud.memories}/3</strong></div>
        <div><small>NODE</small><strong>{hud.repaired}</strong></div>
        <div><small>ROUTE</small><strong>{hud.progress}%</strong></div>
      </div>

      {!complete && !paused && (
        <div className={`loadRoadStgMission loadRoadStgMission-${hud.phase.toLowerCase().replaceAll(" ", "-")}`}>
          <small>{hud.phase}</small>
          {hud.phase === "DIVE LINK" && <><strong>情報経路の同期を維持する</strong><p>次のARCHIVEへ進むには、ReiのDIVE SIGNALを手動で通す必要がある。</p></>}
          {hud.phase === "MOVE" && <><strong>WASD / ARROW — MOVE</strong><p>画面内のDIVE SIGNALを動かしてください。</p></>}
          {hud.phase === "MEMORY" && <><strong>CYAN — MEMORY FRAGMENT</strong><p>触れると失われた記憶を復元できます。完全復元は3個。</p></>}
          {hud.phase === "NOISE" && <><strong>RED — NOISE</strong><p>接触するとSYNCが低下します。避けてください。</p></>}
          {hud.phase === "SYNC SHOT" && <><strong>AMBER — BROKEN NODE</strong><p>SPACEでSYNC SHOT。ノードを修復すると経路が安定します。</p></>}
          {(hud.phase === "ROUTE STABILIZE" || hud.phase === "FINAL APPROACH") && <><strong>SYNCを保ち、記憶を持ち帰る</strong><p>赤を避ける / 黄を撃つ / 青を拾う。高SYNCほど記憶を完全に復元できます。</p></>}
        </div>
      )}

      {echo && <div className="loadRoadStgEcho"><small>MEMORY ECHO RESTORED</small><p>{echo}</p></div>}
      {paused && <div className="loadRoadStgPause">DIVE CONTROL PAUSED</div>}

      {complete && result && (
        <section className={`loadRoadStgResult loadRoadStgResult-${result.rank.toLowerCase().replaceAll(" ", "-")}`}>
          <small>ROUTE STABILIZED</small>
          <h3>{result.rank}</h3>
          <p>MEMORY ECHO {result.memories}/3</p>
          {result.memories === 3 ? (
            <div className="loadRoadStgRecovered">{MEMORY_ECHOES.map((line, index) => <span key={index}>{line}</span>)}</div>
          ) : (
            <p className="loadRoadStgIncomplete">一部の記憶はノイズの中に残った。物語は進められるが、完全なEchoではない。</p>
          )}
          <button type="button" onClick={advance}>GADGET AREAへ進む</button>
        </section>
      )}
    </section>
  );
}
