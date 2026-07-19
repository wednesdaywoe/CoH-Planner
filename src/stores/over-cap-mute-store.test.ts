// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyBuild } from '@/types/build';
import { toCanonicalStatKey, isOverCapMuted } from '@/data/set-bonus-groups';
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

// End-to-end write→read invariant: muting a stat from a Set Bonus Totals popup row
// (row.stat = a tracking key) must make the ring/banner surfaces — which read the raw
// breakdown key via isOverCapMuted — treat that stat as muted. Regression guard for the
// double-canonicalization bug (popup pre-canonicalized AND the store re-canonicalized,
// storing a "misc|<mash>" that never matched, so NO warning was suppressed).
describe('popup → store → read round-trip', () => {
  it('muting a popup row suppresses the matching breakdown-key warning', () => {
    const { toggleOverCapMute } = useBuildStore.getState();
    toggleOverCapMute('mezresist'); // what the popup passes: the row's tracking key (RAW)
    const muted = useBuildStore.getState().build.mutedOverCapStats;
    expect(isOverCapMuted('mezResist', muted)).toBe(true); // breakdown key the ring/banner read
  });

  it('still works if a caller accidentally pre-canonicalizes (idempotency defense)', () => {
    const { toggleOverCapMute } = useBuildStore.getState();
    toggleOverCapMute(toCanonicalStatKey('mezresist')); // the OLD buggy popup call
    const muted = useBuildStore.getState().build.mutedOverCapStats;
    expect(muted).toEqual([toCanonicalStatKey('mezresist')]); // stored once-canonical, not misc|mash
    expect(isOverCapMuted('mezResist', muted)).toBe(true);
  });

  it('round-trips a divergent-global stat (Max Endurance) too', () => {
    useBuildStore.getState().toggleOverCapMute('maxend'); // popup row.stat
    const muted = useBuildStore.getState().build.mutedOverCapStats;
    expect(isOverCapMuted('maxEndurance', muted)).toBe(true); // breakdown global key
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
