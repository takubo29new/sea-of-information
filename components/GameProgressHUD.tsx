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

const CITY_INVESTIGATE = [
  ["city.clueClock", "CLOCK"],
  ["city.clueStation", "STATION"],
  ["city.clueBakery", "BAKERY"],
] as const;

const GADGET_SYSTEMS = [
  ["gadget.powerRestored", "POWER"],
  ["gadget.gearAligned", "GEAR"],
  ["gadget.craneMoved", "CRANE"],
] as const;

const WISH_MESSAGES = [
  ["wish.message1", "MESSAGE 01"],
  ["wish.message2", "MESSAGE 02"],
  ["wish.message3", "MESSAGE 03"],
] as const;

const FANTASY_SIGNS = [
  ["fantasy.sky", "SKY"],
  ["fantasy.bridge", "BRIDGE"],
  ["fantasy.flowers", "FLOWERS"],
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
      ["電源", "歯車", "クレーン"].forEach(prefix => {
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
        completeHint: "COMPLETE — 駅への経路を確認",
        items: CITY_OBSERVE,
      };
    }
    if (state.sceneId === "city-loop-2") {
      return {
        eyebrow: "COMPARE",
        title: "前の朝と照合する",
        hint: "一致を確認して結果へ介入する",
        completeHint: "COMPLETE — 少年への介入が可能",
        items: CITY_COMPARE,
      };
    }
    if (state.sceneId === "city-investigation") {
      return {
        eyebrow: "INVESTIGATE",
        title: "朝を止めている仕組みを探す",
        hint: "3つの記録を調べる",
        completeHint: "COMPLETE — 地下制御区画への経路を確認",
        items: CITY_INVESTIGATE,
      };
    }
    if (state.sceneId === "gadget-machinery") {
      return {
        eyebrow: "RESTORE",
        title: "機械区画を復旧する",
        hint: "3つすべて動かすと整備室が開く",
        completeHint: "COMPLETE — 奥の整備室へ進める",
        items: GADGET_SYSTEMS,
      };
    }
    if (state.sceneId === "wish-entry") {
      return {
        eyebrow: "LISTEN",
        title: "残されたメッセージを聞く",
        hint: "まず3件のメッセージを確かめる",
        completeHint: "COMPLETE — 結果記録を確認できる",
        items: WISH_MESSAGES,
      };
    }
    if (state.sceneId === "fantasy-entry") {
      return {
        eyebrow: "TRACE",
        title: "保存元のない景色を調べる",
        hint: "3つの違和感を確かめる",
        completeHint: "COMPLETE — 保存元を照合できる",
        items: FANTASY_SIGNS,
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
    if (next === 3) window.setTimeout(() => finishSystem("電源"), 260);
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

      {!activeSystem && <p>{complete === config.items.length ? config.completeHint : config.hint}</p>}

      {activeSystem === "power" && !state.flags["gadget.powerRestored"] && (
        <section className="gadgetMiniPuzzle">
          <header><b>POWER ROUTING</b><button type="button" onClick={() => setActiveSystem(null)}>×</button></header>
          <p>左から順に3つのスイッチを入れて、電源をつなぐ。</p>
          <div className="breakerRow">
            {["AUX", "BUS", "MAIN"].map((label, index) => <button type="button" key={label} className={index < powerStep ? "on" : ""} onClick={() => pressPower(index)}>{label}<i /></button>)}
          </div>
          <small>{powerError ? "SEQUENCE ERROR — RESET" : `${powerStep} / 3 CONNECTED`}</small>
        </section>
      )}

      {activeSystem === "gear" && !state.flags["gadget.gearAligned"] && (
        <section className="gadgetMiniPuzzle">
          <header><b>GEAR ALIGN</b><button type="button" onClick={() => setActiveSystem(null)}>×</button></header>
          <p>光る印が上の基準線に合うよう、3つの歯車を回す。</p>
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
