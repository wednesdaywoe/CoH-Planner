/**
 * In-memory localStorage polyfill for node-environment vitest runs.
 *
 * The build/UI stores persist via `createJSONStorage(() => localStorage)`,
 * which resolves and CACHES the storage object the moment the store module is
 * evaluated. Node 22+ exposes an experimental global `localStorage` whose
 * `setItem` throws without a backing file, so any store write blows up with
 * "storage.setItem is not a function".
 *
 * Import this module BEFORE any store import so the shim is in place when the
 * store caches its storage:
 *
 *   import '@/test/localstorage-polyfill';
 *   import { useBuildStore } from '@/stores/buildStore';
 */
const memStore = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  writable: true,
  value: {
    getItem: (k: string) => memStore.get(k) ?? null,
    setItem: (k: string, v: string) => void memStore.set(k, v),
    removeItem: (k: string) => void memStore.delete(k),
    clear: () => memStore.clear(),
    key: (i: number) => Array.from(memStore.keys())[i] ?? null,
    get length() {
      return memStore.size;
    },
  } as Storage,
});

export {};
