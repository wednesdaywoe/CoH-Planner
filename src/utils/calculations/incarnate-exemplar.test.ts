import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals, getAlphaEnhancementBonuses } from './character-totals';
import { getEffectiveLevel, areIncarnatesSuppressed, INCARNATE_MIN_LEVEL } from './effective-level';
import { getIncarnatePower, } from '@/data/incarnates';
import { createDefaultIncarnateActiveState } from '@/types/incarnate';
import type { IncarnateSlotId } from '@/types/incarnate';

/**
 * All incarnate abilities function only at effective level 45+. Below 45 (when
 * exemplared) they turn off entirely — except Genesis, which swaps to its
 * below-45 "exemplar power". Of the four Genesis trees, only Fate's exemplar
 * power is a self stat-buff (+Recharge), so it's the one that still moves the
 * dashboard below 45. These tests pin that boundary.
 */

describe('effective level + incarnate suppression helpers', () => {
  it('getEffectiveLevel respects exemplar mode', () => {
    expect(getEffectiveLevel(50, false, 30)).toBe(50); // not exemplared
    expect(getEffectiveLevel(50, true, 30)).toBe(30);
    expect(getEffectiveLevel(50, true, undefined)).toBe(50);
  });

  it('areIncarnatesSuppressed at the level-45 boundary', () => {
    expect(INCARNATE_MIN_LEVEL).toBe(45);
    expect(areIncarnatesSuppressed(44)).toBe(true);
    expect(areIncarnatesSuppressed(45)).toBe(false);
    expect(areIncarnatesSuppressed(50)).toBe(false);
  });

  it('getAlphaEnhancementBonuses returns nothing when suppressed', () => {
    expect(getAlphaEnhancementBonuses(undefined, undefined, true)).toEqual({});
  });
});

// `powerName` is the power's fullName — what the modal stores and the ONLY field the engine
// resolves an incarnate selection by. A blank one resolves to nothing, so it is looked up here
// rather than hand-written.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function selected(slotId: string, powerId: string, displayName: string, treeId = '', treeName = ''): any {
  const def = getIncarnatePower(slotId as IncarnateSlotId, powerId);
  if (!def) throw new Error(`fixture: no incarnate power ${slotId}/${powerId}`);
  return { slotId, powerId, powerName: def.fullName, displayName, icon: '', tier: 'veryrare', treeId, treeName };
}

describe('incarnate exemplar suppression — character totals (rebirth)', () => {
  beforeAll(async () => {
    await loadDataset('rebirth');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function controllerL50(): any {
    const b = createEmptyBuild();
    b.serverId = 'rebirth';
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'controller', name: 'Controller', stats: null, inherent: null } as any;
    return b;
  }

  it('Destiny recharge applies at 45+ but is suppressed below 45', () => {
    const b = controllerL50();
    // Ageless Core Epiphany grants +40% recharge.
    b.incarnates.destiny = selected('destiny', 'ageless_core_epiphany', 'Ageless Core Epiphany');

    // The app defaults every incarnate slot to ACTIVE (createDefaultIncarnateActiveState);
    // calculateCharacterTotals' own fallback is every slot OFF, so omitting it here would
    // switch off the very incarnate under test.
    const on = createDefaultIncarnateActiveState();
    const at50 = calculateCharacterTotals(b, false, on);
    const at45 = calculateCharacterTotals(b, true, on, { exemplarLevel: 45 });
    const at44 = calculateCharacterTotals(b, true, on, { exemplarLevel: 44 });

    // 10, not the 40 peak: Destiny buffs decay, and the shipping default resolves them at
    // their SUSTAINED FLOOR (`destinyTime: null`). The dashboard has always shown the floor —
    // `calculateCharacterTotals` collapses an omitted `destinyTime` to `null`, and the UI store's
    // own default is `null` too, so the flat-peak reading is unreachable from the app.
    expect(at50.globalBonuses.recharge).toBeCloseTo(10, 6);
    expect(at45.globalBonuses.recharge).toBeCloseTo(at50.globalBonuses.recharge, 6);
    expect(at44.globalBonuses.recharge).toBe(0); // suppressed below 45
  });

  it('Fate Genesis grants its exemplar +Recharge buff only below 45', () => {
    const b = controllerL50();
    // Fate Genesis (Ageless_Fate exemplar): +20% recharge below 45. At 45+ the
    // amplifier needs a Destiny to act on (none slotted here), so recharge = 0.
    b.incarnates.genesis = selected('genesis', 'fate_genesis', 'Fate Genesis', 'fate', 'Fate');

    const on = createDefaultIncarnateActiveState();
    const at45 = calculateCharacterTotals(b, true, on, { exemplarLevel: 45 });
    const at44 = calculateCharacterTotals(b, true, on, { exemplarLevel: 44 });

    expect(at45.globalBonuses.recharge).toBe(0);
    expect(at44.globalBonuses.recharge).toBeGreaterThan(0);
  });
});
