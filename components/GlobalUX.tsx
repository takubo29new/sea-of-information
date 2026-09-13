"use client";

import { useEffect, useState } from "react";

type Pulse = { id: number; x: number; y: number };

export function GlobalUX() {
  const [showTitleNotice, setShowTitleNotice] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    const syncTitle = () => setShowTitleNotice(Boolean(document.querySelector(".titleScreen")));
    syncTitle();

    const observer = new MutationObserver(syncTitle);
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

    window.addEventListener("click", onClick, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("click", onClick, true);
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
