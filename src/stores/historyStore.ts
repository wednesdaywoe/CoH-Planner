/**
 * History Store - In-memory undo/redo for Build mutations
 *
 * Stores snapshots of the Build object before each mutation.
 * Not persisted to localStorage — history resets on page reload.
 */

import { create } from 'zustand';
import type { Build } from '@/types';

const HISTORY_LIMIT = 50;

interface HistoryStore {
  past: Build[];
  future: Build[];
  _isRestoring: boolean;

  /** Snapshot the current build before a mutation. Clears redo stack. */
  checkpoint: (build: Build) => void;
  /** Undo: pop past, push current to future, return the restored build (or null). */
  undo: (currentBuild: Build) => Build | null;
  /** Redo: pop future, push current to past, return the restored build (or null). */
  redo: (currentBuild: Build) => Build | null;
  /** Clear all history. */
  clear: () => void;
  /** Set the restoring flag (prevents re-entry during undo/redo). */
  setRestoring: (value: boolean) => void;
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  past: [],
  future: [],
  _isRestoring: false,

  checkpoint: (build) => {
    set((s) => ({
      past: [...s.past.slice(-(HISTORY_LIMIT - 1)), structuredClone(build)],
      future: [],
    }));
  },

  undo: (currentBuild) => {
    const { past } = get();
    if (past.length === 0) return null;

    const restored = past[past.length - 1];
    set((s) => ({
      past: s.past.slice(0, -1),
      future: [...s.future, structuredClone(currentBuild)],
    }));
    return restored;
  },

  redo: (currentBuild) => {
    const { future } = get();
    if (future.length === 0) return null;

    const restored = future[future.length - 1];
    set((s) => ({
      past: [...s.past, structuredClone(currentBuild)],
      future: s.future.slice(0, -1),
    }));
    return restored;
  },

  clear: () => set({ past: [], future: [] }),

  setRestoring: (value) => set({ _isRestoring: value }),
}));
