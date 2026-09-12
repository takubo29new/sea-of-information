"use client";

import { GameState } from "./model";
import { SAVE_KEY, sanitizeGameState } from "./saveCore";

export function loadSave(): GameState | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return sanitizeGameState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  } catch {
    // The game must remain playable even when storage is unavailable.
  }
}

export function deleteSave(): void {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
