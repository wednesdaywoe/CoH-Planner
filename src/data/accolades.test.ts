import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDataset } from '@/data/dataset';
import { getArchetype, STANDARD_ARCHETYPE_IDS } from '@/data/archetypes';
import { getAccolades } from '@/data/accolades';
import { toCharacterStateJson, type AdapterCalcContext } from '@/engine/characterStateAdapter';
import { mapStats, type EngineTotals } from '@/engine/engineTotalsMap';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';

/**
 * Accolades must actually reach the totals — and the hand-authored table must say what the
 * game data says.
 *
 * Two failures met here (report 2026-07-26, "accolades are not applying their bonuses"):
 *
 *  1. The engine dropped them outright. `CharacterState.accolades` crossed the WASM boundary
 *     and no pass read it, so every selected accolade contributed zero. The pre-engine TS calc
 *     applied them in its own Step 8, which is why this reads as a swap regression. Fixed in
 *     the engine's Pass 0 gather (`coh_math::gather::resolve_accolades`): an accolade is an
 *     ordinary auto-on power and its atoms now flow through the apply loop like Health's.
 *  2. `src/data/accolades.ts` is a hand transcription of powers the contract already carries,
 *     and it had drifted from them — Marshall claimed a +5% Max Health its def does not carry,
 *     Born In Battle dropped the +5% Max Health its def does. Both errors were invisible while
 *     nothing applied.
 *
 * So the transcription is graded against the engine rather than against a second copy of the
 * numbers: for each accolade, toggle it alone and diff the dashboard totals. A future data
 * change (or another hand edit) that moves one apart from the other fails here.
 *
 * Runs on the wasm-node engine target, like the other `src/engine` gates — see
 * `serverParity.test.ts` for why a fresh checkout skips instead of erroring.
 */

const require = createRequire(import.meta.url);
const NODE_ENGINE = join(__dirname, '..', 'engine', 'wasm-node', 'coh_wasm.cjs');
const BUNDLE = join(__dirname, '..', '..', 'public', 'engine', 'contract', 'homecoming.json.gz');
const artifactsReady = existsSync(NODE_ENGINE) && existsSync(BUNDLE);

const CTX: AdapterCalcContext = {
  exemplarMode: false,
  exemplarLevel: 50,
  incarnateActive: { alpha: false, destiny: false, hybrid: false, interface: false, judgement: false, lore: false, genesis: false },
  incarnateLevelShiftActive: true,
  targetsHitValues: {},
  targetLevelOffset: 0,
  vigilanceTeamSize: 0,
  furyLevel: 75,
  combatMode: false,
  destinyTime: null,
  globalAdjusters: {},
  mechanicAdjusters: {},
  dominationActive: false,
  stalkerHidden: false,
};

/** The stats an accolade can move, keyed the way `Accolade.bonuses` names them. */
const STAT_KEY = { maxHP: 'maxhp', maxEndurance: 'maxend' } as const;

const suite = artifactsReady ? describe : describe.skip;
if (!artifactsReady) {
  // eslint-disable-next-line no-console
  console.warn('[accolades] skipped — engine artifacts absent; run `npm run build:engine`.');
}

suite('accolades reach the totals (homecoming)', () => {
  let run: (b: Build) => Record<string, number>;
  let bare: Build;

  beforeAll(async () => {
    await loadDataset('homecoming');
    const mod = require(NODE_ENGINE) as { load_dataset: (b: Uint8Array) => { recalculate: (j: string) => string } };
    const handle = mod.load_dataset(new Uint8Array(readFileSync(BUNDLE)));
    run = (b) => {
      const totals = JSON.parse(handle.recalculate(toCharacterStateJson(b, CTX))) as EngineTotals;
      return mapStats(totals.stats, totals.bonuses) as unknown as Record<string, number>;
    };

    // An archetype and a level are all an accolade needs — it is picked beside the powersets,
    // not out of one, so an empty build isolates its contribution exactly.
    const atId = STANDARD_ARCHETYPE_IDS[0];
    bare = createEmptyBuild('homecoming');
    bare.level = 50;
    bare.archetype = { id: atId, name: getArchetype(atId)?.name ?? atId, stats: null, inherent: null } as Build['archetype'];
  });

  it('the fixture itself has accolades to grade', () => {
    // A table that returned nothing would make every assertion below vacuous.
    expect(getAccolades().length).toBeGreaterThan(0);
  });

  it('every accolade applies exactly the bonuses its entry claims', () => {
    const before = run(bare);
    for (const accolade of getAccolades()) {
      const after = run({ ...bare, accolades: [accolade] });
      for (const [stat, key] of Object.entries(STAT_KEY) as [keyof typeof STAT_KEY, string][]) {
        const claimed = accolade.bonuses.find((b) => b.stat === stat)?.value ?? 0;
        expect(after[key] - before[key], `${accolade.id} ${stat}`).toBeCloseTo(claimed, 4);
      }
    }
  });

  it('pairs each accolade with the twin that carries the same effect', () => {
    // `excludes` deselects its counterpart, so a crossed pairing silently drops a bonus the
    // user picked. The twins are the hero/villain copies of ONE accolade — identical effect.
    const byId = new Map(getAccolades().map((a) => [a.id, a]));
    let checked = 0;
    for (const accolade of getAccolades()) {
      if (!accolade.excludes) continue;
      const twin = byId.get(accolade.excludes);
      expect(twin, `${accolade.id} excludes unknown ${accolade.excludes}`).toBeDefined();
      expect(twin!.excludes, `${accolade.id}/${twin!.id} must exclude each other`).toBe(accolade.id);
      const effect = (a: typeof accolade) =>
        [...a.bonuses].sort((x, y) => x.stat.localeCompare(y.stat)).map((b) => `${b.stat}:${b.value}`).join(',');
      expect(effect(twin!), `${accolade.id} vs ${twin!.id}`).toBe(effect(accolade));
      checked++;
    }
    expect(checked, 'no accolade declares an exclusion — the pairing went ungraded').toBeGreaterThan(0);
  });
});
