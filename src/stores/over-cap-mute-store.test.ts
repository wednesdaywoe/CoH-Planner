// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyBuild } from '@/types/build';
import { toCanonicalStatKey } from '@/data/set-bonus-groups';
import { useBuildStore } from '@/stores/buildStore';
import { useHistoryStore } from '@/stores/historyStore';

beforeEach(() => {
  useBuildStore.setState({ build: createEmptyBuild('homecoming') });
});

describe('toggleOverCapMute', () => {
  it('adds a canonicalized key when absent and removes it when present', () => {
    const { toggleOverCapMute } = useBuildStore.getState();
    const canonical = toCanonicalStatKey('mezResist');

    toggleOverCapMute('mezResist'); // pass a raw breakdown-style key
    expect(useBuildStore.getState().build.mutedOverCapStats).toEqual([canonical]);

    toggleOverCapMute('mezResist'); // toggle off
    expect(useBuildStore.getState().build.mutedOverCapStats).toEqual([]);
  });

  it('treats both halves of a pair as the same mute (idempotent add)', () => {
    const { toggleOverCapMute } = useBuildStore.getState();
    toggleOverCapMute('defEnergy');
    toggleOverCapMute('defNegative'); // same canonical key → removes it
    expect(useBuildStore.getState().build.mutedOverCapStats).toEqual([]);
  });

  it('creates an undo checkpoint', () => {
    const before = useHistoryStore.getState().past.length;
    useBuildStore.getState().toggleOverCapMute('mezResist');
    expect(useHistoryStore.getState().past.length).toBe(before + 1);
  });
});

describe('clearOverCapMutes', () => {
  it('empties the mute set', () => {
    useBuildStore.setState({
      build: { ...createEmptyBuild('homecoming'), mutedOverCapStats: ['Defense|Melee', 'General|Recharge'] },
    });
    useBuildStore.getState().clearOverCapMutes();
    expect(useBuildStore.getState().build.mutedOverCapStats).toEqual([]);
  });
});
