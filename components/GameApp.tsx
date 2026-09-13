"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioManager, TRACK_META } from "@/engine/audio";
import { deleteSave, loadSave, saveGame } from "@/engine/saveClient";
import { INITIAL_STATE, type Dialogue, type GameState, type HotspotAction, type SceneId, type TrackId } from "@/engine/model";
import { dialogues, scenes } from "@/data/scenes";
import { SceneVisual } from "@/components/visual/SceneVisual";
import { ListeningStage } from "@/components/visual/ListeningStage";

const MUSIC_POSITION_PREFIX = "sea-of-information:music-position:";
const SEA_MEMORY_IDS = ["memory-light", "memory-voice", "memory-sky"] as const;

function musicPositionKey(track: TrackId) {
  return `${MUSIC_POSITION_PREFIX}${track}`;
}

function hideBrokenArt(event: React.SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = "none";
}

export function GameApp() {
  const audioRef = useRef<AudioManager | null>(null);
  const transitionLockRef = useRef(false);
  const dialogueLockRef = useRef(false);
  const pendingPersistRef = useRef(false);
  const restoreMusicPositionRef = useRef<number | null>(null);
  const lastMusicPersistRef = useRef(0);
  const [screen, setScreen] = useState<"title" | "game" | "archive">("title");
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [hasSave, setHasSave] = useState(false);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(0.72);
  const [savedFlash, setSavedFlash] = useState(false);
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const [musicFocus, setMusicFocus] = useState<{ until: number; label: string; action: HotspotAction; phase: "listening" | "ready" } | null>(null);
  const [inspectedHotspots, setInspectedHotspots] = useState<Record<string, boolean>>({});

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
  const hotspotKey = useCallback((sceneId: SceneId, hotspotId: string) => `${sceneId}:${hotspotId}`, []);
  const seaMemoryCount = SEA_MEMORY_IDS.reduce((count, id) => count + (inspectedHotspots[hotspotKey("sea-awakening", id)] ? 1 : 0), 0);

  useEffect(() => {
    if (screen !== "game") return;
    const id = window.setInterval(() => {
      const position = audioRef.current?.getPosition() ?? 0;
      setMusicPosition(position);
      setMusicDuration(audioRef.current?.getDuration() ?? 0);

      const track = audioRef.current?.getCurrentTrack();
      const now = Date.now();
      if (track && now - lastMusicPersistRef.current >= 1000) {
        lastMusicPersistRef.current = now;
        window.localStorage.setItem(musicPositionKey(track), String(position));
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [screen]);

  const persist = useCallback((next: GameState) => {
    saveGame(next);
    setHasSave(true);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 900);
  }, []);

  useEffect(() => {
    if (!pendingPersistRef.current) return;
    pendingPersistRef.current = false;
    persist(state);
  }, [state, persist]);

  const goToScene = useCallback((sceneId: SceneId) => {
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;
    window.setTimeout(() => { transitionLockRef.current = false; }, 300);
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
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
      pendingPersistRef.current = true;
      return next;
    });
  }, []);

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
        pendingPersistRef.current = true;
        return next;
      });
      return goToScene(action.to);
    }
    setState(prev => {
      const next = { ...prev, flags: { ...prev.flags, [action.flag]: true }, updatedAt: new Date().toISOString() };
      pendingPersistRef.current = true;
      return next;
    });
    setDialogue(dialogues[action.dialogueId]);
    setLineIndex(0);
  }, [goToScene]);

  useEffect(() => {
    if (!musicFocus || musicFocus.phase !== "listening" || musicPosition < musicFocus.until) return;
    setMusicFocus(current => current ? { ...current, phase: "ready" } : current);
  }, [musicFocus, musicPosition]);

  useEffect(() => {
    if (!musicFocus || musicFocus.phase !== "ready") return;
    const action = musicFocus.action;
    const id = window.setTimeout(() => {
      setMusicFocus(null);
      runAction(action);
    }, 1100);
    return () => window.clearTimeout(id);
  }, [musicFocus, runAction]);

  const openDialogue = useCallback((id: string) => {
    setDialogue(dialogues[id]);
    setLineIndex(0);
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    let cancelled = false;
    const startTrack = async () => {
      if (!scene.track) return;
      await audioRef.current?.play(scene.track, Boolean(scene.trackRestart));
      if (cancelled) return;
      const restorePosition = restoreMusicPositionRef.current;
      if (restorePosition !== null) {
        audioRef.current?.seek(restorePosition);
        setMusicPosition(restorePosition);
        restoreMusicPositionRef.current = null;
      }
    };
    void startTrack();
    if (scene.enterDialogueId) openDialogue(scene.enterDialogueId);
    return () => { cancelled = true; };
  }, [screen, scene.id, scene.track, scene.trackRestart, scene.enterDialogueId, openDialogue]);

  const advanceDialogue = useCallback(() => {
    if (!dialogue || dialogueLockRef.current) return;
    dialogueLockRef.current = true;
    window.setTimeout(() => { dialogueLockRef.current = false; }, 150);
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
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
    setInspectedHotspots({});
    restoreMusicPositionRef.current = null;
    (Object.keys(TRACK_META) as TrackId[]).forEach(track => window.localStorage.removeItem(musicPositionKey(track)));
    const next = { ...INITIAL_STATE, updatedAt: new Date().toISOString() };
    setState(next);
    persist(next);
    setScreen("game");
  };

  const continueGame = () => {
    const existing = loadSave();
    if (!existing) return;
    const resumeScene = scenes[existing.sceneId];
    if (resumeScene.track) {
      const stored = Number(window.localStorage.getItem(musicPositionKey(resumeScene.track)) ?? "0");
      restoreMusicPositionRef.current = Number.isFinite(stored) && stored > 0 ? stored : null;
    } else {
      restoreMusicPositionRef.current = null;
    }
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
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
    if (scene.id === "sea-awakening" && h.id === "terminal-light" && seaMemoryCount < SEA_MEMORY_IDS.length) return false;
    return true;
  }), [scene.hotspots, scene.id, state.flags, seaMemoryCount]);

  if (screen === "title") return <main className="titleScreen" onPointerDown={() => audioRef.current?.resume()}>
    <div className="titleOcean" aria-hidden="true"><img src="/art/title/title-keyvisual.webp" alt="" onError={hideBrokenArt} /><div className="titleHorizon" /><div className="dataRain" /></div>
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
    <SceneVisual artKey={scene.art} /><div className="cinemaGrain" aria-hidden="true" />
    {scene.title && <div className="chapterCard" key={scene.id}><span>{scene.subtitle}</span><h2>{scene.title}</h2></div>}
    {scene.id === "sea-awakening" && <section className="prologueObjective"><small>OBJECTIVE</small><strong>3つの記憶断片を復元する</strong><div className="objectiveProgress">{SEA_MEMORY_IDS.map(id => <i key={id} className={inspectedHotspots[hotspotKey("sea-awakening", id)] ? "done" : ""} />)}</div><p>{seaMemoryCount}/3 復元済み{seaMemoryCount === 3 ? " — 新しい信号を検出" : ""}</p></section>}
    {scene.track && <NowPlaying track={scene.track} position={musicPosition} duration={musicDuration || TRACK_META[scene.track].duration} />}
    <button className="menuButton" onClick={() => setSettingsOpen(true)}>MENU</button>
    {!musicFocus && visibleHotspots.map(h => {
      const key = hotspotKey(scene.id, h.id);
      const locked = typeof h.requiresTrackTime === "number" && musicPosition < h.requiresTrackTime;
      const label = locked ? (h.lockedLabel ?? "音に耳を澄ます") : h.label;
      const inspected = Boolean(inspectedHotspots[key]);
      return <button key={h.id} className={`hotspot${locked ? " hotspot-locked" : ""}${inspected ? " hotspot-complete" : ""}`} style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.width}%`, height: `${h.height}%` }} onClick={() => {
        setInspectedHotspots(prev => ({ ...prev, [key]: true }));
        if (locked && typeof h.requiresTrackTime === "number") return setMusicFocus({ until: h.requiresTrackTime, label, action: h.action, phase: "listening" });
        runAction(h.action);
      }}><span>{inspected && scene.id === "sea-awakening" ? `✓ ${label}` : label}</span></button>;
    })}
    {scene.id === "vertical-slice-end" && <section className="sliceEnd"><p>VERTICAL SLICE 0.7</p><h2>99.7%は、同じという意味だろうか。</h2><p>CHAPTER 2 — Gadget Area / BIT INTRODUCTION</p><div><button onClick={() => setScreen("title")}>TITLE</button><button onClick={() => { deleteSave(); setHasSave(false); startNewGame(); }}>RESTART</button></div></section>}
    {dialogue && !musicFocus && <DialogueBox dialogue={dialogue} lineIndex={lineIndex} onAdvance={advanceDialogue} />}
    {musicFocus && scene.track && <ListeningStage track={scene.track} title={TRACK_META[scene.track].title} position={musicPosition} duration={musicDuration || TRACK_META[scene.track].duration} unlockAt={musicFocus.until} phase={musicFocus.phase} />}
    {savedFlash && <div className="savedFlash">SAVED</div>}
    {settingsOpen && <Settings volume={volume} onVolume={changeVolume} onClose={() => setSettingsOpen(false)} onTitle={() => { audioRef.current?.pause(); setSettingsOpen(false); setDialogue(null); setLineIndex(0); setMusicFocus(null); setScreen("title"); }} />}
  </main>;
}

function NowPlaying({ track, position, duration }: { track: keyof typeof TRACK_META; position: number; duration: number }) {
  const meta = TRACK_META[track];
  const progress = Math.min(100, Math.max(0, (position / duration) * 100));
  const fmt = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return <div className="nowPlaying"><div className="nowPlayingTitle"><span>♪</span><strong>{meta.title}</strong><small>{fmt(position)} / {fmt(duration)}</small></div><div className="nowPlayingBar"><i style={{ width: `${progress}%` }} /></div></div>;
}

function DialogueBox({ dialogue, lineIndex, onAdvance }: { dialogue: Dialogue; lineIndex: number; onAdvance: () => void }) {
  const line = dialogue.lines[lineIndex];
  return <button className="dialogueBox" onClick={onAdvance}>{line.speaker && <span className={`speaker speaker-${line.speaker.toLowerCase()}`}>{line.speaker}</span>}<span className="dialogueText">{line.text}</span><span className="dialogueHint">CLICK / ENTER</span></button>;
}

function Settings({ volume, onVolume, onClose, onTitle }: { volume: number; onVolume: (n: number) => void; onClose: () => void; onTitle?: () => void }) {
  const fullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => undefined);
    else await document.exitFullscreen().catch(() => undefined);
  };
  return <div className="modalBackdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="settingsPanel"><div className="settingsTitle"><span>SETTINGS</span><button onClick={onClose}>×</button></div><label>BGM VOLUME <strong>{Math.round(volume * 100)}</strong><input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => onVolume(Number(e.target.value))} /></label><button className="settingsAction" onClick={fullscreen}>FULLSCREEN</button>{onTitle && <button className="settingsAction" onClick={onTitle}>RETURN TO TITLE</button>}<p>会話送り: クリック / Enter / Space　設定: Esc</p></section></div>;
}
