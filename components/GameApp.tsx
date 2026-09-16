"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioManager, TRACK_META } from "@/engine/audio";
import {
  deleteSave,
  hasManualSave,
  loadManualSave,
  loadSave,
  saveGame,
  saveManualGame
} from "@/engine/saveClient";
import {
  INITIAL_STATE,
  SCENE_IDS,
  type Dialogue,
  type GameState,
  type HotspotAction,
  type SceneId,
  type TrackId
} from "@/engine/model";
import { dialogues, scenes } from "@/data/scenes";
import { getReiCharacterForArt, SceneVisual } from "@/components/visual/SceneVisual";
import { ListeningStage } from "@/components/visual/ListeningStage";
import { TrackTransition } from "@/components/TrackTransition";

const MUSIC_POSITION_PREFIX = "sea-of-information:music-position:";
const MANUAL_MUSIC_POSITION_KEY = "sea-of-information:manual-music-position";
const MANUAL_MUSIC_TRACK_KEY = "sea-of-information:manual-music-track";
const SEA_MEMORY_IDS = ["memory-light", "memory-voice", "memory-sky"] as const;
const SEA_DIVE_MIN_TIME = 165;

const DEBUG_TRACK_SCENE: Record<TrackId, SceneId> = {
  "sea-of-information": "sea-awakening",
  "city-of-dawn": "city-loop-1",
  "load-road": "load-road-1",
  "gadget-area": "gadget-entry",
  wish: "wish-entry",
  fantasy: "fantasy-entry",
  beautiful: "beautiful-entry",
  break: "break-entry",
  blavery: "blavery-entry",
  naked: "naked-entry",
  signal: "signal-entry",
  spacecraft: "spacecraft-entry",
  "new-create": "new-create-entry",
  thundercloud: "thundercloud-entry",
  "space-home": "space-home-entry"
};

type MusicFocusState = {
  until: number;
  label: string;
  action: HotspotAction;
  phase: "listening" | "ready";
  checkpointKey: string;
  canSkip: boolean;
};

type PendingTrackTransition = {
  action: HotspotAction;
  current: TrackId;
  next: TrackId;
};

function musicPositionKey(track: TrackId) {
  return `${MUSIC_POSITION_PREFIX}${track}`;
}

function seenFlag(sceneId: SceneId, hotspotId: string) {
  return `seen.${sceneId}.${hotspotId}`;
}

function listenedFlag(sceneId: SceneId, hotspotId: string) {
  return `listened.${sceneId}.${hotspotId}`;
}

function requiredTrackTime(sceneId: SceneId, hotspotId: string, original?: number) {
  if (sceneId === "sea-dive" && hotspotId === "dive-gate") return Math.max(original ?? 0, SEA_DIVE_MIN_TIME);
  return original;
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
  const fadeInNextTrackRef = useRef(false);

  const [screen, setScreen] = useState<"title" | "game" | "archive">("title");
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [hasSave, setHasSave] = useState(false);
  const [hasManual, setHasManual] = useState(false);
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [volume, setVolume] = useState(0.72);
  const [savedFlash, setSavedFlash] = useState(false);
  const [musicPosition, setMusicPosition] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const [activeTrack, setActiveTrack] = useState<TrackId | null>(null);
  const [musicFocus, setMusicFocus] = useState<MusicFocusState | null>(null);
  const [pendingTrackTransition, setPendingTrackTransition] = useState<PendingTrackTransition | null>(null);
  const [sceneFade, setSceneFade] = useState(false);

  useEffect(() => {
    audioRef.current = new AudioManager();
    const existing = loadSave();
    setHasSave(Boolean(existing));
    setHasManual(hasManualSave());
    const rawVolume = window.localStorage.getItem("sea-of-information:volume");
    const parsed = rawVolume ? Number(rawVolume) : 0.72;
    if (Number.isFinite(parsed)) {
      setVolume(parsed);
      audioRef.current.setVolume(parsed);
    }
    return () => audioRef.current?.destroy();
  }, []);

  const scene = scenes[state.sceneId];
  const currentDialogueLine = dialogue?.lines[lineIndex];
  const listeningCharacterSrc = getReiCharacterForArt(scene.art);
  const seaMemoryCount = SEA_MEMORY_IDS.reduce(
    (count, id) => count + (state.flags[seenFlag("sea-awakening", id)] ? 1 : 0),
    0
  );

  useEffect(() => {
    if (screen !== "game") return;
    const id = window.setInterval(() => {
      const position = audioRef.current?.getPosition() ?? 0;
      const track = audioRef.current?.getCurrentTrack() ?? null;
      setMusicPosition(position);
      setMusicDuration(audioRef.current?.getDuration() ?? 0);
      setActiveTrack(track);

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

  const setPersistentFlag = useCallback((flag: string, value = true) => {
    setState(prev => {
      if (Boolean(prev.flags[flag]) === value) return prev;
      const next = {
        ...prev,
        flags: { ...prev.flags, [flag]: value },
        updatedAt: new Date().toISOString()
      };
      pendingPersistRef.current = true;
      return next;
    });
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

  const executeAction = useCallback((action?: HotspotAction) => {
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
        const next = {
          ...prev,
          flags: { ...prev.flags, [action.flag]: true },
          updatedAt: new Date().toISOString()
        };
        pendingPersistRef.current = true;
        return next;
      });
      return goToScene(action.to);
    }
    setState(prev => {
      const next = {
        ...prev,
        flags: { ...prev.flags, [action.flag]: true },
        updatedAt: new Date().toISOString()
      };
      pendingPersistRef.current = true;
      return next;
    });
    setDialogue(dialogues[action.dialogueId]);
    setLineIndex(0);
  }, [goToScene]);

  const runAction = useCallback((action?: HotspotAction) => {
    if (!action) return;
    if (action.type === "advance" || action.type === "setFlagAndAdvance") {
      const target = scenes[action.to];
      if (scene.track && target.track && target.track !== scene.track) {
        setPendingTrackTransition({
          action,
          current: scene.track,
          next: target.track
        });
        return;
      }
    }
    executeAction(action);
  }, [executeAction, scene.track]);

  useEffect(() => {
    if (!scene.track || activeTrack !== scene.track) return;
    const newlyHeard = (scene.hotspots ?? []).filter(hotspot => {
      const gateTime = requiredTrackTime(scene.id, hotspot.id, hotspot.requiresTrackTime);
      if (typeof gateTime !== "number" || musicPosition < gateTime) return false;
      return !state.flags[listenedFlag(scene.id, hotspot.id)];
    });
    if (newlyHeard.length === 0) return;

    setState(prev => {
      const nextFlags = { ...prev.flags };
      let changed = false;
      newlyHeard.forEach(hotspot => {
        const key = listenedFlag(scene.id, hotspot.id);
        if (!nextFlags[key]) {
          nextFlags[key] = true;
          changed = true;
        }
      });
      if (!changed) return prev;
      pendingPersistRef.current = true;
      return { ...prev, flags: nextFlags, updatedAt: new Date().toISOString() };
    });
  }, [activeTrack, musicPosition, scene.id, scene.hotspots, scene.track, state.flags]);

  useEffect(() => {
    if (!musicFocus || musicFocus.phase !== "listening" || musicPosition < musicFocus.until) return;
    setPersistentFlag(musicFocus.checkpointKey);
    setMusicFocus(current => current ? { ...current, phase: "ready", canSkip: true } : current);
  }, [musicFocus, musicPosition, setPersistentFlag]);

  useEffect(() => {
    if (!musicFocus || musicFocus.phase !== "ready") return;
    const action = musicFocus.action;
    const id = window.setTimeout(() => {
      setMusicFocus(null);
      runAction(action);
    }, 850);
    return () => window.clearTimeout(id);
  }, [musicFocus, runAction]);

  const skipListening = useCallback(() => {
    if (!musicFocus || !musicFocus.canSkip) return;
    audioRef.current?.seek(musicFocus.until);
    setMusicPosition(musicFocus.until);
    setPersistentFlag(musicFocus.checkpointKey);
    setMusicFocus(current => current ? { ...current, phase: "ready" } : current);
  }, [musicFocus, setPersistentFlag]);

  const confirmTrackTransition = useCallback(async () => {
    if (!pendingTrackTransition) return;
    const action = pendingTrackTransition.action;
    setPendingTrackTransition(null);
    setSceneFade(true);
    await audioRef.current?.fadeOut(650);
    fadeInNextTrackRef.current = true;
    executeAction(action);
    window.setTimeout(() => setSceneFade(false), 1050);
  }, [pendingTrackTransition, executeAction]);

  const openDialogue = useCallback((id: string) => {
    setDialogue(dialogues[id]);
    setLineIndex(0);
  }, []);

  useEffect(() => {
    if (screen !== "game") return;
    let cancelled = false;
    const startTrack = async () => {
      if (!scene.track) return;
      const fadeInMs = fadeInNextTrackRef.current ? 750 : 0;
      fadeInNextTrackRef.current = false;
      await audioRef.current?.play(scene.track, Boolean(scene.trackRestart), fadeInMs);
      if (cancelled) return;
      setActiveTrack(scene.track);
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
      if ((event.key === "Enter" || event.key === " ") && dialogue && !musicFocus && !pendingTrackTransition) {
        event.preventDefault();
        advanceDialogue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, dialogue, musicFocus, pendingTrackTransition, advanceDialogue]);

  const restoreState = useCallback((existing: GameState, manual = false) => {
    const resumeScene = scenes[existing.sceneId];
    let stored = 0;
    if (resumeScene.track) {
      if (manual) {
        const manualTrack = window.localStorage.getItem(MANUAL_MUSIC_TRACK_KEY);
        const raw = Number(window.localStorage.getItem(MANUAL_MUSIC_POSITION_KEY) ?? "0");
        if (manualTrack === resumeScene.track && Number.isFinite(raw)) stored = raw;
      } else {
        const raw = Number(window.localStorage.getItem(musicPositionKey(resumeScene.track)) ?? "0");
        if (Number.isFinite(raw)) stored = raw;
      }
    }
    restoreMusicPositionRef.current = stored > 0 ? stored : null;
    if (stored > 0 && audioRef.current?.getCurrentTrack() === resumeScene.track) {
      audioRef.current?.seek(stored);
      setMusicPosition(stored);
      restoreMusicPositionRef.current = null;
    }
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
    setPendingTrackTransition(null);
    setState(existing);
    setScreen("game");
  }, []);

  const startNewGame = () => {
    audioRef.current?.resume();
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
    setPendingTrackTransition(null);
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
    restoreState(existing, false);
  };

  const saveManual = () => {
    saveManualGame(state);
    const track = scene.track;
    if (track) {
      window.localStorage.setItem(MANUAL_MUSIC_TRACK_KEY, track);
      window.localStorage.setItem(MANUAL_MUSIC_POSITION_KEY, String(audioRef.current?.getPosition() ?? musicPosition));
    }
    setHasManual(true);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 900);
  };

  const loadManual = () => {
    const existing = loadManualSave();
    if (!existing) return;
    setSettingsOpen(false);
    restoreState(existing, true);
  };

  const requestDebugScene = (next: SceneId) => {
    const target = scenes[next];
    setSettingsOpen(false);
    if (scene.track && target.track && target.track !== scene.track) {
      setPendingTrackTransition({
        action: { type: "advance", to: next },
        current: scene.track,
        next: target.track
      });
      return;
    }
    goToScene(next);
  };

  const debugNextScene = () => {
    const index = SCENE_IDS.indexOf(state.sceneId);
    const next = SCENE_IDS.slice(index + 1).find(id => id !== "title");
    if (!next) return;
    setSettingsOpen(false);
    setPendingTrackTransition(null);
    goToScene(next);
  };

  const debugNextTrack = () => {
    const index = SCENE_IDS.indexOf(state.sceneId);
    const next = SCENE_IDS.slice(index + 1).find(id => {
      const track = scenes[id].track;
      return track && track !== scene.track;
    });
    if (!next) return;
    requestDebugScene(next);
  };

  const debugPlayTrack = async (track: TrackId) => {
    const targetSceneId = DEBUG_TRACK_SCENE[track];
    const target = scenes[targetSceneId];
    if (!target) return;

    setSettingsOpen(false);
    setDialogue(null);
    setLineIndex(0);
    setMusicFocus(null);
    setPendingTrackTransition(null);
    restoreMusicPositionRef.current = null;
    window.localStorage.setItem(musicPositionKey(track), "0");

    setState(prev => {
      const nextFlags = { ...prev.flags };
      target.onEnterFlags?.forEach(flag => { nextFlags[flag] = true; });
      const nextMusic = prev.unlockedMusic.includes(track) ? prev.unlockedMusic : [...prev.unlockedMusic, track];
      pendingPersistRef.current = true;
      return {
        ...prev,
        sceneId: targetSceneId,
        flags: nextFlags,
        unlockedMusic: nextMusic,
        updatedAt: new Date().toISOString()
      };
    });

    await audioRef.current?.play(track, true);
    setActiveTrack(track);
    setMusicPosition(0);
    setMusicDuration(audioRef.current?.getDuration() || TRACK_META[track].duration);
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

  const storyMusicPosition = activeTrack === scene.track || activeTrack === null ? musicPosition : 0;
  const playerAdvance = useMemo(() => visibleHotspots.find(hotspot => {
    if (hotspot.action.type !== "advance" && hotspot.action.type !== "setFlagAndAdvance") return false;
    const gateTime = requiredTrackTime(scene.id, hotspot.id, hotspot.requiresTrackTime);
    if (typeof gateTime !== "number") return false;
    return Boolean(state.flags[listenedFlag(scene.id, hotspot.id)]) || (activeTrack === scene.track && musicPosition >= gateTime);
  }), [activeTrack, musicPosition, scene.id, scene.track, state.flags, visibleHotspots]);

  if (screen === "title") return <main className="titleScreen" onPointerDown={() => audioRef.current?.resume()}>
    <div className="titleOcean" aria-hidden="true"><img src="/art/production/characters/rei/rei-neutral.png" alt="" onError={hideBrokenArt} /><div className="titleHorizon" /><div className="dataRain" /></div>
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

  const displayTrack = activeTrack ?? scene.track;

  return <main className={`gameScreen art-${scene.art}${sceneFade ? " scene-fading" : ""}`} onPointerDown={() => audioRef.current?.resume()}>
    <SceneVisual artKey={scene.art} speaker={currentDialogueLine?.speaker} /><div className="cinemaGrain" aria-hidden="true" />
    <div className="sceneFadeOverlay" aria-hidden="true" />
    {scene.title && <div className="chapterCard" key={scene.id}><span>{scene.subtitle}</span><h2>{scene.title}</h2></div>}
    {scene.id === "sea-awakening" && <section className="prologueObjective"><small>OBJECTIVE</small><strong>3つの記憶断片を復元する</strong><div className="objectiveProgress">{SEA_MEMORY_IDS.map(id => <i key={id} className={state.flags[seenFlag("sea-awakening", id)] ? "done" : ""} />)}</div><p>{seaMemoryCount}/3 復元済み{seaMemoryCount === 3 ? " — 新しい信号を検出" : ""}</p></section>}
    {displayTrack && <NowPlaying
      track={displayTrack}
      position={musicPosition}
      duration={musicDuration || TRACK_META[displayTrack].duration}
      nextLabel={playerAdvance && !dialogue && !musicFocus && !pendingTrackTransition ? playerAdvance.label : undefined}
      onAdvance={playerAdvance && !dialogue && !musicFocus && !pendingTrackTransition ? () => runAction(playerAdvance.action) : undefined}
    />}
    <button className="menuButton" onClick={() => setSettingsOpen(true)}>MENU</button>

    {!musicFocus && !pendingTrackTransition && visibleHotspots.map(h => {
      const gateTime = requiredTrackTime(scene.id, h.id, h.requiresTrackTime);
      const checkpointKey = listenedFlag(scene.id, h.id);
      const heard = typeof gateTime === "number" && Boolean(state.flags[checkpointKey]);
      const locked = typeof gateTime === "number" && !heard && storyMusicPosition < gateTime;
      const label = locked ? (h.lockedLabel ?? "音に耳を澄ます") : h.label;
      const inspected = Boolean(state.flags[seenFlag(scene.id, h.id)]);
      return <button key={h.id} className={`hotspot${locked ? " hotspot-locked" : ""}${inspected ? " hotspot-complete" : ""}`} style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.width}%`, height: `${h.height}%` }} onClick={() => {
        setPersistentFlag(seenFlag(scene.id, h.id));
        if (locked && typeof gateTime === "number") {
          return setMusicFocus({
            until: gateTime,
            label,
            action: h.action,
            phase: "listening",
            checkpointKey,
            canSkip: Boolean(state.flags[checkpointKey])
          });
        }
        runAction(h.action);
      }}><span>{inspected && scene.id === "sea-awakening" ? `✓ ${label}` : label}</span></button>;
    })}

    {scene.id === "vertical-slice-end" && <section className="sliceEnd"><p>VERTICAL SLICE 0.8</p><h2>99.7%は、同じという意味だろうか。</h2><p>CHAPTER 2 — Gadget Area / BIT INTRODUCTION</p><div><button onClick={() => setScreen("title")}>TITLE</button><button onClick={() => { deleteSave(); setHasSave(false); setHasManual(false); startNewGame(); }}>RESTART</button></div></section>}
    {dialogue && !musicFocus && !pendingTrackTransition && <DialogueBox dialogue={dialogue} lineIndex={lineIndex} onAdvance={advanceDialogue} />}
    {musicFocus && scene.track && <ListeningStage
      track={scene.track}
      title={TRACK_META[scene.track].title}
      position={musicPosition}
      duration={musicDuration || TRACK_META[scene.track].duration}
      unlockAt={musicFocus.until}
      phase={musicFocus.phase}
      canSkip={musicFocus.canSkip}
      onSkip={skipListening}
      characterSrc={listeningCharacterSrc}
    />}
    {pendingTrackTransition && <TrackTransition
      current={pendingTrackTransition.current}
      next={pendingTrackTransition.next}
      onCancel={() => setPendingTrackTransition(null)}
      onConfirm={() => { void confirmTrackTransition(); }}
    />}
    {savedFlash && <div className="savedFlash">SAVED</div>}
    {settingsOpen && <Settings
      volume={volume}
      onVolume={changeVolume}
      onClose={() => setSettingsOpen(false)}
      onTitle={() => {
        audioRef.current?.pause();
        setSettingsOpen(false);
        setDialogue(null);
        setLineIndex(0);
        setMusicFocus(null);
        setPendingTrackTransition(null);
        setScreen("title");
      }}
      onSave={saveManual}
      onLoad={loadManual}
      canLoad={hasManual}
      onDebugNextScene={debugNextScene}
      onDebugNextTrack={debugNextTrack}
      onDebugPlayTrack={debugPlayTrack}
    />}
  </main>;
}

function NowPlaying({
  track,
  position,
  duration,
  nextLabel,
  onAdvance
}: {
  track: keyof typeof TRACK_META;
  position: number;
  duration: number;
  nextLabel?: string;
  onAdvance?: () => void;
}) {
  const meta = TRACK_META[track];
  const progress = Math.min(100, Math.max(0, (position / duration) * 100));
  const fmt = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return <div className="nowPlaying">
    <div className="nowPlayingTitle"><span>♪</span><strong>{meta.title}</strong><small>{fmt(position)} / {fmt(duration)}</small></div>
    <div className="nowPlayingBar"><i style={{ width: `${progress}%` }} /></div>
    {onAdvance && <button className="nowPlayingNext" type="button" onClick={onAdvance}><small>NEXT</small><span>{nextLabel ?? "次へ進む"}</span></button>}
  </div>;
}

function DialogueBox({ dialogue, lineIndex, onAdvance }: { dialogue: Dialogue; lineIndex: number; onAdvance: () => void }) {
  const line = dialogue.lines[lineIndex];
  return <button className="dialogueBox" onClick={onAdvance} aria-label="次のメッセージへ">
    {line.speaker && <span className={`speaker speaker-${line.speaker.toLowerCase()}`}>{line.speaker}</span>}
    <span className="dialogueText">{line.text}</span>
    <span className="dialogueHint">クリック / Enter</span>
    <span className="dialogueNext" aria-hidden="true">▼</span>
  </button>;
}

function Settings({
  volume,
  onVolume,
  onClose,
  onTitle,
  onSave,
  onLoad,
  canLoad,
  onDebugNextScene,
  onDebugNextTrack,
  onDebugPlayTrack
}: {
  volume: number;
  onVolume: (n: number) => void;
  onClose: () => void;
  onTitle?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  canLoad?: boolean;
  onDebugNextScene?: () => void;
  onDebugNextTrack?: () => void;
  onDebugPlayTrack?: (track: TrackId) => void;
}) {
  const [debugTrack, setDebugTrack] = useState<TrackId>("sea-of-information");
  const fullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen().catch(() => undefined);
    else await document.exitFullscreen().catch(() => undefined);
  };

  return <div className="modalBackdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="settingsPanel">
      <div className="settingsTitle"><span>SETTINGS</span><button onClick={onClose}>×</button></div>
      <label>BGM VOLUME <strong>{Math.round(volume * 100)}</strong><input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => onVolume(Number(e.target.value))} /></label>
      <button className="settingsAction" onClick={fullscreen}>FULLSCREEN</button>
      {onSave && <div className="settingsGroup"><small>SAVE / LOAD</small><div className="settingsRow"><button className="settingsAction" onClick={onSave}>SAVE NOW</button><button className="settingsAction" onClick={onLoad} disabled={!canLoad}>LOAD MANUAL SAVE</button></div></div>}
      {onDebugNextScene && <div className="settingsGroup debugGroup"><small>DEBUG</small><div className="settingsRow"><button className="settingsAction" onClick={onDebugNextScene}>SKIP NEXT SCENE</button><button className="settingsAction" onClick={onDebugNextTrack}>SKIP NEXT TRACK (CONFIRM)</button></div>
        {onDebugPlayTrack && <div className="debugTrackPicker"><select value={debugTrack} onChange={event => setDebugTrack(event.target.value as TrackId)}>{(Object.keys(TRACK_META) as TrackId[]).map(track => <option key={track} value={track}>{TRACK_META[track].title}</option>)}</select><button className="settingsAction" onClick={() => onDebugPlayTrack(debugTrack)}>GO TO TRACK</button></div>}
      </div>}
      {onTitle && <button className="settingsAction" onClick={onTitle}>RETURN TO TITLE</button>}
      <p>会話送り: クリック / Enter / Space　設定: Esc</p>
    </section>
  </div>;
}