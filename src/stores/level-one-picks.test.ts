// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { useBuildStore } from '@/stores/buildStore';
import type { SelectedPower } from '@/types/power';

/**
 * Level 1 is character creation: exactly one primary pick and one secondary
 * pick. WHICH power fills each is the player's choice among the set's level-1
 * options — Homecoming opened the secondary's tier-2 power at creation in
 * Issue 27 Page 5, retiring the "no choice, buy first power" rule the leaked
 * source still carries — so Ice Bolt and Ice Blast are BOTH legal level-1
 * picks, but a category never holds two level-1 powers.
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

const stub = (internalName: string, powerSet: string): SelectedPower =>
  ({ internalName, name: internalName, powerSet, available: 0, level: 1, slots: [null] } as unknown as SelectedPower);

const levelsOf = (category: 'primary' | 'secondary'): Map<string, number> =>
  new Map(useBuildStore.getState().build[category].powers.map((p) => [p.internalName, p.level]));

describe('the two level-1 picks', () => {
  it('choosing a secondary set adds no power by itself — the pick is the player\'s', () => {
    chooseIceDefender();
    expect(useBuildStore.getState().build.secondary.powers).toHaveLength(0);
  });

  it('either of the set\'s level-1 powers can take the level-1 pick', () => {
    chooseIceDefender();
    // The tier-2 power straight away — the choice i27p5 opened.
    useBuildStore.getState().addPower('secondary', stub('Ice_Blast', 'defender/ice-blast'));
    expect(levelsOf('secondary').get('Ice_Blast')).toBe(1);
  });

  it('a category that owns level 1 floors its next pick at 2', () => {
    chooseIceDefender();
    const store = useBuildStore.getState();
    // Second PRIMARY while the secondary is still empty: without the cap the
    // sequential assigner hands out level 1 again (level 1 is not "full" until
    // both categories own a pick), which is the discriminating case.
    store.addPower('primary', stub('Time_Crawl', 'defender/time-manipulation'));
    store.addPower('primary', stub('Temporal_Mending', 'defender/time-manipulation'));
    expect(levelsOf('primary').get('Time_Crawl')).toBe(1);
    expect(levelsOf('primary').get('Temporal_Mending')).toBe(2);

    store.addPower('secondary', stub('Ice_Blast', 'defender/ice-blast'));
    store.addPower('secondary', stub('Ice_Bolt', 'defender/ice-blast'));
    expect(levelsOf('secondary').get('Ice_Blast')).toBe(1);
    expect(levelsOf('secondary').get('Ice_Bolt')).toBe(4);
  });

  it('the level-1 pick can be dropped and rechosen', () => {
    chooseIceDefender();
    const store = useBuildStore.getState();
    store.addPower('secondary', stub('Ice_Blast', 'defender/ice-blast'));
    store.removePower('secondary', 'Ice_Blast');
    expect(levelsOf('secondary').size).toBe(0);
    store.addPower('secondary', stub('Ice_Bolt', 'defender/ice-blast'));
    expect(levelsOf('secondary').get('Ice_Bolt')).toBe(1);
  });

  it('a cross-category swap cannot hand a category a second level-1 pick', () => {
    chooseIceDefender();
    const store = useBuildStore.getState();
    store.addPower('primary', stub('Time_Crawl', 'defender/time-manipulation'));
    store.addPower('secondary', stub('Ice_Blast', 'defender/ice-blast'));
    store.addPower('primary', stub('Temporal_Mending', 'defender/time-manipulation'));
    // Temporal Mending (primary, level 2) onto Ice Blast's level 1 would put a
    // second primary beside Time Crawl on level 1 — refused, nothing moves.
    useBuildStore.getState().swapPowerLevels('Temporal_Mending', 'primary', 'Ice_Blast', 'secondary');
    expect(levelsOf('primary').get('Temporal_Mending')).toBe(2);
    expect(levelsOf('secondary').get('Ice_Blast')).toBe(1);
  });
});
