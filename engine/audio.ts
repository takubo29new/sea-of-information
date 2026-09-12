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

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.audio) this.audio.volume = this.volume;
  }

  getVolume() {
    return this.volume;
  }

  async play(track: TrackId, restart = false) {
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
    next.volume = this.volume;
    this.audio = next;
    this.currentTrack = track;

    if (previous) {
      previous.pause();
      previous.src = "";
    }

    try { await next.play(); } catch { /* first user gesture will resume */ }
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
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = "";
    this.audio = null;
    this.currentTrack = null;
  }
}
