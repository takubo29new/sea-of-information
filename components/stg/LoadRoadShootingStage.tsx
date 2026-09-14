"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const UNLOCK_AT = 125;

type Point = { id: string; x: number; y: number; kind: "obstacle" | "pickup" };

function parsePosition() {
  const text = document.querySelector<HTMLElement>(".gameScreen.art-load-road .nowPlayingTitle small")?.textContent ?? "";
  const match = text.match(/(\d+):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

function isLoadRoadActive() {
  return Boolean(document.querySelector(".gameScreen.art-load-road"));
}

function buildPoints(position: number): Point[] {
  const points: Point[] = [];
  const start = Math.max(0, Math.floor(position / 2) - 2);
  for (let i = start; i < start + 12; i += 1) {
    const spawn = i * 2.25 + 8;
    const x = 112 - (position - spawn) * 24;
    if (x < -8 || x > 112) continue;
    const y = 18 + ((i * 37 + 11) % 64);
    points.push({ id: `o-${i}`, x, y, kind: "obstacle" });
  }
  for (let i = start; i < start + 10; i += 1) {
    const spawn = i * 3.1 + 13;
    const x = 110 - (position - spawn) * 20;
    if (x < -8 || x > 112) continue;
    const y = 16 + ((i * 53 + 29) % 68);
    points.push({ id: `p-${i}`, x, y, kind: "pickup" });
  }
  return points;
}

export function LoadRoadShootingStage() {
  const keysRef = useRef(new Set<string>());
  const hitRef = useRef(new Set<string>());
  const collectedRef = useRef(new Set<string>());
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [player, setPlayer] = useState({ x: 22, y: 50 });
  const [sync, setSync] = useState(100);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"hit" | "pickup" | "resync" | null>(null);

  useEffect(() => {
    const syncScene = () => {
      setActive(isLoadRoadActive());
      setPaused(Boolean(document.querySelector(".dialogueBox, .modalBackdrop, .musicFocus, .trackTransition")));
    };
    syncScene();
    const observer = new MutationObserver(syncScene);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setPosition(parsePosition()), 120);
    return () => window.clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const down = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
        event.preventDefault();
        keysRef.current.add(event.key.toLowerCase());
      }
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keysRef.current.clear();
    };
  }, [active]);

  useEffect(() => {
    if (!active || paused) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - previous) / 1000;
      previous = now;
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;
      if (dx || dy) {
        const length = Math.hypot(dx, dy) || 1;
        setPlayer(current => ({
          x: Math.max(8, Math.min(88, current.x + (dx / length) * 42 * dt)),
          y: Math.max(14, Math.min(86, current.y + (dy / length) * 42 * dt))
        }));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, paused]);

  const points = useMemo(() => buildPoints(position), [position]);

  useEffect(() => {
    if (!active || paused || position >= UNLOCK_AT) return;
    points.forEach(point => {
      const dx = Math.abs(point.x - player.x);
      const dy = Math.abs(point.y - player.y);
      if (dx > 5.2 || dy > 7.5) return;

      if (point.kind === "obstacle" && !hitRef.current.has(point.id)) {
        hitRef.current.add(point.id);
        setSync(current => {
          const next = current - 22;
          if (next <= 0) {
            setFlash("resync");
            window.setTimeout(() => setFlash(null), 560);
            return 55;
          }
          setFlash("hit");
          window.setTimeout(() => setFlash(null), 260);
          return next;
        });
      }

      if (point.kind === "pickup" && !collectedRef.current.has(point.id)) {
        collectedRef.current.add(point.id);
        setScore(current => current + 1);
        setSync(current => Math.min(100, current + 7));
        setFlash("pickup");
        window.setTimeout(() => setFlash(null), 220);
      }
    });
  }, [active, paused, player, points, position]);

  useEffect(() => {
    if (!active) {
      hitRef.current.clear();
      collectedRef.current.clear();
      setPlayer({ x: 22, y: 50 });
      setSync(100);
      setScore(0);
      setPosition(0);
    }
  }, [active]);

  if (!active) return null;

  const complete = position >= UNLOCK_AT;
  const progress = Math.min(100, (position / UNLOCK_AT) * 100);
  const advance = () => {
    const next = document.querySelector<HTMLButtonElement>(".gameScreen.art-load-road .nowPlayingNext")
      ?? Array.from(document.querySelectorAll<HTMLButtonElement>(".gameScreen.art-load-road .hotspot")).find(button => (button.textContent ?? "").includes("次の信号へ"));
    next?.click();
  };

  return (
    <section className={`loadRoadStg${paused ? " loadRoadStg-paused" : ""}${flash ? ` loadRoadStg-${flash}` : ""}`} aria-label="Load Road shooting stage">
      <div className="loadRoadStgHud">
        <div><small>SYNC</small><strong>{sync}%</strong><i><b style={{ width: `${sync}%` }} /></i></div>
        <div><small>DATA</small><strong>{String(score).padStart(2, "0")}</strong></div>
        <div><small>ROUTE</small><strong>{Math.floor(progress)}%</strong></div>
      </div>

      <div className="loadRoadStgField" aria-hidden="true">
        <div className="loadRoadStgLane" />
        {points.map(point => {
          if (point.kind === "pickup" && collectedRef.current.has(point.id)) return null;
          return <i key={point.id} className={`loadRoadStgPoint loadRoadStgPoint-${point.kind}`} style={{ left: `${point.x}%`, top: `${point.y}%` }} />;
        })}
        <div className="loadRoadStgPlayer" style={{ left: `${player.x}%`, top: `${player.y}%` }}><i /><b /></div>
      </div>

      {!complete && !paused && <div className="loadRoadStgGuide"><small>MOVE</small><span>WASD / ARROW KEYS</span><p>データ片を拾い、ノイズを避けながら信号の先へ進む。</p></div>}
      {paused && <div className="loadRoadStgPause">STAGE PAUSED</div>}
      {flash === "resync" && <div className="loadRoadStgResync">SYNC LOST — RESYNCHRONIZING</div>}

      {complete && !paused && (
        <button className="loadRoadStgComplete" type="button" onClick={advance}>
          <small>ROUTE OPEN</small>
          <strong>次の信号へ</strong>
          <span>Gadget Areaへ進む</span>
        </button>
      )}
    </section>
  );
}
