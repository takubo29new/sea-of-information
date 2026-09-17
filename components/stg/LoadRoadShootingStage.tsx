"use client";

import { useEffect, useRef, useState } from "react";
import { getActiveAudioPlaybackState } from "@/engine/audio";

const UNLOCK_AT = 125;
const HUD_INTERVAL = 140;
const AUTO_FIRE_INTERVAL = 105;
const SHOT_UNLOCK_AT = 25;

type EntityKind = "noise" | "node" | "memory";
type Entity = {
  id: string;
  kind: EntityKind;
  x: number;
  y: number;
  vx: number;
  hp?: number;
  maxHp?: number;
  memoryIndex?: number;
  tutorial?: boolean;
  flashUntil?: number;
  baseY?: number;
  waveAmp?: number;
  waveSpeed?: number;
  waveOffset?: number;
  lastFireAt?: number;
  fireInterval?: number;
};
type Shot = { x: number; y: number; vx: number; life: number };
type EnemyShot = { x: number; y: number; vx: number; vy: number; life: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
};
type HudState = {
  sync: number;
  memories: number;
  repaired: number;
  damage: number;
  combo: number;
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
  combo: number;
  entities: Entity[];
  shots: Shot[];
  enemyShots: EnemyShot[];
  particles: Particle[];
  spawned: Set<string>;
  origin: number | null;
  lastShotAt: number;
  lastLockedFeedbackAt: number;
  lastHudAt: number;
  invulnerableUntil: number;
  hitFlashUntil: number;
  playerFlashUntil: number;
  muzzleFlashUntil: number;
  lockedFeedbackUntil: number;
  shakeUntil: number;
  shakePower: number;
  completeSaved: boolean;
};

type SfxKind = "shoot" | "locked" | "hit" | "destroy" | "damage" | "memory" | "enemy";
let sfxContext: AudioContext | null = null;

const MEMORY_ECHOES = [
  "パン屋のシャッターが閉まる音。朝だけだった街に、初めて夜が来た。",
  "駅のホームに最後のアナウンスが残っている。『本日の運行は終了しました』。",
  "Noaの声が一瞬だけ混ざる。『……またね。』"
];

function playSfx(kind: SfxKind) {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext;
  if (!AudioContextCtor) return;
  if (!sfxContext) sfxContext = new AudioContextCtor();
  const ctx = sfxContext;
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const settings: Record<SfxKind, [number, number, number, OscillatorType, number]> = {
    shoot: [720, 1180, 0.055, "square", 0.026],
    locked: [180, 120, 0.09, "square", 0.032],
    hit: [980, 620, 0.07, "triangle", 0.036],
    destroy: [420, 90, 0.18, "sawtooth", 0.055],
    damage: [150, 58, 0.2, "sawtooth", 0.062],
    memory: [620, 1320, 0.22, "sine", 0.045],
    enemy: [360, 240, 0.07, "square", 0.018]
  };
  const [start, end, duration, type, volume] = settings[kind];
  osc.type = type;
  osc.frequency.setValueAtTime(start, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(30, end), now + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(kind === "destroy" || kind === "damage" ? 900 : 2600, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function isLoadRoadActive() {
  return Boolean(document.querySelector(".gameScreen.art-load-road"));
}

function isOverlayOpen() {
  return Boolean(document.querySelector(".dialogueBox, .modalBackdrop, .listeningStage, .trackTransition"));
}

function makeRuntime(): GameRuntime {
  return {
    player: { x: 0.2, y: 0.5 }, sync: 100, memories: [false, false, false], repaired: 0, damage: 0, resyncs: 0, combo: 0,
    entities: [], shots: [], enemyShots: [], particles: [], spawned: new Set<string>(), origin: null, lastShotAt: 0,
    lastLockedFeedbackAt: 0, lastHudAt: 0, invulnerableUntil: 0, hitFlashUntil: 0, playerFlashUntil: 0,
    muzzleFlashUntil: 0, lockedFeedbackUntil: 0, shakeUntil: 0, shakePower: 0, completeSaved: false
  };
}

function phaseFor(elapsed: number) {
  if (elapsed < 5) return "DIVE LINK";
  if (elapsed < 11) return "MOVE";
  if (elapsed < 18) return "MEMORY";
  if (elapsed < 25) return "NOISE";
  if (elapsed < 34) return "SYNC SHOT";
  if (elapsed < 72) return "ROUTE STABILIZE";
  if (elapsed < 103) return "HIGH LOAD";
  return "FINAL APPROACH";
}

function spawn(runtime: GameRuntime, entity: Entity) {
  if (runtime.spawned.has(entity.id)) return;
  runtime.spawned.add(entity.id);
  runtime.entities.push(entity);
}

function emitParticles(runtime: GameRuntime, x: number, y: number, color: string, count: number, speed = 0.32, size = 3) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = speed * (0.35 + Math.random() * 0.65);
    const life = 0.22 + Math.random() * 0.34;
    runtime.particles.push({ x, y, vx: Math.cos(angle) * magnitude, vy: Math.sin(angle) * magnitude, life, maxLife: life, size: size * (0.55 + Math.random() * 0.9), color });
  }
}

function spawnNode(runtime: GameRuntime, id: string, x: number, y: number, hp: number, elapsed: number, offset: number) {
  spawn(runtime, {
    id, kind: "node", x, y, baseY: y, vx: elapsed > 88 ? -0.125 : -0.095, hp, maxHp: hp,
    waveAmp: elapsed > 70 ? 0.1 : 0.055, waveSpeed: 1.35 + (offset % 3) * 0.28, waveOffset: offset * 1.7,
    lastFireAt: 0, fireInterval: elapsed > 92 ? 900 + (offset % 3) * 140 : 1350 + (offset % 2) * 180
  });
}

function spawnTimeline(runtime: GameRuntime, elapsed: number) {
  if (elapsed >= 11) spawn(runtime, { id: "memory-0", kind: "memory", x: 1.08, y: 0.5, vx: -0.13, memoryIndex: 0, tutorial: true });
  if (elapsed >= 18) spawn(runtime, { id: "noise-tutorial", kind: "noise", x: 1.08, y: 0.34, vx: -0.18, tutorial: true });
  if (elapsed >= 25) spawn(runtime, { id: "node-tutorial", kind: "node", x: 1.08, y: 0.58, baseY: 0.58, vx: -0.1, hp: 3, maxHp: 3, tutorial: true, waveAmp: 0.035, waveSpeed: 1.1, waveOffset: 0, lastFireAt: 0, fireInterval: 1800 });
  if (elapsed >= 58) spawn(runtime, { id: "memory-1", kind: "memory", x: 1.08, y: 0.68, vx: -0.16, memoryIndex: 1 });
  if (elapsed >= 100) spawn(runtime, { id: "memory-2", kind: "memory", x: 1.08, y: 0.42, vx: -0.18, memoryIndex: 2 });
  if (elapsed < 33) return;

  const noiseStep = elapsed < 72 ? 2.15 : elapsed < 100 ? 1.58 : 1.28;
  const noiseIndex = Math.floor((elapsed - 33) / noiseStep);
  for (let i = Math.max(0, noiseIndex - 4); i <= noiseIndex; i += 1) {
    const at = 33 + i * noiseStep;
    if (elapsed < at) continue;
    const intensity = elapsed > 96 ? 1.34 : elapsed > 72 ? 1.18 : 1;
    const baseY = 0.16 + (((i * 43 + 17) % 68) / 100);
    spawn(runtime, { id: `noise-${i}-a`, kind: "noise", x: 1.08, y: baseY, vx: -(0.185 + (i % 4) * 0.016) * intensity });
    if (elapsed > 55 && i % 2 === 0) spawn(runtime, { id: `noise-${i}-b`, kind: "noise", x: 1.15, y: Math.max(0.15, Math.min(0.85, 1 - baseY + ((i % 3) - 1) * 0.08)), vx: -(0.2 + (i % 3) * 0.018) * intensity });
    if (elapsed > 84 && i % 3 === 0) spawn(runtime, { id: `noise-${i}-c`, kind: "noise", x: 1.22, y: 0.24 + (((i * 29 + 31) % 52) / 100), vx: -0.28 * intensity });
  }

  const nodeStep = elapsed < 65 ? 5.1 : elapsed < 92 ? 3.55 : 2.65;
  const nodeIndex = Math.floor((elapsed - 37) / nodeStep);
  for (let i = Math.max(0, nodeIndex - 3); i <= nodeIndex; i += 1) {
    const at = 37 + i * nodeStep;
    if (elapsed < at) continue;
    const hp = elapsed > 96 ? 7 : elapsed > 72 ? 5 : 4;
    const y = 0.2 + (((i * 61 + 7) % 61) / 100);
    spawnNode(runtime, `node-${i}-a`, 1.08, y, hp, elapsed, i);
    if (elapsed > 61 && i % 2 === 0) spawnNode(runtime, `node-${i}-b`, 1.18, Math.max(0.18, Math.min(0.82, 1 - y)), hp + 1, elapsed, i + 7);
    if (elapsed > 90 && i % 3 === 0) spawnNode(runtime, `node-${i}-c`, 1.28, 0.25 + (((i * 23 + 9) % 50) / 100), hp + 1, elapsed, i + 13);
  }
}

function drawHex(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = Math.PI / 3 * i;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawStage(ctx: CanvasRenderingContext2D, width: number, height: number, runtime: GameRuntime, elapsed: number, paused: boolean, now: number) {
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width, height);
  ctx.save();
  if (now < runtime.shakeUntil) {
    const strength = runtime.shakePower * (runtime.shakeUntil - now) / 220;
    ctx.translate((Math.random() - 0.5) * strength, (Math.random() - 0.5) * strength);
  }
  ctx.save();
  ctx.globalAlpha = 0.34;
  ctx.strokeStyle = "rgba(118,220,255,.22)";
  ctx.lineWidth = 1;
  const drift = (elapsed * 80) % (width * 0.12);
  for (let i = -1; i < 10; i += 1) {
    const x = i * width * 0.12 - drift;
    ctx.beginPath(); ctx.moveTo(x, height * 0.12); ctx.lineTo(x + width * 0.2, height * 0.9); ctx.stroke();
  }
  for (let i = 0; i < 9; i += 1) {
    const y = height * (0.18 + i * 0.08);
    ctx.beginPath(); ctx.moveTo(width * 0.05, y); ctx.lineTo(width, y - height * 0.04); ctx.stroke();
  }
  ctx.restore();

  for (const entity of runtime.entities) {
    const x = entity.x * width;
    const y = entity.y * height;
    const flashing = (entity.flashUntil ?? 0) > now;
    if (entity.kind === "noise") {
      const r = scale * 0.028;
      ctx.save(); ctx.translate(x, y); ctx.rotate(elapsed * 1.25 + x * 0.003);
      ctx.strokeStyle = flashing ? "#fff" : "rgba(255,102,87,.98)"; ctx.fillStyle = "rgba(255,45,34,.22)"; ctx.shadowColor = "rgba(255,55,42,.9)"; ctx.shadowBlur = 26; ctx.lineWidth = Math.max(2, scale * 0.003);
      ctx.beginPath(); ctx.moveTo(-r, -r * 0.18); ctx.lineTo(-r * 0.25, -r); ctx.lineTo(r * 0.86, -r * 0.56); ctx.lineTo(r, r * 0.38); ctx.lineTo(r * 0.1, r); ctx.lineTo(-r * 0.9, r * 0.56); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,210,203,.78)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.6); ctx.lineTo(r * 0.48, r * 0.62); ctx.moveTo(r * 0.56, -r * 0.56); ctx.lineTo(-r * 0.54, r * 0.52); ctx.stroke(); ctx.restore();
    } else if (entity.kind === "memory") {
      const r = scale * 0.021; const pulse = 1 + Math.sin(elapsed * 5 + entity.x * 9) * 0.12;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4 + elapsed * 0.4); ctx.scale(pulse, pulse); ctx.strokeStyle = "rgba(207,251,255,.99)"; ctx.fillStyle = "rgba(75,221,255,.28)"; ctx.shadowColor = "rgba(72,231,255,1)"; ctx.shadowBlur = 32; ctx.lineWidth = 2; ctx.fillRect(-r, -r, r * 2, r * 2); ctx.strokeRect(-r, -r, r * 2, r * 2); ctx.strokeRect(-r * 0.5, -r * 0.5, r, r); ctx.restore();
    } else {
      const r = scale * 0.032; const hpRatio = Math.max(0, (entity.hp ?? 0) / Math.max(1, entity.maxHp ?? 1));
      ctx.save(); ctx.strokeStyle = flashing ? "#fff" : "rgba(255,206,91,.99)"; ctx.fillStyle = flashing ? "rgba(255,255,255,.46)" : "rgba(255,164,36,.18)"; ctx.shadowColor = flashing ? "#fff" : "rgba(255,181,48,.9)"; ctx.shadowBlur = flashing ? 34 : 25; ctx.lineWidth = Math.max(2, scale * 0.003);
      drawHex(ctx, x, y, r); ctx.fill(); ctx.stroke(); drawHex(ctx, x, y, r * 0.5); ctx.stroke();
      ctx.fillStyle = "rgba(255,216,120,.9)"; ctx.fillRect(x - r, y + r * 1.25, r * 2 * hpRatio, Math.max(2, scale * 0.004)); ctx.strokeStyle = "rgba(255,230,168,.42)"; ctx.strokeRect(x - r, y + r * 1.25, r * 2, Math.max(2, scale * 0.004)); ctx.restore();
    }
    if (entity.tutorial) {
      ctx.save(); const fontSize = Math.max(15, Math.round(scale * 0.021));
      const label = entity.kind === "noise" ? "NOISE  —  AVOID" : entity.kind === "node" ? "BROKEN NODE  —  HOLD SPACE" : "MEMORY FRAGMENT  —  COLLECT";
      const color = entity.kind === "noise" ? "#ffb1a6" : entity.kind === "node" ? "#ffe0a0" : "#bdf7ff";
      ctx.font = `700 ${fontSize}px ui-monospace, monospace`; ctx.textAlign = "center"; const metrics = ctx.measureText(label); const padX = 13; const boxY = y - scale * 0.075;
      ctx.fillStyle = "rgba(2,8,14,.82)"; ctx.fillRect(x - metrics.width / 2 - padX, boxY - fontSize, metrics.width + padX * 2, fontSize + 12); ctx.strokeStyle = color; ctx.globalAlpha = 0.72; ctx.strokeRect(x - metrics.width / 2 - padX, boxY - fontSize, metrics.width + padX * 2, fontSize + 12); ctx.globalAlpha = 1; ctx.fillStyle = color; ctx.fillText(label, x, boxY); ctx.restore();
    }
  }

  ctx.save(); ctx.lineWidth = Math.max(2, scale * 0.0034);
  for (const shot of runtime.shots) {
    const sx = shot.x * width; const sy = shot.y * height; const tail = scale * 0.045;
    const gradient = ctx.createLinearGradient(sx - tail, sy, sx + scale * 0.012, sy); gradient.addColorStop(0, "rgba(89,224,255,0)"); gradient.addColorStop(0.6, "rgba(111,235,255,.68)"); gradient.addColorStop(1, "rgba(234,254,255,1)"); ctx.strokeStyle = gradient; ctx.shadowColor = "rgba(80,232,255,1)"; ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(sx - tail, sy); ctx.lineTo(sx + scale * 0.012, sy); ctx.stroke();
  }
  ctx.restore();

  for (const shot of runtime.enemyShots) {
    const sx = shot.x * width; const sy = shot.y * height;
    ctx.save(); ctx.fillStyle = "#ff9f62"; ctx.shadowColor = "#ff5f3e"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(sx, sy, Math.max(4, scale * 0.007), 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = "rgba(255,225,185,.9)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(sx, sy, Math.max(7, scale * 0.011), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }

  for (const particle of runtime.particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = particle.color; ctx.shadowColor = particle.color; ctx.shadowBlur = particle.size * 3; ctx.fillRect(particle.x * width - particle.size / 2, particle.y * height - particle.size / 2, particle.size, particle.size); ctx.restore();
  }

  const px = runtime.player.x * width; const py = runtime.player.y * height; const size = scale * 0.029; const hitBlink = now < runtime.playerFlashUntil && Math.floor(now / 55) % 2 === 0;
  ctx.save(); ctx.translate(px, py); ctx.globalAlpha = hitBlink ? 0.32 : 1; ctx.strokeStyle = "rgba(225,252,255,.99)"; ctx.fillStyle = "rgba(54,203,247,.28)"; ctx.shadowColor = "rgba(76,232,255,1)"; ctx.shadowBlur = 28; ctx.lineWidth = Math.max(2, scale * 0.0025); ctx.beginPath(); ctx.moveTo(size * 1.3, 0); ctx.lineTo(-size * 0.95, -size * 0.8); ctx.lineTo(-size * 0.48, 0); ctx.lineTo(-size * 0.95, size * 0.8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = "rgba(132,235,255,.8)"; ctx.beginPath(); ctx.moveTo(-size * 0.9, 0); ctx.lineTo(-size * 2.4, 0); ctx.stroke();
  if (now < runtime.muzzleFlashUntil) { ctx.fillStyle = "#ecfeff"; ctx.shadowColor = "#8ff3ff"; ctx.shadowBlur = 22; ctx.beginPath(); ctx.arc(size * 1.55, 0, size * 0.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();

  if (elapsed < 10) { ctx.save(); ctx.font = `700 ${Math.max(13, Math.round(scale * 0.017))}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.fillStyle = "rgba(220,250,255,.94)"; ctx.fillText("DIVE SIGNAL / REI", px, py - size * 2.1); ctx.restore(); }
  if (now < runtime.lockedFeedbackUntil) {
    ctx.save(); ctx.font = `700 ${Math.max(14, Math.round(scale * 0.019))}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.fillStyle = "#ffd58b"; ctx.shadowColor = "rgba(255,179,70,.75)"; ctx.shadowBlur = 16; ctx.fillText("SYNC SHOT LINK — OFFLINE", px + scale * 0.08, py - scale * 0.065); ctx.restore();
  }
  if (now < runtime.hitFlashUntil) { const alpha = Math.max(0, (runtime.hitFlashUntil - now) / 180) * 0.24; ctx.fillStyle = `rgba(255,55,42,${alpha})`; ctx.fillRect(0, 0, width, height); }
  if (paused) { ctx.fillStyle = "rgba(0,5,10,.3)"; ctx.fillRect(0, 0, width, height); }
  ctx.restore();
}

export function LoadRoadShootingStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef(new Set<string>());
  const runtimeRef = useRef<GameRuntime>(makeRuntime());
  const pausedRef = useRef(true);
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(true);
  const [echo, setEcho] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState<{ rank: string; memories: number } | null>(null);
  const [hud, setHud] = useState<HudState>({ sync: 100, memories: 0, repaired: 0, damage: 0, combo: 0, progress: 0, phase: "DIVE LINK" });

  useEffect(() => {
    const syncScene = () => {
      const nextActive = isLoadRoadActive(); const nextPaused = isOverlayOpen(); pausedRef.current = nextPaused; setActive(nextActive); setPaused(nextPaused);
      if (!nextActive) { runtimeRef.current = makeRuntime(); setComplete(false); setResult(null); setEcho(null); setHud({ sync: 100, memories: 0, repaired: 0, damage: 0, combo: 0, progress: 0, phase: "DIVE LINK" }); }
    };
    syncScene(); const observer = new MutationObserver(syncScene); observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] }); return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onDown = (event: KeyboardEvent) => { const key = event.key.toLowerCase(); const gameplayKey = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(key); if (!gameplayKey || pausedRef.current) return; event.preventDefault(); keysRef.current.add(key); };
    const onUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", onDown, { passive: false }); window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); keysRef.current.clear(); };
  }, [active]);

  useEffect(() => {
    if (!active) return; const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext("2d", { alpha: true }); if (!ctx) return;
    const resize = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); const rect = canvas.getBoundingClientRect(); canvas.width = Math.max(1, Math.round(rect.width * dpr)); canvas.height = Math.max(1, Math.round(rect.height * dpr)); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    let frame = 0; let previous = performance.now();
    const tick = (now: number) => {
      const runtime = runtimeRef.current; const audio = getActiveAudioPlaybackState(); const width = canvas.clientWidth; const height = canvas.clientHeight; const stagePaused = pausedRef.current || audio.paused || audio.track !== "load-road";
      if (!stagePaused && runtime.origin === null) runtime.origin = audio.position;
      const elapsed = runtime.origin === null ? 0 : Math.max(0, audio.position - runtime.origin); const dt = Math.min(0.034, Math.max(0, (now - previous) / 1000)); previous = now;
      if (!stagePaused && audio.position < UNLOCK_AT) {
        spawnTimeline(runtime, elapsed); const keys = keysRef.current; let dx = 0; let dy = 0;
        if (keys.has("arrowleft") || keys.has("a")) dx -= 1; if (keys.has("arrowright") || keys.has("d")) dx += 1; if (keys.has("arrowup") || keys.has("w")) dy -= 1; if (keys.has("arrowdown") || keys.has("s")) dy += 1;
        if (dx || dy) { const length = Math.hypot(dx, dy) || 1; runtime.player.x = Math.max(0.07, Math.min(0.82, runtime.player.x + (dx / length) * 0.5 * dt)); runtime.player.y = Math.max(0.13, Math.min(0.87, runtime.player.y + (dy / length) * 0.5 * dt)); }

        if (keys.has(" ")) {
          if (elapsed < SHOT_UNLOCK_AT) {
            if (now - runtime.lastLockedFeedbackAt >= 380) { runtime.lastLockedFeedbackAt = now; runtime.lockedFeedbackUntil = now + 320; runtime.muzzleFlashUntil = now + 45; playSfx("locked"); emitParticles(runtime, runtime.player.x + 0.03, runtime.player.y, "#ffd17a", 5, 0.1, 2); }
          } else if (now - runtime.lastShotAt >= AUTO_FIRE_INTERVAL) {
            runtime.lastShotAt = now; runtime.muzzleFlashUntil = now + 60; runtime.shots.push({ x: runtime.player.x + 0.035, y: runtime.player.y, vx: 1.05, life: 1.1 }); emitParticles(runtime, runtime.player.x + 0.03, runtime.player.y, "#bdf8ff", 2, 0.13, 2); playSfx("shoot");
          }
        }

        for (const entity of runtime.entities) {
          entity.x += entity.vx * dt;
          if (entity.kind === "node" && typeof entity.baseY === "number") {
            entity.y = Math.max(0.14, Math.min(0.86, entity.baseY + Math.sin(elapsed * (entity.waveSpeed ?? 1.2) + (entity.waveOffset ?? 0)) * (entity.waveAmp ?? 0.05)));
            if (!entity.tutorial && elapsed > 43 && entity.x < 0.98 && entity.x > 0.33 && now - (entity.lastFireAt ?? 0) >= (entity.fireInterval ?? 1400)) {
              entity.lastFireAt = now; const tx = runtime.player.x - entity.x; const ty = runtime.player.y - entity.y; const len = Math.hypot(tx, ty) || 1; const speed = elapsed > 95 ? 0.42 : 0.34;
              runtime.enemyShots.push({ x: entity.x - 0.015, y: entity.y, vx: tx / len * speed, vy: ty / len * speed, life: 4 }); playSfx("enemy"); emitParticles(runtime, entity.x - 0.02, entity.y, "#ff9f62", 5, 0.12, 2.2);
            }
          }
        }
        for (const shot of runtime.shots) { shot.x += shot.vx * dt; shot.life -= dt; }
        for (const shot of runtime.enemyShots) { shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt; }
        for (const particle of runtime.particles) { particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.vx *= Math.pow(0.04, dt); particle.vy *= Math.pow(0.04, dt); particle.life -= dt; }

        for (const shot of runtime.shots) {
          if (shot.life <= 0 || shot.x > 1.1) continue;
          for (const entity of runtime.entities) {
            if (entity.kind !== "node" || (entity.hp ?? 0) <= 0 || entity.x < 0) continue;
            if (Math.abs(shot.x - entity.x) < 0.04 && Math.abs(shot.y - entity.y) < 0.065) {
              entity.hp = (entity.hp ?? 1) - 1; entity.flashUntil = now + 90; shot.life = 0; emitParticles(runtime, entity.x, entity.y, "#fff1bd", 7, 0.24, 2.6); playSfx("hit");
              if (entity.hp <= 0) { runtime.repaired += 1; runtime.combo += 1; runtime.sync = Math.min(100, runtime.sync + 6); runtime.shakeUntil = now + 90; runtime.shakePower = 8; emitParticles(runtime, entity.x, entity.y, "#ffd36e", 22, 0.45, 3.3); emitParticles(runtime, entity.x, entity.y, "#ffffff", 9, 0.28, 2.4); playSfx("destroy"); entity.x = -2; }
              break;
            }
          }
        }

        for (const enemyShot of runtime.enemyShots) {
          if (enemyShot.life <= 0) continue;
          if (Math.abs(enemyShot.x - runtime.player.x) < 0.032 && Math.abs(enemyShot.y - runtime.player.y) < 0.05 && now >= runtime.invulnerableUntil) {
            enemyShot.life = 0; runtime.invulnerableUntil = now + 360; runtime.sync = Math.max(0, runtime.sync - 13); runtime.damage += 1; runtime.combo = 0; runtime.hitFlashUntil = now + 130; runtime.playerFlashUntil = now + 360; runtime.shakeUntil = now + 130; runtime.shakePower = 11; emitParticles(runtime, runtime.player.x, runtime.player.y, "#ff8a63", 15, 0.38, 3); playSfx("damage");
          }
        }

        for (const entity of runtime.entities) {
          if (entity.x < -0.08) { if (entity.kind === "node" && (entity.hp ?? 0) > 0) { runtime.sync = Math.max(0, runtime.sync - 11); runtime.damage += 1; runtime.combo = 0; runtime.hitFlashUntil = now + 120; } continue; }
          const dxp = Math.abs(entity.x - runtime.player.x); const dyp = Math.abs(entity.y - runtime.player.y); if (dxp > 0.044 || dyp > 0.064) continue;
          if (entity.kind === "noise" && now >= runtime.invulnerableUntil) {
            runtime.invulnerableUntil = now + 620; runtime.sync = Math.max(0, runtime.sync - 22); runtime.damage += 1; runtime.combo = 0; runtime.hitFlashUntil = now + 180; runtime.playerFlashUntil = now + 620; runtime.shakeUntil = now + 220; runtime.shakePower = 18; emitParticles(runtime, runtime.player.x, runtime.player.y, "#ff5f50", 26, 0.52, 3.5); emitParticles(runtime, runtime.player.x, runtime.player.y, "#ffffff", 8, 0.35, 2.5); playSfx("damage"); entity.x = -2;
          } else if (entity.kind === "memory" && typeof entity.memoryIndex === "number") {
            const index = entity.memoryIndex; if (!runtime.memories[index]) { runtime.memories[index] = true; runtime.sync = Math.min(100, runtime.sync + 9); runtime.combo += 1; emitParticles(runtime, entity.x, entity.y, "#70eaff", 28, 0.46, 3.2); emitParticles(runtime, entity.x, entity.y, "#ffffff", 10, 0.3, 2.4); playSfx("memory"); setEcho(MEMORY_ECHOES[index]); window.setTimeout(() => setEcho(current => current === MEMORY_ECHOES[index] ? null : current), 3300); } entity.x = -2;
          }
        }
        if (runtime.sync <= 0) { runtime.sync = 42; runtime.resyncs += 1; runtime.damage += 2; runtime.combo = 0; runtime.hitFlashUntil = now + 260; runtime.shakeUntil = now + 340; runtime.shakePower = 24; emitParticles(runtime, runtime.player.x, runtime.player.y, "#ff8274", 40, 0.62, 4); playSfx("damage"); }
        runtime.entities = runtime.entities.filter(entity => entity.x > -0.08); runtime.shots = runtime.shots.filter(shot => shot.life > 0 && shot.x < 1.1); runtime.enemyShots = runtime.enemyShots.filter(shot => shot.life > 0 && shot.x > -0.1 && shot.x < 1.1 && shot.y > -0.1 && shot.y < 1.1); runtime.particles = runtime.particles.filter(particle => particle.life > 0);
      }

      const memoryCount = runtime.memories.filter(Boolean).length;
      if (audio.track === "load-road" && audio.position >= UNLOCK_AT && !runtime.completeSaved) {
        runtime.completeSaved = true; const rank = runtime.damage === 0 && runtime.resyncs === 0 && memoryCount === 3 ? "PERFECT SYNC" : runtime.resyncs === 0 && memoryCount >= 2 ? "STABLE" : "DEGRADED"; const stored = { rank, memories: memoryCount, damage: runtime.damage, repaired: runtime.repaired }; window.localStorage.setItem("sea-of-information:load-road-result", JSON.stringify(stored)); setResult({ rank, memories: memoryCount }); setComplete(true);
      }
      if (now - runtime.lastHudAt >= HUD_INTERVAL) { runtime.lastHudAt = now; setHud({ sync: Math.round(runtime.sync), memories: memoryCount, repaired: runtime.repaired, damage: runtime.damage, combo: runtime.combo, progress: Math.min(100, Math.round((audio.position / UNLOCK_AT) * 100)), phase: phaseFor(elapsed) }); }
      drawStage(ctx, width, height, runtime, elapsed, stagePaused, now); frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, [active]);

  if (!active) return null;
  const advance = () => { const next = document.querySelector<HTMLButtonElement>(".gameScreen.art-load-road .nowPlayingNext") ?? Array.from(document.querySelectorAll<HTMLButtonElement>(".gameScreen.art-load-road .hotspot")).find(button => (button.textContent ?? "").includes("次の信号へ")); next?.click(); };

  return (
    <section className={`loadRoadStg loadRoadStg-v2${paused ? " loadRoadStg-paused" : ""}`} aria-label="Load Road DIVE synchronization stage">
      <canvas ref={canvasRef} className="loadRoadStgCanvas" aria-hidden="true" />
      <div className="loadRoadStgHud"><div className="loadRoadStgHudSync"><small>SYNC</small><strong>{hud.sync}%</strong><i><b style={{ width: `${hud.sync}%` }} /></i></div><div><small>MEMORY</small><strong>{hud.memories}/3</strong></div><div><small>NODE</small><strong>{hud.repaired}</strong></div><div><small>CHAIN</small><strong>{hud.combo}</strong></div><div><small>ROUTE</small><strong>{hud.progress}%</strong></div></div>
      {!complete && !paused && <div className={`loadRoadStgMission loadRoadStgMission-${hud.phase.toLowerCase().replaceAll(" ", "-")}`}><small>{hud.phase}</small>
        {hud.phase === "DIVE LINK" && <><strong>情報経路の同期を維持する</strong><p>次のARCHIVEへ進むには、ReiのDIVE SIGNALを手動で通す必要がある。</p></>}
        {hud.phase === "MOVE" && <><strong>WASD / ARROW — MOVE</strong><p>画面内のDIVE SIGNALを動かしてください。SPACEはまだ接続されていません。</p></>}
        {hud.phase === "MEMORY" && <><strong>CYAN — MEMORY FRAGMENT</strong><p>触れると失われた記憶を復元できます。完全復元は3個。</p></>}
        {hud.phase === "NOISE" && <><strong>RED — NOISE</strong><p>接触するとSYNCが大きく低下します。避けてください。</p></>}
        {hud.phase === "SYNC SHOT" && <><strong>AMBER — BROKEN NODE</strong><p>SPACE長押しで連射。NODEは移動し、後半ではSYNC弾を撃ち返します。</p></>}
        {(hud.phase === "ROUTE STABILIZE" || hud.phase === "HIGH LOAD" || hud.phase === "FINAL APPROACH") && <><strong>複数NODEを修復しながら突破する</strong><p>赤を避ける / 黄を撃つ / 黄の弾も避ける / 青を拾う。終盤ほど同時出現数が増えます。</p></>}
      </div>}
      {echo && <div className="loadRoadStgEcho"><small>MEMORY ECHO RESTORED</small><p>{echo}</p></div>}
      {paused && <div className="loadRoadStgPause">DIVE CONTROL PAUSED</div>}
      {complete && result && <section className={`loadRoadStgResult loadRoadStgResult-${result.rank.toLowerCase().replaceAll(" ", "-")}`}><small>ROUTE STABILIZED</small><h3>{result.rank}</h3><p>MEMORY ECHO {result.memories}/3</p>{result.memories === 3 ? <div className="loadRoadStgRecovered">{MEMORY_ECHOES.map((line, index) => <span key={index}>{line}</span>)}</div> : <p className="loadRoadStgIncomplete">一部の記憶はノイズの中に残った。物語は進められるが、完全なEchoではない。</p>}<button type="button" onClick={advance}>GADGET AREAへ進む</button></section>}
    </section>
  );
}
