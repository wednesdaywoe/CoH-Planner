import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadDataset } from '@/data/dataset';
import { getArchetype, STANDARD_ARCHETYPE_IDS } from '@/data/archetypes';
import { getAllPowersets } from '@/data/powersets';
import { getIOSet } from '@/data/io-sets';
import { createGenericIOEnhancement } from '@/data/enhancement-registry';
import { PROC_GLOBAL_EFFECTS } from '@/data/generated/proc-globals.generated';
import { calculatePowerEnhancementBonuses } from '@/utils/calculations/enhancement-values';
import { toCharacterStateJson, type AdapterCalcContext } from '@/engine/characterStateAdapter';
import { type EngineTotals } from '@/engine/engineTotalsMap';
import { createEmptyBuild } from '@/types/build';
import type { Build } from '@/types/build';
import type { Power, SelectedPower } from '@/types/power';
import type { Enhancement, IOSetEnhancement } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Always-on MOVEMENT globals: the right magnitude, and enhanced by their own host.
 *
 * Two defects met on Thrust's "+Run Speed" (report 2026-07-26 — "not impacted by an
 * enhancement in the same power, and giving 10% when it's 35%"):
 *
 *  1. The extractor turned a global's binary scale into a displayed value with a bare
 *     x100, which assumes the template's table is `Melee_Ones`. Thrust's buff is
 *     `0.1 x Melee_SpeedRunning`, so the real value is 0.1 x 3.5 x 100 = 35%, not 10%.
 *     (Swift is the same structure and reads 35% in game.) The same bare mapping sent
 *     EVERY movement axis to the RunSpeed stat, which is why Launch's +Jump Height had
 *     to be held inert — it would have read as +Run Speed.
 *  2. Movement globals are ENHANCEABLE, unlike every other always-on global. Thrust's
 *     buff scales with the Run enhancement in its own slotting power; the engine applied
 *     it flat.
 *
 * The two compound: 35% base x 26.5% Run in the same power = 44.28% in game, against
 * the 10% the planner showed.
 *
 * Graded on the shipped engine (see `serverParity.test.ts` for the skip rule) with the
 * enhancement side computed independently in TS, so this fails if either half regresses
 * rather than only when the product happens to move.
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

const THRUST_GLOBAL = 'Thrust: Run/+Run Speed';
const LAUNCH_GLOBAL = 'Launch: Jump/+Jump Height/+Max Jump Height';

describe('movement proc globals — extracted magnitude', () => {
  // Data-level, so it holds with or without the engine artifacts.
  it('reads Thrust +Run Speed off its real speed table, not as a flat scale', () => {
    // 0.1 scale x Melee_SpeedRunning (3.5) x 100. A bare x100 gives the reported 10.
    expect(PROC_GLOBAL_EFFECTS[THRUST_GLOBAL]).toEqual([{ category: 'RunSpeed', value: 35.0 }]);
  });

  it('routes Launch to jump height, and leaves its cap-raise twin inert', () => {
    // Launch carries two movement templates: the aspect=Current +Jump Height BUFF and an
    // aspect=Maximum CAP raise (10.0 x Melee_Ones = +1000%), which the planner models as a
    // power's movementCapBump. Emitting the cap raise as a buff would read Launch as
    // +1200% jump height, so only the Current one becomes an effect.
    const effects = PROC_GLOBAL_EFFECTS[LAUNCH_GLOBAL];
    expect(effects).toHaveLength(2);
    expect(effects[0]).toEqual({ category: 'JumpHeight', value: 200.0 });
    expect(effects[1].category).toBe('Special');
    expect((effects[1] as any).value).toBeUndefined();
  });
});

const suite = artifactsReady ? describe : describe.skip;
if (!artifactsReady) {
  // eslint-disable-next-line no-console
  console.warn('[movement proc globals] skipped — engine artifacts absent; run `npm run build:engine`.');
}

suite('movement proc globals — enhanced by their own host (homecoming)', () => {
  /** The proc pass's own contribution to a stat — read off the engine's `type:'proc'`
   *  breakdown rows rather than the dashboard total, because a Run-accepting host is
   *  usually a travel power that buffs run speed itself. */
  let procContribution: (b: Build, key: string) => number;
  let host: Power;
  let hostSetId: string;

  beforeAll(async () => {
    await loadDataset('homecoming');
    const mod = require(NODE_ENGINE) as { load_dataset: (b: Uint8Array) => { recalculate: (j: string) => string } };
    const handle = mod.load_dataset(new Uint8Array(readFileSync(BUNDLE)));
    const engine = (b: Build) =>
      JSON.parse(handle.recalculate(toCharacterStateJson(b, CTX))) as EngineTotals;
    procContribution = (b, key) =>
      engine(b).proc_breakdown
        .filter((s) => s.breakdown_key === key && !s.capped)
        .reduce((sum, s) => sum + s.value, 0);

    // A Thrust piece needs a Run-accepting always-on host. Found by scanning the dataset
    // rather than named, so this test does not encode a fork's proper nouns. A power spells
    // the category "Run Speed" while an IO-set piece spells the same aspect "Run" — accept
    // either, the way the enhancement aggregation's own alias table does.
    const acceptsRun = (p: Power) =>
      ((p.allowedEnhancements ?? []) as string[]).some((a) => a === 'Run Speed' || a === 'Run');
    const registry = getAllPowersets() as Record<string, { id?: string; powers: Power[] }>;
    for (const setId of Object.keys(registry).sort()) {
      const found = registry[setId].powers.find(
        (p) => (p.powerType === 'Auto' || p.powerType === 'Toggle') && acceptsRun(p),
      );
      if (found) { host = found; hostSetId = registry[setId].id ?? setId; break; }
    }
  });

  /** The Thrust "+Run Speed" piece — the proc, plus a Run aspect of its own. */
  const thrustProc = (): IOSetEnhancement => {
    const set = getIOSet('thrust')!;
    const piece = set.pieces.find((p) => (p as any).proc)!;
    return {
      id: 'thrust-proc', type: 'io-set', setId: 'thrust', setName: set.name,
      name: piece.name!, pieceNum: piece.num, level: 50,
      aspects: (piece as any).aspects ?? [], isProc: true, isUnique: true,
    } as unknown as IOSetEnhancement;
  };

  const buildWith = (slots: (Enhancement | null)[]): Build => {
    const atId = STANDARD_ARCHETYPE_IDS[0];
    const build = createEmptyBuild('homecoming');
    build.level = 50;
    build.archetype = { id: atId, name: getArchetype(atId)?.name ?? atId, stats: null, inherent: null } as Build['archetype'];
    const picked = { ...host, powerSet: hostSetId, level: 1, slots, isActive: true } as SelectedPower;
    build.primary = { id: hostSetId, name: hostSetId, powers: [picked] };
    return build;
  };

  it('the fixture found a real Run-accepting host', () => {
    // Without one the proc contributes nothing and every assertion below is vacuous.
    expect(host, 'no Auto/Toggle power in homecoming accepts Run enhancement').toBeDefined();
  });

  it("the global lands at its base value times the host's own Run enhancement", () => {
    const slots = [thrustProc()];
    const engineRun = procContribution(buildWith(slots), 'runSpeed');

    // Computed independently of the engine, from the same slotting.
    const enh = calculatePowerEnhancementBonuses(
      { name: host.name, slots, allowedEnhancements: host.allowedEnhancements } as any,
      50, getIOSet as any,
    );
    expect(enh.run, 'the proc piece carries a Run aspect — without it this proves nothing')
      .toBeGreaterThan(0);
    // Graded at the engine-vs-TS parity tolerance (`serverParity.test.ts` F32_TOLERANCE):
    // the engine sums in f32 off the contract's enhancement curves while this reads the
    // beta's own, which part in the fifth decimal of the ratio. Both bugs miss by orders
    // of magnitude more — unenhanced is 35, and the mis-tabled value was 12.6.
    expect(engineRun).toBeCloseTo(35 * (1 + enh.run!), 1);
  });

  it('more Run enhancement in the same power raises it', () => {
    // The user-visible half of the report: the global ignored slotting entirely.
    const bare = procContribution(buildWith([thrustProc()]), 'runSpeed');
    const slotted = procContribution(buildWith([
      thrustProc(),
      // The power's own vocabulary for the aspect (an IO-set piece spells it "Run").
      createGenericIOEnhancement('Run Speed', 50),
      createGenericIOEnhancement('Run Speed', 50),
    ]), 'runSpeed');
    expect(bare).toBeGreaterThan(0);
    expect(slotted).toBeGreaterThan(bare);
  });
});
