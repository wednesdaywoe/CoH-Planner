import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDataset, type DatasetId } from '@/data/dataset';
import { getArchetype } from '@/data';
import type { ArchetypeId } from '@/types';

/**
 * Archetype stats are binary-sourced from classes.bin (both servers).
 *
 * The per-level HP curve, HP cap, baseHP/maxHP, resistance cap (Phase 1) and
 * baseThreat (Phase 2 header scalar) come from the `attribs` block of
 * `exported_powers/[<dataset>/]tables/<at>.json` (written by export_classes.py)
 * → `archetype-stats.generated.ts` (convert-archetypes.cjs) → spread into the
 * dataset's archetypes.ts. This guard asserts the RUNTIME archetype stats still
 * match the committed binary export, so a hand-edit or a stale generated file
 * can't silently diverge the planner's core math from the live game. (It already
 * caught a stale hand-typed HC Brute HP table; sourcing baseThreat caught the
 * hand-port's wrong Rebirth Guardian threat, 1.0 → binary 2.0.)
 *
 * Homecoming = Parse7 (105-entry level tables); Rebirth = Parse6 (50-entry).
 * HC has Sentinel and no Guardian; Rebirth has Guardian and no Sentinel.
 * The other AT scalars (damageModifier, damageCap, buffDebuffModifier, …) are
 * NOT present in classes.bin as the planner's scalar values (exhaustively
 * verified) and remain hand-curated. See ARCHETYPE-DEFS-BINARY-SOURCING.md.
 */
const LEVELS = 50;
const r4 = (n: number) => Math.round(n * 1e4) / 1e4;

interface DatasetCase {
  id: DatasetId;
  tablesUrl: string;
  ats: ArchetypeId[];
}

const COMMON = [
  'blaster', 'controller', 'defender', 'scrapper', 'tanker', 'brute',
  'corruptor', 'dominator', 'mastermind', 'stalker', 'peacebringer',
  'warshade', 'arachnos-soldier', 'arachnos-widow',
];

const DATASETS: DatasetCase[] = [
  {
    id: 'homecoming' as DatasetId,
    tablesUrl: '../../exported_powers/tables',
    ats: [...COMMON, 'sentinel'] as ArchetypeId[],
  },
  {
    id: 'rebirth' as DatasetId,
    tablesUrl: '../../exported_powers/rebirth/tables',
    ats: [...COMMON, 'guardian'] as ArchetypeId[],
  },
];

function exportAttribs(tablesUrl: string, id: string): { hit_points: number[]; hp_cap: number[]; resistance_cap: number; base_threat: number } {
  const dir = fileURLToPath(new URL(tablesUrl, import.meta.url));
  const stem = id.replace(/-/g, '_');
  return JSON.parse(fs.readFileSync(`${dir}/${stem}.json`, 'utf8')).attribs;
}

describe.each(DATASETS)('archetype stats are binary-sourced ($id)', ({ id, tablesUrl, ats }) => {
  beforeAll(async () => {
    await loadDataset(id);
  });

  it.each(ats)('%s matches the committed classes.bin export', (atId) => {
    const at = getArchetype(atId);
    expect(at, `archetype ${atId} missing in ${id}`).toBeDefined();
    const s = at!.stats;
    const a = exportAttribs(tablesUrl, atId);

    const expHp = a.hit_points.slice(0, LEVELS).map(r4);
    const expCap = a.hp_cap.slice(0, LEVELS).map(r4);

    expect(s.hpTable.map(r4)).toEqual(expHp);
    expect(s.hpCapTable.map(r4)).toEqual(expCap);
    expect(r4(s.baseHP)).toBe(expHp[LEVELS - 1]);
    expect(r4(s.maxHP)).toBe(expCap[LEVELS - 1]);
    expect(r4(s.resistanceCap)).toBe(r4(a.resistance_cap));
    expect(r4(s.baseThreat)).toBe(r4(a.base_threat));
  });

  it.each(ats)('%s HP invariants hold', (atId) => {
    const s = getArchetype(atId)!.stats;
    expect(s.hpTable).toHaveLength(LEVELS);
    expect(s.hpCapTable).toHaveLength(LEVELS);
    for (let i = 1; i < s.hpTable.length; i++) {
      expect(s.hpTable[i]).toBeGreaterThanOrEqual(s.hpTable[i - 1]);
    }
    expect(r4(s.baseHP)).toBe(r4(s.hpTable[LEVELS - 1]));
    expect(r4(s.maxHP)).toBe(r4(s.hpCapTable[LEVELS - 1]));
    expect(s.maxHP).toBeGreaterThanOrEqual(s.baseHP);
    expect(s.resistanceCap).toBeGreaterThan(0);
    expect(s.resistanceCap).toBeLessThanOrEqual(1);
    expect(s.baseThreat).toBeGreaterThan(0);
    expect(s.baseThreat).toBeLessThanOrEqual(20);
  });
});
