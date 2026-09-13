"use client";

import type { TrackId } from "./model";

export const TRACK_META: Record<TrackId, { src: string; title: string; duration: number }> = {
  "sea-of-information": { src: "/audio/sea-of-information.m4a", title: "Sea of information", duration: 323.8 },
  "city-of-dawn": { src: "/audio/city-of-dawn.m4a", title: "City of dawn", duration: 343.0 },
  "load-road": { src: "/audio/load-road.mp3", title: "Load road", duration: 323.79 },
  "gadget-area": { src: "/audio/gadget-area.mp3", title: "Gadget area", duration: 211.30 },
  wish: { src: "/audio/wish.m4a", title: "wish", duration: 336.897 },
  fantasy: { src: "/audio/fantasy.m4a", title: "Fantasy", duration: 442.851 },
  beautiful: { src: "/audio/beautiful.mp3", title: "beautiful", duration: 304.327 },
  break: { src: "/audio/break.m4a", title: "Break", duration: 301.604 },
  blavery: { src: "/audio/blavery.mp3", title: "blavery", duration: 265.770 },
  naked: { src: "/audio/naked.mp3", title: "Naked", duration: 340.767 },
  signal: { src: "/audio/signal.mp3", title: "Signal", duration: 555.050 },
  spacecraft: { src: "/audio/spacecraft.m4a", title: "Spacecraft", duration: 179.444 },
  "new-create": { src: "/audio/new-create.mp3", title: "New create", duration: 333.035 },
  thundercloud: { src: "/audio/thundercloud.mp3", title: "Thundercloud", duration: 252.552 },
  "space-home": { src: "/audio/space-home.mp3", title: "Space Home", duration: 300.042 }
};

export type AudioReactiveLevels = {
  energy: number;
  bass: number;
  mid: number;
  treble: number;
};

const ZERO_LEVELS: AudioReactiveLevels = { energy: 0, bass: 0, mid: 0, treble: 0 };
let activeAudioManager: AudioManager | null = null;

export function getActiveAudioReactiveLevels(): AudioReactiveLevels {
  return activeAudioManager?.getReactiveLevels() ?? ZERO_LEVELS;
}

export function seekActiveAudio(position: number, track?: TrackId) {
  if (!activeAudioManager) return false;
  if (track && activeAudioManager.getCurrentTrack() !== track) return false;
  activeAudioManager.seek(position);
  return true;
}

export function playActiveAudio(track: TrackId, restart = true) {
  if (!activeAudioManager) return false;
  void activeAudioManager.play(track, restart);
  return true;
}

export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: TrackId | null = null;
  private volume = 0.72;
  private fadeToken = 0;
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private modalObserver: MutationObserver | null = null;
  private pausedForModal = false;

  constructor() {
    activeAudioManager = this;
    if (typeof document !== "undefined") {
      this.modalObserver = new MutationObserver(() => this.syncModalPause());
      this.modalObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  private isSettingsOpen() {
    return typeof document !== "undefined" && Boolean(document.querySelector(".modalBackdrop .settingsPanel"));
  }

  private syncModalPause() {
    const modalOpen = this.isSettingsOpen();
    if (modalOpen) {
      if (this.audio && !this.audio.paused) {
        this.pausedForModal = true;
        this.audio.pause();
      }
      return;
    }
    if (this.pausedForModal) {
      this.pausedForModal = false;
      void this.resume();
    }
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audio) this.audio.volume = this.volume;
  }

  getVolume() {
    return this.volume;
  }

  private ensureAudioGraph(audio: HTMLAudioElement) {
    if (typeof window === "undefined") return;
    const AudioContextCtor = window.AudioContext;
    if (!AudioContextCtor) return;

    if (!this.context) this.context = new AudioContextCtor();
    if (!this.analyser) {
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.connect(this.context.destination);
    }

    if (this.source) {
      try { this.source.disconnect(); } catch { /* already disconnected */ }
      this.source = null;
    }

    try {
      this.source = this.context.createMediaElementSource(audio);
      this.source.connect(this.analyser);
    } catch {
      this.source = null;
    }
  }

  private async resumeContext() {
    if (this.context?.state === "suspended") {
      try { await this.context.resume(); } catch { /* user gesture may be required */ }
    }
  }

  getReactiveLevels(): AudioReactiveLevels {
    if (!this.analyser || !this.frequencyData || !this.audio || this.audio.paused) return ZERO_LEVELS;
    this.analyser.getByteFrequencyData(this.frequencyData);

    const bins = this.frequencyData;
    const average = (start: number, end: number) => {
      const safeStart = Math.max(0, Math.min(bins.length - 1, start));
      const safeEnd = Math.max(safeStart + 1, Math.min(bins.length, end));
      let total = 0;
      for (let i = safeStart; i < safeEnd; i += 1) total += bins[i];
      return total / (safeEnd - safeStart) / 255;
    };

    const bass = average(1, 8);
    const mid = average(8, 28);
    const treble = average(28, Math.min(72, bins.length));
    return {
      bass,
      mid,
      treble,
      energy: Math.min(1, bass * 0.46 + mid * 0.36 + treble * 0.18)
    };
  }

  private fadeElement(audio: HTMLAudioElement, from: number, to: number, durationMs: number) {
    const token = ++this.fadeToken;
    const started = performance.now();
    return new Promise<void>(resolve => {
      const tick = (now: number) => {
        if (token !== this.fadeToken) return resolve();
        const ratio = durationMs <= 0 ? 1 : Math.min(1, (now - started) / durationMs);
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * ratio));
        if (ratio >= 1) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  async fadeOut(durationMs = 650) {
    if (!this.audio) return;
    const audio = this.audio;
    await this.fadeElement(audio, audio.volume, 0, durationMs);
  }

  async play(track: TrackId, restart = false, fadeInMs = 0) {
    if (this.currentTrack === track && this.audio && !restart) {
      await this.resumeContext();
      if (this.isSettingsOpen()) {
        this.pausedForModal = true;
        this.audio.pause();
        return;
      }
      if (this.audio.paused) {
        try { await this.audio.play(); } catch { /* user gesture may be required */ }
      }
      return;
    }

    const previous = this.audio;
    const next = new Audio(TRACK_META[track].src);
    next.loop = true;
    next.preload = "auto";
    next.volume = fadeInMs > 0 ? 0 : this.volume;
    this.audio = next;
    this.currentTrack = track;

    if (previous) {
      previous.pause();
      previous.src = "";
    }

    this.ensureAudioGraph(next);
    await this.resumeContext();

    if (this.isSettingsOpen()) {
      this.pausedForModal = true;
      return;
    }

    try {
      await next.play();
      if (fadeInMs > 0) await this.fadeElement(next, 0, this.volume, fadeInMs);
    } catch { /* first user gesture will resume */ }
  }

  seek(position: number) {
    if (!this.audio || !Number.isFinite(position) || position < 0) return;
    const target = Math.max(0, position);
    const apply = () => {
      if (!this.audio) return;
      const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : undefined;
      this.audio.currentTime = duration ? Math.min(target, Math.max(0, duration - 0.05)) : target;
    };
    if (this.audio.readyState >= 1) {
      try { apply(); } catch { /* metadata may still be unavailable */ }
      return;
    }
    this.audio.addEventListener("loadedmetadata", () => {
      try { apply(); } catch { /* no-op */ }
    }, { once: true });
  }

  async resume() {
    if (this.isSettingsOpen()) {
      this.pausedForModal = true;
      this.audio?.pause();
      return;
    }
    await this.resumeContext();
    if (!this.audio || !this.audio.paused) return;
    try { await this.audio.play(); } catch { /* no-op */ }
  }

  pause() {
    this.audio?.pause();
  }

  getPosition() {
    return this.audio?.currentTime ?? 0;
  }

  getDuration() {
    if (!this.currentTrack) return 0;
    const native = this.audio?.duration;
    return native && Number.isFinite(native) ? native : TRACK_META[this.currentTrack].duration;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  destroy() {
    this.fadeToken += 1;
    this.modalObserver?.disconnect();
    this.modalObserver = null;
    if (activeAudioManager === this) activeAudioManager = null;
    if (this.source) {
      try { this.source.disconnect(); } catch { /* no-op */ }
      this.source = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    if (this.context) {
      void this.context.close().catch(() => undefined);
      this.context = null;
    }
    this.analyser = null;
    this.frequencyData = null;
    this.currentTrack = null;
  }
}
