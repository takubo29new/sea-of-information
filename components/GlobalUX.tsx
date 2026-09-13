"use client";

import "@/data/registerFutureScenes";
import { useEffect, useState } from "react";
import { loadManualSave, loadSave } from "@/engine/saveClient";
import { playActiveAudio, seekActiveAudio, TRACK_META } from "@/engine/audio";
import type { TrackId } from "@/engine/model";
import { scenes } from "@/data/scenes";

type Pulse = { id: number; x: number; y: number };
type ListeningMarker = { sceneId: string; track: TrackId; unlockAt: number };

const MODAL_FOCUSABLE = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";
const MANUAL_LISTENING_MARKER = "sea-of-information:manual-listening-marker";
const MANUAL_MUSIC_POSITION_KEY = "sea-of-information:manual-music-position";
const MANUAL_MUSIC_TRACK_KEY = "sea-of-information:manual-music-track";

function parseClock(value: string) {
  const match = value.match(/(\d+):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function currentListeningMarker(): ListeningMarker | null {
  const stage = document.querySelector<HTMLElement>(".listeningStage");
  const saved = loadManualSave();
  if (!stage || !saved) return null;

  const trackClass = Array.from(stage.classList).find(name => name.startsWith("listeningStage-track-"));
  const track = trackClass?.replace("listeningStage-track-", "") as TrackId | undefined;
  const unlockText = stage.querySelector<HTMLElement>(".listeningStageTimes span:nth-child(2)")?.textContent ?? "";
  const unlockAt = parseClock(unlockText);
  if (!track || unlockAt === null) return null;
  return { sceneId: saved.sceneId, track, unlockAt };
}

function restoreManualContext(marker: ListeningMarker | null) {
  const saved = loadManualSave();
  if (!saved) return;

  const storedTrack = window.localStorage.getItem(MANUAL_MUSIC_TRACK_KEY) as TrackId | null;
  const storedPosition = Number(window.localStorage.getItem(MANUAL_MUSIC_POSITION_KEY) ?? "0");
  if (storedTrack && Number.isFinite(storedPosition) && storedPosition > 0) {
    seekActiveAudio(storedPosition, storedTrack);
  }

  if (!marker || marker.sceneId !== saved.sceneId || document.querySelector(".listeningStage")) return;
  const scene = scenes[saved.sceneId];
  if (!scene || scene.track !== marker.track) return;

  const source = scene.hotspots?.find(hotspot => {
    if (typeof hotspot.requiresTrackTime !== "number") return false;
    const unlockAt = scene.id === "sea-dive" && hotspot.id === "dive-gate"
      ? Math.max(hotspot.requiresTrackTime, 165)
      : hotspot.requiresTrackTime;
    return Math.abs(unlockAt - marker.unlockAt) < 0.6;
  });
  if (!source) return;

  const expectedLabel = source.lockedLabel ?? source.label;
  const hotspot = Array.from(document.querySelectorAll<HTMLButtonElement>(".gameScreen .hotspot"))
    .find(button => (button.textContent ?? "").includes(expectedLabel));
  hotspot?.click();
}

function syncExtendedMusicArchive() {
  const grid = document.querySelector<HTMLElement>(".archiveScreen .archiveGrid");
  if (!grid) return;

  const unlocked = loadSave()?.unlockedMusic ?? ["sea-of-information"];
  const tracks = Object.keys(TRACK_META) as TrackId[];
  const builtInTitles = new Set(Array.from(grid.querySelectorAll<HTMLElement>(".trackCard strong")).map(node => node.textContent ?? ""));

  tracks.forEach((track, index) => {
    const meta = TRACK_META[track];
    if (builtInTitles.has(meta.title) || grid.querySelector(`[data-extended-track="${track}"]`)) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "trackCard extendedTrackCard";
    button.dataset.extendedTrack = track;
    const available = unlocked.includes(track);
    button.disabled = !available;

    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("strong");
    title.textContent = available ? meta.title : "LOCKED";
    const status = document.createElement("small");
    status.textContent = available ? "Takubo29" : "—";
    button.append(number, title, status);
    grid.append(button);
  });
}

export function GlobalUX() {
  const [showTitleNotice, setShowTitleNotice] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    let activeModal: HTMLElement | null = null;
    let focusBeforeModal: HTMLElement | null = null;

    const syncUiState = () => {
      setShowTitleNotice(Boolean(document.querySelector(".titleScreen")));
      syncExtendedMusicArchive();

      const modal = document.querySelector<HTMLElement>(".modalBackdrop");
      if (modal && !activeModal) {
        activeModal = modal;
        focusBeforeModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        window.queueMicrotask(() => {
          const first = modal.querySelector<HTMLElement>(MODAL_FOCUSABLE);
          first?.focus();
        });
        return;
      }

      if (!modal && activeModal) {
        activeModal = null;
        const previous = focusBeforeModal;
        focusBeforeModal = null;
        window.queueMicrotask(() => {
          if (previous?.isConnected) previous.focus();
        });
      }
    };
    syncUiState();

    const observer = new MutationObserver(syncUiState);
    observer.observe(document.body, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest?.("button") as HTMLButtonElement | null;
      const buttonText = button?.textContent ?? "";

      if (buttonText.includes("SAVE NOW")) {
        window.setTimeout(() => {
          const marker = currentListeningMarker();
          if (marker) window.localStorage.setItem(MANUAL_LISTENING_MARKER, JSON.stringify(marker));
          else window.localStorage.removeItem(MANUAL_LISTENING_MARKER);
        }, 0);
      }

      if (buttonText.includes("LOAD MANUAL SAVE")) {
        let marker: ListeningMarker | null = null;
        const raw = window.localStorage.getItem(MANUAL_LISTENING_MARKER);
        if (raw) {
          try { marker = JSON.parse(raw) as ListeningMarker; } catch { marker = null; }
        }
        [180, 700, 1400].forEach(delay => window.setTimeout(() => restoreManualContext(marker), delay));
      }

      const trackCard = target?.closest?.(".archiveScreen .trackCard") as HTMLButtonElement | null;
      if (trackCard && !trackCard.disabled) {
        const extendedTrack = trackCard.dataset.extendedTrack as TrackId | undefined;
        if (extendedTrack) playActiveAudio(extendedTrack, true);

        document.querySelectorAll<HTMLElement>(".archiveScreen .trackCard.is-playing").forEach(card => {
          card.classList.remove("is-playing");
          const status = card.querySelector<HTMLElement>("small");
          if (status) status.textContent = "Takubo29";
        });
        trackCard.classList.add("is-playing");
        const status = trackCard.querySelector<HTMLElement>("small");
        if (status) status.textContent = "NOW PLAYING";
      }

      const hotspot = target?.closest?.(".hotspot") as HTMLElement | null;
      if (!hotspot) return;
      const rect = hotspot.getBoundingClientRect();
      const pulse: Pulse = {
        id: Date.now() + Math.random(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      setPulses(previous => [...previous, pulse]);
      window.setTimeout(() => {
        setPulses(previous => previous.filter(item => item.id !== pulse.id));
      }, 700);
    };

    const onModalKeyDown = (event: KeyboardEvent) => {
      const modal = document.querySelector<HTMLElement>(".modalBackdrop");
      if (!modal) return;

      const focusables = Array.from(modal.querySelectorAll<HTMLElement>(MODAL_FOCUSABLE));
      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const closeButton = modal.querySelector<HTMLButtonElement>(".settingsTitle button");
        closeButton?.click();
        return;
      }

      if (event.key === "Tab") {
        if (focusables.length === 0) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const isOutside = !active || !modal.contains(active);
        const shouldWrapBack = event.shiftKey && (isOutside || active === first);
        const shouldWrapForward = !event.shiftKey && (isOutside || active === last);

        if (shouldWrapBack || shouldWrapForward) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          (shouldWrapBack ? last : first).focus();
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (active instanceof HTMLButtonElement && modal.contains(active) && !active.disabled) {
          active.click();
          return;
        }

        if (!active || !modal.contains(active)) {
          focusables[0]?.focus();
        }
      }
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onModalKeyDown, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onModalKeyDown, true);
    };
  }, []);

  return (
    <>
      {showTitleNotice && (
        <aside className="startNotice" aria-label="プレイ前の案内">
          <small>BEFORE PLAY</small>
          <strong>このゲームは音が出ます</strong>
          <p>音楽と演出を中心に進むため、可能であればイヤホン・ヘッドホンでお楽しみください。</p>
          <p className="startNoticeAI">ゲーム制作にはAIを活用していますが、収録楽曲はAI生成ではありません。楽曲はTakubo29によるオリジナル制作です。</p>
        </aside>
      )}

      <div className="hotspotFeedbackLayer" aria-hidden="true">
        {pulses.map(pulse => (
          <i key={pulse.id} className="hotspotClickPulse" style={{ left: pulse.x, top: pulse.y }} />
        ))}
      </div>
    </>
  );
}
