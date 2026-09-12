"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioManager, TRACK_META } from "@/engine/audio";
import { deleteSave, loadSave, saveGame } from "@/engine/saveClient";
import { INITIAL_STATE, type Dialogue, type GameState, type HotspotAction, type SceneId } from "@/engine/model";
import { dialogues, scenes } from "@/data/scenes";

export function GameApp() {
  const audioRef = useRef<AudioManager | null>(null);
  const [screen, setScreen] = useState<"title" | "game" | "archive">("title");
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [hasSave, setHasSave] = useState(false);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(0.72);
  const [savedFlash, setSavedFlash] = useState(false);
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicFocus, setMusicFocus] = useState<{ until: number; label: string; action: HotspotAction; phase: "listening" | "ready" } | null>(null);

  useEffect(() => {
    audioRef.current = new AudioManager();
    const existing = loadSave();
    setHasSave(Boolean(existing));
    const rawVolume = window.localStorage.getItem("sea-of-information:volume");
    const parsed = rawVolume ? Number(rawVolume) : 0.72;
    if (Number.isFinite(parsed)) {
      setVolume(parsed);
      audioRef.current.setVolume(parsed);
    }
    return () => audioRef.current?.destroy();
  }, []);

  const scene = scenes[state.sceneId];

  useEffect(() => {
    if (screen !== "game") return;
    const id = window.setInterval(() => setMusicPosition(audioRef.current?.getPosition() ?? 0), 250);
    return () => window.clearInterval(id);
  }, [screen]);

  const persist = useCallback((next: GameState) => {
    saveGame(next);
    setHasSave(true);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 900);
  }, []);

  const goToScene = useCallback((sceneId: SceneId) => {
    setDialogue(null);
    setLineIndex(0);
    setState(prev => {
      const target = scenes[sceneId];
      const nextFlags = { ...prev.flags };
      target.onEnterFlags?.forEach(flag => { nextFlags[flag] = true; });
      const nextMusic = [...prev.unlockedMusic];
      if (target.track && !nextMusic.includes(target.track)) nextMusic.push(target.track);
      const next: GameState = {
        ...prev,
        sceneId,
        flags: nextFlags,
        unlockedMusic: nextMusic,
        updatedAt: new Date().toISOString()
      };
      queueMicrotask(() => persist(next));
      return next;
    });
  }, [persist]);

  const runAction = useCallback((action?: HotspotAction) => {
    if (!action) return;
    audioRef.current?.resume();
    if (action.type === "advance") return goToScene(action.to);
    if (action.type === "dialogue") {
      setDialogue(dialogues[action.dialogueId]);
      setLineIndex(0);
      return;
    }
    if (action.type === "setFlagAndAdvance") {
      setState(prev => {
        const next = { ...prev, flags: { ...prev.flags, [action.flag]: true }, updatedAt: new Date().toISOString() };
        queueMicrotask(() => persist(next));
        return next;
      });
      return goToScene(action.to);
    }
    setState(prev => {
      const next = { ...prev, flags: { ...prev.flags, [action.flag]: true }, updatedAt: new Date().toISOString() };
      queueMicrotask(() => persist(next));
      return next;
    });
    setDialogue(dialogues[action.dialogueId]);
    setLineIndex(0);
  }, [goToScene, persist]);

  useEffect(() => {
    if (!musicFocus || musicFocus.phase !== "listening" || musicPosition < musicFocus.until) return;
    setMusicFocus(current => current ? { ...current, phase: "ready" } : current);
    const id = window.setTimeout(() => {
      const action = musicFocus.action;
      setMusicFocus(null);
      runAction(action);
    }, 1100);
    return () => window.clearTimeout(id);
  }, [musicFocus, musicPosition, runAction]);

  const openDialogue = useCallback((id: string) => {
    setDialogue(dialogues[id]);
    setLineIndex(0);
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    if (scene.track) audioRef.current?.play(scene.track, Boolean(scene.trackRestart));
    if (scene.enterDialogueId) openDialogue(scene.enterDialogueId);
  }, [screen, scene.id, scene.track, scene.trackRestart, scene.enterDialogueId, openDialogue]);

  const advanceDialogue = useCallback(() => {
    if (!dialogue) return;
    audioRef.current?.resume();
    if (lineIndex < dialogue.lines.length - 1) return setLineIndex(i => i + 1);
    const after = dialogue.after;
    setDialogue(null);
    setLineIndex(0);
    if (after) runAction(after);
  }, [dialogue, lineIndex, runAction]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (screen !== "game") return;
      if (event.key === "Escape") return setSettingsOpen(v => !v);
      if ((event.key === "Enter" || event.key === " ") && dialogue && !musicFocus) {
        event.preventDefault();
        advanceDialogue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, dialogue, musicFocus, advanceDialogue]);

  const startNewGame = () => {
    audioRef.current?.resume();
    const next = { ...INITIAL_STATE, updatedAt: new Date().toISOString() };
    setState(next);
    persist(next);
    setScreen("game");
  };

  const continueGame = () => {
    const existing = loadSave();
    if (!existing) return;
    setState(existing);
    setScreen("game");
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    audioRef.current?.setVolume(next);
    window.localStorage.setItem("sea-of-information:volume", String(next));
  };

  const visibleHotspots = useMemo(() => (scene.hotspots ?? []).filter(h => {
    if (h.visibleWhen && Boolean(state.flags[h.visibleWhen.flag]) !== h.visibleWhen.equals) return false;
    if (h.visibleWhenAll && !h.visibleWhenAll.every(flag => Boolean(state.flags[flag]))) return false;
    return true;
  }), [scene.hotspots, state.flags]);

  if (screen === "title") return <main className="titleScreen" onPointerDown={() => audioRef.current?.resume()}>
    <div className="titleOcean" aria-hidden="true"><img src="/art/title-background.webp" alt="" /><div className="titleHorizon" /><div className="dataRain" /></div>
    <section className="titlePanel"><p className="eyebrow">TAKUBO29 PRESENTS</p><h1>SEA OF<br />INFORMATION</h1><p className="titleTagline">過去は保存できる。未来は保存できない。</p>
      <nav className="titleMenu"><button onClick={startNewGame}>NEW GAME</button><button onClick={continueGame} disabled={!hasSave}>CONTINUE</button><button onClick={() => setScreen("archive")}>MUSIC ARCHIVE</button><button onClick={() => setSettingsOpen(true)}>SETTINGS</button></nav>
    </section>{settingsOpen && <Settings volume={volume} onVolume={changeVolume} onClose={() => setSettingsOpen(false)} />}
  </main>;

  if (screen === "archive") {
    const unlocked = hasSave ? (loadSave()?.unlockedMusic ?? ["sea-of-information"]) : ["sea-of-information"];
    return <main className="archiveScreen"><header className="archiveHeader"><div><p className="eyebrow">MUSIC ARCHIVE</p><h2>記憶された音楽</h2></div><button onClick={() => { audioRef.current?.pause(); setScreen("title"); }}>BACK</button></header>
      <div className="archiveGrid">{(["sea-of-information", "city-of-dawn", "load-road", "gadget-area"] as const).map((id, i) => {
        const available = unlocked.includes(id);
        return <button key={id} className="trackCard" disabled={!available} onClick={() => audioRef.current?.play(id, true)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{available ? TRACK_META[id].title : "LOCKED"}</strong><small>{available ? "Takubo29" : "—"}</small></button>;
      })}</div>
    </main>;
  }

  return <main className={`gameScreen art-${scene.art}`} onPointerDown={() => audioRef.current?.resume()}>
    <SceneArt art={scene.art} /><div className="cinemaGrain" aria-hidden="true" />
    {scene.title && <div className="chapterCard" key={scene.id}><span>{scene.subtitle}</span><h2>{scene.title}</h2></div>}
    {scene.track && <NowPlaying track={scene.track} position={musicPosition} />}
    <button className="menuButton" onClick={() => setSettingsOpen(true)}>MENU</button>
    {!musicFocus && visibleHotspots.map(h => {
      const locked = typeof h.requiresTrackTime === "number" && musicPosition < h.requiresTrackTime;
      const label = locked ? (h.lockedLabel ?? "音に耳を澄ます") : h.label;
      return <button key={h.id} className={`hotspot${locked ? " hotspot-locked" : ""}`} style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.width}%`, height: `${h.height}%` }} onClick={() => {
        if (locked && typeof h.requiresTrackTime === "number") return setMusicFocus({ until: h.requiresTrackTime, label, action: h.action, phase: "listening" });
        runAction(h.action);
      }}><span>{label}</span></button>;
    })}
    {scene.id === "vertical-slice-end" && <section className="sliceEnd"><p>VERTICAL SLICE 0.5</p><h2>99.7%は、同じという意味だろうか。</h2><p>CHAPTER 2 — Gadget Area / BIT INTRODUCTION</p><div><button onClick={() => setScreen("title")}>TITLE</button><button onClick={() => { deleteSave(); setHasSave(false); startNewGame(); }}>RESTART</button></div></section>}
    {dialogue && !musicFocus && <DialogueBox dialogue={dialogue} lineIndex={lineIndex} onAdvance={advanceDialogue} />}
    {musicFocus && scene.track && <MusicFocus track={scene.track} position={musicPosition} until={musicFocus.until} label={musicFocus.label} phase={musicFocus.phase} />}
    {savedFlash && <div className="savedFlash">SAVED</div>}
    {settingsOpen && <Settings volume={volume} onVolume={changeVolume} onClose={() => setSettingsOpen(false)} onTitle={() => { audioRef.current?.pause(); setSettingsOpen(false); setScreen("title"); }} />}
  </main>;
}

function MusicFocus({ track, position, until, label, phase }: { track: keyof typeof TRACK_META; position: number; until: number; label: string; phase: "listening" | "ready" }) {
  const meta = TRACK_META[track];
  const progress = Math.min(100, Math.max(0, (position / meta.duration) * 100));
  const fmt = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  const art = track === "sea-of-information" ? "/art/sea-music.webp" : track === "city-of-dawn" ? "/art/city-music.webp" : null;
  return <section className={`musicFocus musicFocus-${phase} musicFocus-track-${track}`} aria-live="polite">
    {art && <img className="musicFocusArt" src={art} alt="" />}
    {!art && <div className="musicFocusGeneratedBackdrop" aria-hidden="true" />}
    <div className="musicFocusShade" />
    <div className="musicFocusContent">
      <p className="musicFocusKicker">{phase === "ready" ? "SCENE UNLOCKED" : "LISTENING PHASE"}</p><h2>{meta.title}</h2>
      <p className="musicFocusMessage">{phase === "ready" ? "音が次の場面へつながりました。" : label}</p>
      <div className="musicWave">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ height: `${18 + ((i * 17) % 52)}%` }} />)}</div>
      <div className="musicFocusProgress"><i style={{ width: `${progress}%` }} /></div>
      <div className="musicFocusMeta"><span>{fmt(position)}</span><span>次の場面 {fmt(until)}</span><span>{fmt(meta.duration)}</span></div>
      <p className="musicFocusHint">{phase === "ready" ? "進行可能 — 戻ります" : "操作待ちではありません。音と景色が次の場面を開くまで、そのまま聴いてください。"}</p>
    </div>
  </section>;
}

function NowPlaying({ track, position }: { track: keyof typeof TRACK_META; position: number }) {
  const meta = TRACK_META[track]; const progress = Math.min(100, Math.max(0, (position / meta.duration) * 100)); const fmt = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return <div className="nowPlaying"><div className="nowPlayingTitle"><span>♪</span><strong>{meta.title}</strong><small>{fmt(position)} / {fmt(meta.duration)}</small></div><div className="nowPlayingBar"><i style={{ width: `${progress}%` }} /></div></div>;
}

function DialogueBox({ dialogue, lineIndex, onAdvance }: { dialogue: Dialogue; lineIndex: number; onAdvance: () => void }) {
  const line = dialogue.lines[lineIndex]; return <button className="dialogueBox" onClick={onAdvance}>{line.speaker && <span className={`speaker speaker-${line.speaker.toLowerCase()}`}>{line.speaker}</span>}<span className="dialogueText">{line.text}</span><span className="dialogueHint">CLICK / ENTER</span></button>;
}

function Settings({ volume, onVolume, onClose, onTitle }: { volume: number; onVolume: (n: number) => void; onClose: () => void; onTitle?: () => void }) {
  const fullscreen = async () => { if (!document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => undefined); else await document.exitFullscreen().catch(() => undefined); };
  return <div className="modalBackdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="settingsPanel"><div className="settingsTitle"><span>SETTINGS</span><button onClick={onClose}>×</button></div><label>BGM VOLUME <strong>{Math.round(volume * 100)}</strong><input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => onVolume(Number(e.target.value))} /></label><button className="settingsAction" onClick={fullscreen}>FULLSCREEN</button>{onTitle && <button className="settingsAction" onClick={onTitle}>RETURN TO TITLE</button>}<p>会話送り: クリック / Enter / Space　設定: Esc</p></section></div>;
}

function SceneArt({ art }: { art: string }) {
  const realArt = art === "sea" || art === "terminal" || art === "dive" ? "/art/sea-music.webp" : art === "noa" ? "/art/city-noa.webp" : ["city", "city-glitch", "city-investigation", "dusk", "night"].includes(art) ? "/art/city-explore.webp" : null;
  return <div className="sceneArt" aria-hidden="true">
    {realArt && <img className={`sceneIllustration sceneIllustration-${art}`} src={realArt} alt="" />}
    {art === "sea" && <><div className="seaHorizon"/><div className="memoryCard m1"/><div className="memoryCard m2"/><div className="memoryCard m3"/><div className="reiSilhouette"/></>}
    {art === "terminal" && <><div className="seaHorizon"/><div className="terminalMonolith"><span>ADMIN</span></div><div className="reiSilhouette near"/></>}
    {art === "dive" && <><div className="diveRing"><span>DIVE</span></div><div className="reiSilhouette"/></>}
    {(art === "city" || art === "city-glitch" || art === "city-investigation") && <><div className="sun"/><div className="skyline back"/><div className="skyline front"/><div className="clockTower"><span>08:42</span></div><div className="stationSign">DAWN ST.</div><div className="childFigure"/><div className="noaFigure"/>{art === "city-glitch" && <div className="glitchBand"/>}{art === "city-investigation" && <div className="investigationOverlay"><span>TRACE / CLOCK</span><span>TRACE / TRAIN</span><span>TRACE / BAKERY</span></div>}</>}
    {art === "noa" && <><div className="sun"/><div className="skyline back"/><div className="noaPortrait"><div className="scarf"/></div><div className="reiSilhouette left"/></>}
    {art === "aurora-gate" && <><div className="auroraTunnel"/><div className="auroraDoor"><span>AURORA</span></div><div className="reiSilhouette left"/><div className="noaFigure gate"/></>}
    {art === "aurora" && <><div className="auroraCore"><span>AURORA</span></div><div className="reiSilhouette left"/><div className="noaFigure core"/><div className="auroraGrid"/></>}
    {art === "dusk" && <><div className="duskSun"/><div className="skyline back"/><div className="skyline front"/><div className="clockTower"><span>08:43</span></div><div className="noaFigure"/><div className="reiSilhouette left"/></>}
    {art === "night" && <><div className="stars"/><div className="skyline back"/><div className="skyline front"/><div className="clockTower"><span>20:14</span></div><div className="noaFigure"/><div className="reiSilhouette left"/></>}
    {art === "load-road" && <><div className="loadRoadLane"/><div className="loadRoadFragments"><i/><i/><i/><i/></div><div className="reiSilhouette"/></>}
    {(art === "gadget-entry" || art === "gadget-machinery") && <><div className="gadgetFactoryDepth"/><div className="gadgetGear gearA"/><div className="gadgetGear gearB"/><div className="gadgetConveyor"/><div className="gadgetCrane"/><div className="reiSilhouette left"/></>}
    {art === "gadget-bit" && <><div className="gadgetFactoryDepth"/><div className="maintenanceBench"/><div className="bitFigure"><span>• _ •</span></div><div className="reiSilhouette left"/></>}
    {art === "gadget-auth" && <><div className="gadgetAuthPanel"><span>IDENTITY MATCH</span><strong>99.7%</strong><small>ADMINISTRATOR / REI</small></div><div className="bitFigure auth"><span>• _ •</span></div><div className="reiSilhouette left"/></>}
    {art === "end" && <div className="endGlow"/>}
  </div>;
}
