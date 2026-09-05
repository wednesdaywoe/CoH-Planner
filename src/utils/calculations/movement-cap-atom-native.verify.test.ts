/**
 * BPORT6 — the movement-cap bump, read off the atoms.
 *
 * `StatsDashboard` derived the effective run/jump/fly ceilings from
 * `effects.movementCapBump`, a bare bag read with no second arm. BPORT7 takes that slot off
 * the powerset layer, and the read would then answer nothing for every travel power at once
 * — no exception, no zero in a total anybody watches, just a dashboard quietly showing the
 * unbuffed 21.5 mph run cap while Super Speed is on. The canonical fork hit exactly that and
 * its note on the seam names the casualties it found afterwards: Quantum Acceleration on all
 * four forks, Energy Flight on Homecoming and Brainstorm.
 *
 * So the arm lands while both sides still answer, and this is the comparison that could only
 * be made here: `movementCapBumpValue` against the bag it replaces, on every power of every
 * dataset. They agree on all 28 carriers — same axes, same scales, same suppress groups, same
 * suppressible flags — and neither path holds a carrier the other does not.
 *
 * Two things this pins beyond the equality:
 *
 *  - **The `Max` face is what makes a cap raise a cap raise.** Super Speed's run buff
 *    (1.0 × Melee_SpeedRunning, aspect Cur) and its cap raise (1.938 × Melee_Ones, aspect
 *    Max) are the same effect type on the same power; only the aspect separates them, and
 *    reading the wrong one is the original bag-vs-array collapse this whole plan is named
 *    for. It is also the whole of the FlyMode exclusion: the flight-MODE grant is `Cur`-face,
 *    so `routeMovementAtom` drops it before any axis map is consulted.
 *  - **The suppress group and the suppressible flag ride each entry**, which is what lets
 *    combat mode keep Super Speed's ceiling and drop Super Jump's.
 *
 * Mutation-tested on four changes to the reader: dropping `suppressible`, dropping the
 * `stackKey`, and widening the slot filter past `Max` all go red here. The fourth — dropping
 * the axis map — does NOT, and that is a fact about the data rather than a hole: no atom that
 * routes to `capBump` carries a subType outside the map, because `isCaplessAxis` has already
 * taken `Control` and `Friction` and the aspect test has already taken everything else. The
 * map is a second filter with an empty population, so it is not claimed here as one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { movementCapBumpValue } from '@/data/core/atom-query';
import { MODULAR_POWERSETS as HC } from '@/data/datasets/homecoming/powersets';
import { MODULAR_POWERSETS as RB } from '@/data/datasets/rebirth/powersets';
import { MODULAR_POWERSETS as TSPY } from '@/data/datasets/thunderspy/powersets';
import { MODULAR_POWERSETS as BS } from '@/data/datasets/brainstorm/powersets';
import { POWER_POOLS_RAW as HCP } from '@/data/datasets/homecoming/power-pools-raw';
import { EPIC_POOLS_RAW as HCE } from '@/data/datasets/homecoming/epic-pools-raw';
import { POWER_POOLS_RAW as RBP } from '@/data/datasets/rebirth/power-pools-raw';
import { EPIC_POOLS_RAW as RBE } from '@/data/datasets/rebirth/epic-pools-raw';
import { POWER_POOLS_RAW as TSP } from '@/data/datasets/thunderspy/power-pools-raw';
import { EPIC_POOLS_RAW as TSE } from '@/data/datasets/thunderspy/epic-pools-raw';
import { POWER_POOLS_RAW as BSP } from '@/data/datasets/brainstorm/power-pools-raw';
import { EPIC_POOLS_RAW as BSE } from '@/data/datasets/brainstorm/epic-pools-raw';
import { MOVEMENT_BASES } from '@/data/core/movement-constants';

type AnyPower = Record<string, unknown> & { name?: string; internalName?: string };
type Tree = Record<string, { powers?: AnyPower[] }>;

const PARTITIONS: readonly (readonly [string, Tree])[] = [
  ['homecoming/set', HC as unknown as Tree], ['rebirth/set', RB as unknown as Tree],
  ['thunderspy/set', TSPY as unknown as Tree], ['brainstorm/set', BS as unknown as Tree],
  ['homecoming/pool', HCP as unknown as Tree], ['homecoming/epic', HCE as unknown as Tree],
  ['rebirth/pool', RBP as unknown as Tree], ['rebirth/epic', RBE as unknown as Tree],
  ['thunderspy/pool', TSP as unknown as Tree], ['thunderspy/epic', TSE as unknown as Tree],
  ['brainstorm/pool', BSP as unknown as Tree], ['brainstorm/epic', BSE as unknown as Tree],
];

function* corpus(): Generator<[string, AnyPower]> {
  for (const [label, tree] of PARTITIONS) {
    for (const [setId, set] of Object.entries(tree)) {
      for (const power of set?.powers ?? []) yield [`${label}/${setId}`, power];
    }
  }
}

type Row = { stat: string; scale: number; stackKey?: string; suppressible?: boolean };
const canon = (rows: Row[]) =>
  rows.map((r) => `${r.stat}:${r.scale}:${r.stackKey ?? '-'}:${r.suppressible ?? '-'}`).sort();

/** The retired read, verbatim, as the shadow oracle. Scoped to a populated bag. */
function bagRows(power: AnyPower): Row[] {
  const bump = (power.effects as { movementCapBump?: Record<string, unknown> } | undefined)?.movementCapBump;
  if (!bump) return [];
  return Object.entries(bump).flatMap(([stat, b]) => {
    if (!b || typeof b === 'number' || typeof (b as { scale?: unknown }).scale !== 'number') return [];
    const v = b as { scale: number; stackKey?: string; suppressible?: boolean };
    return [{ stat, scale: v.scale, stackKey: v.stackKey, suppressible: v.suppressible }];
  });
}

function atomRows(power: AnyPower): Row[] | undefined {
  const rows = movementCapBumpValue(power as never);
  return rows?.map((e) => ({
    stat: e.axis, scale: e.scale, stackKey: e.stackKey, suppressible: e.suppressible,
  }));
}

describe('the movement-cap bump survives the bag', () => {
  it('agrees with the bag on every carrier, and neither path has one the other lacks', () => {
    const disagree: string[] = [];
    const bagOnly: string[] = [];
    const atomOnly: string[] = [];
    let carriers = 0;
    for (const [label, power] of corpus()) {
      const id = `${label}/${power.internalName ?? power.name}`;
      const bag = bagRows(power);
      const atoms = atomRows(power) ?? [];
      if (bag.length === 0 && atoms.length === 0) continue;
      if (bag.length === 0) { atomOnly.push(id); continue; }
      if (atoms.length === 0) { bagOnly.push(id); continue; }
      carriers++;
      if (canon(bag).join('|') !== canon(atoms).join('|')) {
        disagree.push(`${id}\n  bag  ${canon(bag).join(' ')}\n  atom ${canon(atoms).join(' ')}`);
      }
    }
    if (carriers === 0) {
      // Stated rather than silent: after BPORT7 the bag holds no bump on any power and this
      // leg has nothing to compare. The two below outlive the strip.
      expect(bagOnly, 'bag already stripped — this leg is pre-strip only').toEqual([]);
      return;
    }
    expect(disagree).toEqual([]);
    expect(bagOnly, 'bag raises a cap the atoms do not').toEqual([]);
    expect(atomOnly, 'atoms raise a cap the bag does not').toEqual([]);
    expect(carriers).toBe(28);
  });

  it('emits capped axes only, and reaches three of the four', () => {
    // Every axis the dashboard is handed has to be one it holds a base for, or the cap it
    // computes is `undefined × something`. The corpus reaches three: no power in any dataset
    // raises the jump-HEIGHT ceiling, only jump SPEED. Stated as the exact set rather than a
    // subset, so a fourth axis appearing is a finding to read rather than a silent widening.
    const axes = new Set<string>();
    for (const [, power] of corpus()) for (const row of atomRows(power) ?? []) axes.add(row.stat);
    for (const axis of axes) expect(Object.keys(MOVEMENT_BASES)).toContain(axis);
    expect([...axes].sort()).toEqual(['flySpeed', 'jumpSpeed', 'runSpeed']);
  });

  it('is the arm the dashboard actually reads, not one sitting beside it', () => {
    // A structural claim, and deliberately so: the two paths agree on all 28 carriers today,
    // so no behavioural test can tell a dashboard that calls the atom reader from one that
    // still falls straight through to the bag. The difference only becomes observable at
    // BPORT7, when the bag empties and the second reads zero — which is exactly too late.
    // So the claim is on the call, and it says why it is on the call.
    const src = readFileSync(
      new URL('../../components/layout/StatsDashboard.tsx', import.meta.url), 'utf8',
    );
    expect(src).toContain("import { movementCapBumpValue } from '@/data/core/atom-query'");
    expect(src).toContain('const atomBumps = movementCapBumpValue(p);');
    // And the bag arm is behind it, not beside it: an `undefined` answer falls through, an
    // empty one does not, so a travel power whose Maximum rows route elsewhere is not read
    // twice.
    expect(src).toContain('if (atomBumps) {');
  });

  it("reads Super Speed's Max-face cap raise, not its Cur-face run buff", () => {
    const [, superSpeed] = [...corpus()].find(
      ([l, p]) => l === 'homecoming/pool/speed' && (p.name === 'Super Speed' || p.internalName === 'Super_Speed'),
    )!;
    const run = atomRows(superSpeed)!.filter((r) => r.stat === 'runSpeed');
    expect(run).toHaveLength(1);
    // The two rows this separates are both `Movement`/`Run` on this one power: 1.938 ×
    // Melee_Ones at aspect `Max` is the cap raise, 1.0 × Melee_SpeedRunning at aspect `Cur`
    // is the speed buff. The scale is what says which one came back.
    expect(run[0].scale).toBeCloseTo(1.938, 3);
    // And it is neither grouped nor suppressible, which is the behaviour the dashboard's own
    // note calls out: Super Speed's ceiling persists in combat where Super Jump's does not.
    expect(run[0].stackKey).toBeUndefined();
    expect(run[0].suppressible).toBeUndefined();
    const superJump = [...corpus()].find(
      ([l, p]) => l === 'homecoming/pool/leaping' && (p.name === 'Super Jump' || p.internalName === 'Super_Jump'),
    )![1];
    const jump = atomRows(superJump)!.filter((r) => r.stat === 'jumpSpeed');
    expect(jump).toHaveLength(1);
    expect(jump[0].stackKey).toBe('TravelMaxBuff');
    expect(jump[0].suppressible).toBe(true);
  });
});
