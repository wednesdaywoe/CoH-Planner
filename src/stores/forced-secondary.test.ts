// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { useBuildStore, forcedSecondaryName } from '@/stores/buildStore';
import type { SelectedPower } from '@/types/power';

/**
 * The pick character creation makes for the player: the game buys the secondary
 * set's first power itself — "no choice, buy first power" (Hybrid/uiPower.c) —
 * and a respec re-buys it the same way (uiReSpec.c). Availability data cannot
 * express the rule (Ice Bolt and Ice Blast both read `available 0`), which is
 * how a Defender build shipped Ice Blast on the level-1 pick with no Ice Bolt.
 * Ice Bolt is pinned here as the game's own first Ice Blast power, written down
 * independently so the tests cannot collapse into comparing the store with the
 * dataset order it reads.
 */

beforeAll(async () => {
  await loadDataset('homecoming');
}, 60_000);

afterEach(() => {
  localStorage.clear();
  useBuildStore.getState().resetBuild();
});

function chooseIceDefender(): void {
  const store = useBuildStore.getState();
  store.setArchetype('defender');
  store.setPrimary('defender/time-manipulation');
  store.setSecondary('defender/ice-blast');
}

const secondaryLevels = (): Map<string, number> =>
  new Map(useBuildStore.getState().build.secondary.powers.map((p) => [p.internalName, p.level]));

describe('the creation-forced secondary pick', () => {
  it('choosing a secondary set brings its first power at level 1', () => {
    chooseIceDefender();
    expect(secondaryLevels().get('Ice_Bolt')).toBe(1);
  });

  it('no other secondary power can land on the level-1 pick', () => {
    chooseIceDefender();
    const powerset = useBuildStore.getState().build.secondary;
    expect(powerset.powers).toHaveLength(1);
    // Pick the SECOND power straight away — before any primary occupies level 1.
    const def = { internalName: 'Ice_Blast', name: 'Ice Blast', powerSet: 'defender/ice-blast', available: 0, level: 1, slots: [null] } as unknown as SelectedPower;
    useBuildStore.getState().addPower('secondary', def);
    expect(secondaryLevels().get('Ice_Blast')).toBe(2);
  });

  it('the forced power refuses removal and level moves, like the game', () => {
    chooseIceDefender();
    const store = useBuildStore.getState();
    store.removePower('secondary', 'Ice_Bolt');
    expect(secondaryLevels().get('Ice_Bolt')).toBe(1);
    store.movePowerLevel('secondary', 'Ice_Bolt', 8);
    expect(secondaryLevels().get('Ice_Bolt')).toBe(1);
  });

  it('binds for a plain archetype and not for a branch-carrying one', () => {
    chooseIceDefender();
    expect(forcedSecondaryName(useBuildStore.getState().build)).toBe('Ice_Bolt');
    // The respec exemption: a VEAT respecs entirely out of its base secondary,
    // so nothing is forced (uiReSpec.c skips the auto-buy for them).
    const store = useBuildStore.getState();
    store.setArchetype('arachnos-soldier');
    store.setSecondary('arachnos-soldier/training-and-gadgets');
    expect(forcedSecondaryName(useBuildStore.getState().build)).toBeNull();
    expect(useBuildStore.getState().build.secondary.powers).toHaveLength(0);
  });
});
