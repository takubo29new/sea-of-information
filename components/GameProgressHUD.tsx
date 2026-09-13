"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSave } from "@/engine/saveClient";
import type { GameState } from "@/engine/model";

const CITY_OBSERVE = [
  ["city.observeClock", "CLOCK"],
  ["city.observeChild", "CHILD"],
  ["city.observeBirds", "BIRDS"],
  ["city.observeBakery", "BAKERY"],
] as const;

const CITY_COMPARE = [
  ["city.matchClock", "CLOCK"],
  ["city.matchBirds", "BIRDS"],
  ["city.matchBakery", "BAKERY"],
] as const;

const GADGET_SYSTEMS = [
  ["gadget.powerRestored", "POWER"],
  ["gadget.gearAligned", "GEAR"],
  ["gadget.craneMoved", "CRANE"],
] as const;

const GEAR_TARGET = [1, 2, 3] as const;
type GadgetSystem = "power" | "gear" | "crane";

function snapshot(): GameState | null {
  if (typeof document === "undefined" || !document.querySelector(".gameScreen")) return null;
  return loadSave();
}

function findHotspot(prefix: string) {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".gameScreen.art-gadget-machinery .hotspot"));
  return buttons.find(button => (button.textContent ?? "").includes(prefix));
}

export function GameProgressHUD() {
  const [state, setState] = useState<GameState | null>(null);
  const [activeSystem, setActiveSystem] = useState<GadgetSystem | null>(null);
  const [powerStep, setPowerStep] = useState(0);
  const [powerError, setPowerError] = useState(false);
  const [gearPhase, setGearPhase] = useState<[number, number, number]>([0, 0, 0]);
  const [cranePosition, setCranePosition] = useState(0);

  useEffect(() => {
    let previous = "";
    const sync = () => {
      const next = snapshot();
      const serialized = next ? JSON.stringify({ sceneId: next.sceneId, flags: next.flags }) : "";
      if (serialized === previous) return;
      previous = serialized;
      setState(next);
    };
    sync();
    const id = window.setInterval(sync, 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (state?.sceneId !== "gadget-machinery") {
      setActiveSystem(null);
      return;
    }

    const markManagedHotspots = () => {
      ["主電源", "歯車", "クレーン"].forEach(prefix => {
        const hotspot = findHotspot(prefix);
        if (hotspot) hotspot.dataset.puzzleManaged = "true";
      });
    };

    markManagedHotspots();
    const id = window.setInterval(markManagedHotspots, 250);
    return () => {
      window.clearInterval(id);
      document.querySelectorAll<HTMLElement>("[data-puzzle-managed='true']").forEach(node => delete node.dataset.puzzleManaged);
    };
  }, [state?.sceneId]);

  const config = useMemo(() => {
    if (!state) return null;
    if (state.sceneId === "city-loop-1") {
      return {
        eyebrow: "OBSERVE",
        title: "朝の特徴を記録する",
        hint: "4つ揃うと駅への経路が開く",
        items: CITY_OBSERVE,
      };
    }
    if (state.sceneId === "city-loop-2") {
      return {
        eyebrow: "COMPARE",
        title: "前の朝と照合する",
        hint: "一致を確認して結果へ介入する",
        items: CITY_COMPARE,
      };
    }
    if (state.sceneId === "gadget-machinery") {
      return {
        eyebrow: "RESTORE",
        title: "機械区画を復旧する",
        hint: "3系統すべてを復旧すると整備室が開く",
        items: GADGET_SYSTEMS,
      };
    }
    return null;
  }, [state]);

  const finishSystem = (prefix: string) => {
    const hotspot = findHotspot(prefix);
    if (!hotspot) return;
    setActiveSystem(null);
    window.setTimeout(() => hotspot.click(), 80);
  };

  const chooseSystem = (system: GadgetSystem) => {
    setActiveSystem(system);
    setPowerError(false);
  };

  const pressPower = (index: number) => {
    if (index !== powerStep) {
      setPowerError(true);
      setPowerStep(0);
      return;
    }
    setPowerError(false);
    const next = powerStep + 1;
    setPowerStep(next);
    if (next === 3) window.setTimeout(() => finishSystem("主電源"), 260);
  };

  const rotateGear = (index: number) => {
    setGearPhase(previous => {
      const next = [...previous] as [number, number, number];
      next[index] = (next[index] + 1) % 4;
      if (next.every((value, i) => value === GEAR_TARGET[i])) {
        window.setTimeout(() => finishSystem("歯車"), 300);
      }
      return next;
    });
  };

  const moveCrane = (delta: number) => {
    setCranePosition(previous => {
      const next = Math.max(0, Math.min(4, previous + delta));
      if (next === 3) window.setTimeout(() => finishSystem("クレーン"), 300);
      return next;
    });
  };

  if (!state || !config) return null;

  const complete = config.items.filter(([flag]) => Boolean(state.flags[flag])).length;
  const isGadget = config.eyebrow === "RESTORE";

  return (
    <aside className={`gameProgressHUD gameProgressHUD-${config.eyebrow.toLowerCase()}${activeSystem ? " puzzle-open" : ""}`} aria-live="polite">
      <div className="gameProgressHeader">
        <small>{config.eyebrow}</small>
        <b>{complete} / {config.items.length}</b>
      </div>
      <strong>{config.title}</strong>

      <div className={`gameProgressItems${isGadget ? " gadgetSystemButtons" : ""}`}>
        {config.items.map(([flag, label], index) => {
          const done = Boolean(state.flags[flag]);
          if (!isGadget) return <span key={flag} className={done ? "done" : ""}><i>{done ? "✓" : ""}</i>{label}</span>;
          const system = (["power", "gear", "crane"] as const)[index];
          return <button key={flag} type="button" className={done ? "done" : ""} disabled={done} onClick={() => chooseSystem(system)}><i>{done ? "✓" : String(index + 1)}</i>{label}</button>;
        })}
      </div>

      {!activeSystem && <p>{complete === config.items.length ? "COMPLETE — 奥の整備室へ進める" : config.hint}</p>}

      {activeSystem === "power" && !state.flags["gadget.powerRestored"] && (
        <section className="gadgetMiniPuzzle">
          <header><b>POWER ROUTING</b><button type="button" onClick={() => setActiveSystem(null)}>×</button></header>
          <p>低圧から順に系統を接続する。AUX → BUS → MAIN</p>
          <div className="breakerRow">
            {["AUX", "BUS", "MAIN"].map((label, index) => <button type="button" key={label} className={index < powerStep ? "on" : ""} onClick={() => pressPower(index)}>{label}<i /></button>)}
          </div>
          <small>{powerError ? "SEQUENCE ERROR — RESET" : `${powerStep} / 3 CONNECTED`}</small>
        </section>
      )}

      {activeSystem === "gear" && !state.flags["gadget.gearAligned"] && (
        <section className="gadgetMiniPuzzle">
          <header><b>GEAR PHASE</b><button type="button" onClick={() => setActiveSystem(null)}>×</button></header>
          <p>発光マーカーが上部の基準線へ揃うよう、3つの歯車を回す。</p>
          <div className="gearRow">
            {gearPhase.map((phase, index) => <button type="button" key={index} onClick={() => rotateGear(index)} aria-label={`歯車${index + 1}を回す`}><span style={{ transform: `rotate(${phase * 90}deg)` }}>◆</span><small>{phase * 90}°</small></button>)}
          </div>
          <small>TARGET: 90° / 180° / 270°</small>
        </section>
      )}

      {activeSystem === "crane" && !state.flags["gadget.craneMoved"] && (
        <section className="gadgetMiniPuzzle">
          <header><b>CRANE CLEARANCE</b><button type="button" onClick={() => setActiveSystem(null)}>×</button></header>
          <p>クレーンを黄色い退避ベイまで移動する。</p>
          <div className="craneTrack">
            {[0, 1, 2, 3, 4].map(position => <i key={position} className={`${position === cranePosition ? "current" : ""}${position === 3 ? " target" : ""}`} />)}
          </div>
          <div className="craneControls"><button type="button" onClick={() => moveCrane(-1)} disabled={cranePosition === 0}>← LEFT</button><button type="button" onClick={() => moveCrane(1)} disabled={cranePosition === 4}>RIGHT →</button></div>
          <small>BAY {cranePosition + 1} / TARGET BAY 4</small>
        </section>
      )}
    </aside>
  );
}
