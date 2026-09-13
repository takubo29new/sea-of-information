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

function snapshot(): GameState | null {
  if (typeof document === "undefined" || !document.querySelector(".gameScreen")) return null;
  return loadSave();
}

export function GameProgressHUD() {
  const [state, setState] = useState<GameState | null>(null);

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

  if (!state || !config) return null;

  const complete = config.items.filter(([flag]) => Boolean(state.flags[flag])).length;

  return (
    <aside className={`gameProgressHUD gameProgressHUD-${config.eyebrow.toLowerCase()}`} aria-live="polite">
      <div className="gameProgressHeader">
        <small>{config.eyebrow}</small>
        <b>{complete} / {config.items.length}</b>
      </div>
      <strong>{config.title}</strong>
      <div className="gameProgressItems">
        {config.items.map(([flag, label]) => {
          const done = Boolean(state.flags[flag]);
          return <span key={flag} className={done ? "done" : ""}><i>{done ? "✓" : ""}</i>{label}</span>;
        })}
      </div>
      <p>{complete === config.items.length ? "COMPLETE — 次の行動が可能" : config.hint}</p>
    </aside>
  );
}
