import { describe, it, expect } from 'vitest';
import {
  STAT_SECTIONS,
  STAT_CATEGORY,
  groupStatsBySection,
  STAT_DEFINITIONS,
  GLOBAL_BONUS_OVERRIDES,
  type StatCategory,
} from './stat-definitions';

describe('stat section placement (single source of truth)', () => {
  it('assigns every stat to exactly one section', () => {
    const seen = new Set<string>();
    for (const { stats } of STAT_SECTIONS) {
      for (const id of stats) {
        expect(seen.has(id), `duplicate placement for ${id}`).toBe(false);
        seen.add(id);
      }
    }
  });

  it('derives STAT_CATEGORY from STAT_SECTIONS', () => {
    for (const { category, stats } of STAT_SECTIONS) {
      for (const id of stats) {
        expect(STAT_CATEGORY[id]).toBe(category);
      }
    }
  });

  it('places the relocated stats in their new sections', () => {
    // The moves: End Reduction + Heal Other → Health & Endurance, Level Shift → General/Offense.
    expect(STAT_CATEGORY['endreduction']).toBe('health-endurance');
    expect(STAT_CATEGORY['heal_other']).toBe('health-endurance');
    expect(STAT_CATEGORY['level_shift']).toBe('offense');
  });

  it('every placed stat has a definition', () => {
    for (const { stats } of STAT_SECTIONS) {
      for (const id of stats) {
        expect(STAT_DEFINITIONS[id], `missing definition for ${id}`).toBeDefined();
      }
    }
  });
});

describe('groupStatsBySection', () => {
  const sections: { name: string; categories: StatCategory[] }[] = [
    { name: 'General', categories: ['offense', 'movement'] }, // dashboard-style merge
    { name: 'Defense', categories: ['defense'] },
  ];

  it('orders within a section by the canonical STAT_SECTIONS order, not input order', () => {
    const shuffled = ['recharge', 'damage', 'runspeed', 'tohit', 'accuracy'];
    const [general] = groupStatsBySection(shuffled, (id) => id, sections);
    expect(general.stats).toEqual(['damage', 'accuracy', 'tohit', 'recharge', 'runspeed']);
  });

  it('only includes stats the surface passed in (variant/subset selection)', () => {
    // Detailed-style: a surface that includes `health` but omits `endcost`
    // (even though both are health-endurance) gets only what it passed in.
    const result = groupStatsBySection(
      ['prot_hold', 'mez_hold', 'health'],
      (id) => id,
      [
        { name: 'Status Protection', categories: ['status-protection'] },
        { name: 'Health & Endurance', categories: ['health-endurance'] },
      ],
    );
    const prot = result.find((s) => s.name === 'Status Protection');
    const he = result.find((s) => s.name === 'Health & Endurance');
    expect(prot?.stats).toEqual(['mez_hold', 'prot_hold']); // both passed → both placed, canonical order
    expect(he?.stats).toEqual(['health']); // endcost not in this surface's set → omitted
  });

  it('drops empty sections', () => {
    const result = groupStatsBySection(['damage'], (id) => id, sections);
    expect(result.map((s) => s.name)).toEqual(['General']);
  });

  it('preserves extra section fields (e.g. colorKey) on the result', () => {
    const withColor = [{ name: 'Offense', categories: ['offense'] as StatCategory[], colorKey: 'damage' }];
    const [section] = groupStatsBySection(['damage'], (id) => id, withColor);
    expect(section.colorKey).toBe('damage');
  });
});

describe('GLOBAL_BONUS_OVERRIDES', () => {
  it('does not override mez resistance (those use the per-type total via getValue)', () => {
    for (const id of ['mezres_hold', 'mezres_stun', 'mezres_kb']) {
      expect(GLOBAL_BONUS_OVERRIDES[id]).toBeUndefined();
    }
  });

  it('overrides placeholder (() => 0) stats that read from globalBonuses', () => {
    for (const id of ['range_bonus', 'heal_other', 'level_shift', 'endcost', 'netend']) {
      expect(GLOBAL_BONUS_OVERRIDES[id]).toBeDefined();
    }
  });
});
