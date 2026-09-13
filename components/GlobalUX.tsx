"use client";

import { useEffect, useState } from "react";

type Pulse = { id: number; x: number; y: number };

const MODAL_FOCUSABLE = "button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

export function GlobalUX() {
  const [showTitleNotice, setShowTitleNotice] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    let activeModal: HTMLElement | null = null;
    let focusBeforeModal: HTMLElement | null = null;

    const syncUiState = () => {
      setShowTitleNotice(Boolean(document.querySelector(".titleScreen")));

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
