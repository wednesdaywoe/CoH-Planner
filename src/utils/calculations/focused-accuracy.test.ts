import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { calculateCharacterTotals } from './character-totals';

/**
 * Focused Accuracy grants a flat +Accuracy self-buff (aspect=Strength on the
 * Accuracy attrib, scale 0.2 on Melee_Ones = +20%). The generated extraction
 * historically dropped it (the converter's COMBAT_MODIFIERS map had no `accuracy`
 * entry, and the calc engine had no `accuracyBuff` handler), so only set-bonus
 * accuracy reached the dashboard. This pins the restored buff: FA's accuracyBuff
 * (merged via the epic-pool override) flows into globalBonuses.accuracy.
 */
describe('Focused Accuracy +Accuracy self-buff (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildWithFA(active: boolean): any {
    const b = createEmptyBuild();
    b.level = 50;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.archetype = { id: 'scrapper', name: 'Scrapper', stats: null, inherent: null } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    b.epicPool = { id: 'body_mastery', name: 'Body Mastery', powers: [
      { internalName: 'Focused_Accuracy', name: 'Focused Accuracy', isActive: active, slots: [] },
    ] } as any;
    return b;
  }

  it('adds +20% accuracy to globalBonuses when toggled on', () => {
    const off = calculateCharacterTotals(buildWithFA(false));
    const on = calculateCharacterTotals(buildWithFA(true));
    expect(off.globalBonuses.accuracy).toBe(0);
    // Melee_Ones resolves to 1.0 at all levels → 0.2 × 100 = +20%.
    expect(on.globalBonuses.accuracy).toBeCloseTo(20, 4);
  });
});
