import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDataset } from '@/data/dataset';
import { getArchetype } from '@/data';
import type { ArchetypeId } from '@/types';

/**
 * Archetype stats are binary-sourced from classes.bin.
 *
 * The per-level HP curve, HP cap, baseHP/maxHP and resistance cap come from the
 * `attribs` block of `exported_powers/tables/<at>.json` (written by
 * export_classes.py) → `archetype-stats.generated.ts` (convert-archetypes.cjs)
 * → spread into archetypes.ts. This guard asserts the RUNTIME archetype stats
 * still match the committed binary export, so a hand-edit or a stale generated
 * file can't silently diverge the planner's core HP math from the live game.
 * (It already caught a stale hand-typed Brute HP table.)
 *
 * Phase 1 covers the classes.bin-resident fields only; the scalar fields
 * (damageModifier, caps, buffDebuffModifier, …) remain hand-curated — see
 * ARCHETYPE-DEFS-BINARY-SOURCING.md.
 */
const TABLES = fileURLToPath(new URL('../../exported_powers/tables', import.meta.url));
const LEVELS = 50;
const r4 = (n: number) => Math.round(n * 1e4) / 1e4;

// archetype id (hyphenated) → export file stem (underscored)
const PLAYER_ATS: ArchetypeId[] = [
  'blaster', 'controller', 'defender', 'scrapper', 'tanker', 'sentinel',
  'brute', 'corruptor', 'dominator', 'mastermind', 'stalker',
  'peacebringer', 'warshade', 'arachnos-soldier', 'arachnos-widow',
] as ArchetypeId[];

function exportAttribs(id: string): { hit_points: number[]; hp_cap: number[]; resistance_cap: number } {
  const stem = id.replace(/-/g, '_');
  return JSON.parse(fs.readFileSync(`${TABLES}/${stem}.json`, 'utf8')).attribs;
}

describe('archetype stats are binary-sourced (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it.each(PLAYER_ATS)('%s matches the committed classes.bin export', (id) => {
    const at = getArchetype(id);
    expect(at, `archetype ${id} missing`).toBeDefined();
    const s = at!.stats;
    const a = exportAttribs(id);

    const expHp = a.hit_points.slice(0, LEVELS).map(r4);
    const expCap = a.hp_cap.slice(0, LEVELS).map(r4);

    expect(s.hpTable.map(r4)).toEqual(expHp);
    expect(s.hpCapTable.map(r4)).toEqual(expCap);
    expect(r4(s.baseHP)).toBe(expHp[LEVELS - 1]);
    expect(r4(s.maxHP)).toBe(expCap[LEVELS - 1]);
    expect(r4(s.resistanceCap)).toBe(r4(a.resistance_cap));
  });

  it.each(PLAYER_ATS)('%s HP invariants hold', (id) => {
    const s = getArchetype(id)!.stats;
    expect(s.hpTable).toHaveLength(LEVELS);
    expect(s.hpCapTable).toHaveLength(LEVELS);
    // monotonic non-decreasing HP curve
    for (let i = 1; i < s.hpTable.length; i++) {
      expect(s.hpTable[i]).toBeGreaterThanOrEqual(s.hpTable[i - 1]);
    }
    // baseHP/maxHP are the level-50 entries; cap >= base; sane resistance cap
    expect(r4(s.baseHP)).toBe(r4(s.hpTable[LEVELS - 1]));
    expect(r4(s.maxHP)).toBe(r4(s.hpCapTable[LEVELS - 1]));
    expect(s.maxHP).toBeGreaterThanOrEqual(s.baseHP);
    expect(s.resistanceCap).toBeGreaterThan(0);
    expect(s.resistanceCap).toBeLessThanOrEqual(1);
  });
});
