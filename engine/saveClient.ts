"use client";

import { GameState } from "./model";
import { SAVE_KEY, sanitizeGameState } from "./saveCore";

const MANUAL_SAVE_KEY = "sea-of-information:manual:v1";

function readSave(key: string): GameState | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return sanitizeGameState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeSave(key: string, state: GameState): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  } catch {
    // The game must remain playable even when storage is unavailable.
  }
}

export function loadSave(): GameState | null {
  return readSave(SAVE_KEY);
}

export function saveGame(state: GameState): void {
  writeSave(SAVE_KEY, state);
}

export function loadManualSave(): GameState | null {
  return readSave(MANUAL_SAVE_KEY);
}

export function saveManualGame(state: GameState): void {
  writeSave(MANUAL_SAVE_KEY, state);
}

export function hasManualSave(): boolean {
  try {
    return Boolean(window.localStorage.getItem(MANUAL_SAVE_KEY));
  } catch {
    return false;
  }
}

export function deleteSave(): void {
  try {
    window.localStorage.removeItem(SAVE_KEY);
    window.localStorage.removeItem(MANUAL_SAVE_KEY);
  } catch {
    // Ignore storage errors.
  }
}
