import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import { AT_TABLES as HC_AT, getTableValue as hcGet } from './datasets/homecoming/at-tables';
import { AT_TABLES as RB_AT, getTableValue as rbGet } from './datasets/rebirth/at-tables';
import { AT_TABLES as TS_AT, getTableValue as tsGet } from './datasets/thunderspy/at-tables';
import { AT_TABLES as BS_AT, getTableValue as bsGet } from './datasets/brainstorm/at-tables';

/**
 * AT-table archetype COVERAGE — every archetype that ships generated powersets
 * must also ship modifier tables.
 *
 * The bug this guards (Rebirth Guardian, 2026-07-07): `scripts/extract-at-tables.cjs`
 * once read a hand-listed `PLAYER_ARCHETYPES` allowlist. The Rebirth-only Guardian AT
 * had generated powersets but was missing from that allowlist, so its `guardian.json`
 * modifier tables were never folded into `at-tables.ts`. Every Guardian defense power
 * then missed its `Melee_Buff_Def` lookup and the display fell through to the legacy
 * `scale × 0.10 × buffDebuffMod` path — rendering S/L Defense at 3.4% where the game
 * shows 12.75% (and Combat Jumping at 0.5% vs 1.88%). That allowlist is now derived from
 * the export's own membership signal (`derivePlayerArchetypes` in
 * `scripts/_player-classes.cjs`), closing the omission class at the source; this test is
 * the independent structural backstop should the discriminator ever exclude a real AT.
 *
 * The invariant is structural and can't be fooled by a valid-but-absent table name
 * (which `converter-table-integrity.test.ts` deliberately can't catch — it resolves a
 * name against ANY archetype): if `generated/powersets/<at>/` exists, `AT_TABLES[<at>]`
 * must exist and resolve a real defense multiplier. This automatically covers every
 * future custom AT on any server (Rebirth Guardian, Thunderspy Primalist, …).
 */

const DATASETS = [
  { id: 'homecoming', tables: HC_AT, get: hcGet },
  { id: 'rebirth', tables: RB_AT, get: rbGet },
  { id: 'thunderspy', tables: TS_AT, get: tsGet },
  { id: 'brainstorm', tables: BS_AT, get: bsGet },
] as const;

/** Powerset dir name (e.g. "arachnos-soldier") → AT_TABLES key. They already match. */
function powersetArchetypes(datasetId: string): string[] {
  const dir = fileURLToPath(
    new URL(`./datasets/${datasetId}/generated/powersets`, import.meta.url),
  );
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

describe('AT-table archetype coverage (every AT with powersets has modifier tables)', () => {
  for (const { id, tables, get } of DATASETS) {
    describe(id, () => {
      const archetypes = powersetArchetypes(id);

      it('discovers the powerset archetype dirs (guards a silent empty walk)', () => {
        expect(archetypes.length).toBeGreaterThan(10);
      });

      it('every archetype with generated powersets has an AT_TABLES entry', () => {
        const missing = archetypes.filter((at) => !(at in tables));
        expect(
          missing,
          missing.length
            ? `${id}: archetype(s) with powersets but NO modifier tables: ${missing.join(', ')}`
            : '',
        ).toEqual([]);
      });

      it('every such archetype resolves a real defense multiplier (no silent fallback)', () => {
        // Melee_Buff_Def is present on every player AT and is the exact table the
        // Guardian bug missed. A resolvable, positive value proves the tables were
        // actually folded in, not just that the key exists.
        const broken = archetypes.filter((at) => {
          const v = get(at, 'melee_buff_def', 50);
          return v === undefined || !(v > 0);
        });
        expect(
          broken,
          broken.length
            ? `${id}: archetype(s) whose melee_buff_def does not resolve: ${broken.join(', ')}`
            : '',
        ).toEqual([]);
      });
    });
  }

  it('pins the two custom ATs the allowlist must never drop again', () => {
    // Rebirth Guardian and Thunderspy Primalist are the server-specific ATs that
    // live only in one dataset's allowlist entry. Assert their defense table is the
    // real per-AT value (Guardian Melee_Buff_Def = 0.075 → Combat Jumping 0.25 scale
    // = 1.875%), not the 0.10 legacy fallback.
    expect(rbGet('guardian', 'melee_buff_def', 50)).toBeCloseTo(0.075, 4);
    expect(tsGet('primalist', 'melee_buff_def', 50)).toBeGreaterThan(0);
  });
});
