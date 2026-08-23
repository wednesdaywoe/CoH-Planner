/**
 * The incarnate level-shift ceiling reaches the engine and moves the number.
 *
 * The regression this locks is not a wrong number — it is a DEAD CONTROL. The beta shipped
 * `incarnateLevelShiftActive` with a store slot, a persisted key, a setter and no caller, and
 * once the engine landed the adapter stopped forwarding it entirely: a `false` logged a
 * console warning and the totals kept every shift. Two independent ways for the flag to reach
 * nothing, and no test held either, because every gate here passes its own CharacterState
 * straight to the engine and so cannot see that the input has no writer.
 *
 * So these assert the property a parity gate structurally cannot: that a value set on the UI
 * SIDE changes what the engine computes. They drive `toCharacterState` (not a hand-built
 * state) for exactly that reason — a hand-built state would prove the engine reads a field
 * while the adapter quietly drops it, which is the failure that already happened once.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { engineArtifactsPresent, recalcJson, isDatasetLoaded } from './engine.node';
import { toCharacterStateJson, type AdapterCalcContext } from './characterStateAdapter';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild, type Build } from '@/types';

const suite = engineArtifactsPresent('homecoming') ? describe : describe.skip;
if (!engineArtifactsPresent('homecoming')) {
  console.warn('[incarnateLevelShiftCeiling] engine artifacts missing — run `npm run build:engine`; suite skipped.');
}

/** Alpha, Destiny and Lore picks that each grant +1 in the Homecoming tables — the +3 loadout
 *  the user report was about. Named here rather than derived so the fixture states the shift
 *  it expects; `getLevelShiftGrants` is the thing under test on the UI side, not an input. */
const SHIFTING = {
  alpha: 'agility_core_paragon',
  destiny: 'ageless_core_epiphany',
  lore: 'arachnos_core_superior_ally',
};

function pick(slotId: string, powerId: string) {
  return { slotId, powerId, powerName: powerId, displayName: powerId, icon: '', tier: 'T4', treeId: '', treeName: '' };
}

const ctx = (incarnateLevelShift: number | null): AdapterCalcContext => ({
  exemplarMode: false,
  exemplarLevel: 50,
  incarnateActive: { alpha: true, destiny: true, hybrid: true, interface: true, judgement: true, lore: true, genesis: true },
  incarnateLevelShift,
  targetsHitValues: {},
  targetLevelOffset: 0,
  vigilanceTeamSize: 0,
  furyLevel: 0,
  combatMode: false,
  destinyTime: null,
  hybridTargetsHit: null,
  globalAdjusters: {},
  mechanicAdjusters: {},
  dominationActive: false,
  stalkerHidden: false,
  whatIfBuffs: {},
});

/** The engine's `levelShift` for a full +3 loadout read at the given ceiling. */
function levelShiftAt(build: Build, ceiling: number | null): number {
  const json = recalcJson('homecoming', toCharacterStateJson(build, ctx(ceiling)));
  expect(json, 'engine returned no totals').not.toBeNull();
  return JSON.parse(json!).bonuses.level_shift;
}

suite('the incarnate level-shift ceiling', () => {
  let build: Build;

  beforeAll(async () => {
    if (!isDatasetLoaded('homecoming')) await loadDataset('homecoming');
    build = createEmptyBuild('homecoming');
    build.level = 50;
    build.archetype = { ...build.archetype, id: 'scrapper', name: 'Scrapper' };
    build.incarnates.alpha = pick('alpha', SHIFTING.alpha) as never;
    build.incarnates.destiny = pick('destiny', SHIFTING.destiny) as never;
    build.incarnates.lore = pick('lore', SHIFTING.lore) as never;
  }, 120_000);

  it('unset spends every shift the loadout earned', () => {
    expect(levelShiftAt(build, null)).toBe(3);
  });

  it('a partial ceiling is honored — the case the report was about', () => {
    // +1 is what standard content grants a loadout that has earned +3. Before LSHIFT-1 this
    // read 3 whatever the UI said, so this assertion is the whole point of the port.
    expect(levelShiftAt(build, 1)).toBe(1);
    expect(levelShiftAt(build, 2)).toBe(2);
  });

  it('a zero ceiling reads the build at no shift', () => {
    expect(levelShiftAt(build, 0)).toBe(0);
  });

  it('a ceiling above the earned grants cannot conjure a shift', () => {
    expect(levelShiftAt(build, 9)).toBe(3);
  });

  it('an empty loadout shifts by nothing at any ceiling', () => {
    const bare = createEmptyBuild('homecoming');
    bare.level = 50;
    bare.archetype = { ...bare.archetype, id: 'scrapper', name: 'Scrapper' };
    expect(levelShiftAt(bare, null)).toBe(0);
    expect(levelShiftAt(bare, 3)).toBe(0);
  });
});
