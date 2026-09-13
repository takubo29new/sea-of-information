"use client";

import type { TrackId } from "./model";

export const TRACK_META: Record<TrackId, { src: string; title: string; duration: number }> = {
  "sea-of-information": { src: "/audio/sea-of-information.m4a", title: "Sea of information", duration: 323.8 },
  "city-of-dawn": { src: "/audio/city-of-dawn.m4a", title: "City of dawn", duration: 343.0 },
  "load-road": { src: "/audio/load-road.mp3", title: "Load road", duration: 323.79 },
  "gadget-area": { src: "/audio/gadget-area.mp3", title: "Gadget area", duration: 211.30 }
};

export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: TrackId | null = null;
  private volume = 0.72;
  private fadeToken = 0;

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audio) this.audio.volume = this.volume;
  }

  getVolume() {
    return this.volume;
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
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = "";
    this.audio = null;
    this.currentTrack = null;
  }
}
