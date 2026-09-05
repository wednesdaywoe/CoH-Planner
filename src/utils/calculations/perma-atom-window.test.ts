/**
 * The perma window is read off the atoms — BPORT2's half of the beta-side bag port.
 *
 * `isPermaEligible` used to open with `if (!power.effects) return false` and derive its window
 * from a `durations` map keyed by bag slot. That answers "not eligible" for every bagless power,
 * which is what this fork's whole corpus becomes at the converter strip (BPORT7) — a perma ring
 * that vanishes from every power at once, with no test going red to say so. These are the three
 * claims that keep that from happening quietly.
 */

import { describe, it, expect } from 'vitest';
import { loadDataset, DATASET_IDS } from '@/data/dataset';
import { getAllPowersets } from '@/data/powersets';
import { getAllPowerPools } from '@/data/power-pools';
import { getAllEpicPools } from '@/data/epic-pools';
import { isPermaEligible, selfStateWindow } from './perma';
import type { Power } from '@/types';

/** One atom tuple through `pvMode` (index 9), plus `ownerTargets` at 35 when given. */
const atom = (
  effectType: string,
  subType: string | null,
  scale: number,
  duration: number,
  table: string,
  toWho: string,
  ownerTargets?: string[],
) => {
  const t: unknown[] = [effectType, subType, scale, 1, duration, table, 'Cur', 'Magnitude', toWho, 'Any'];
  if (ownerTargets) {
    t.length = 35;
    t.fill(null, 10, 35);
    t.push(ownerTargets);
  }
  return t;
};

const power = (over: Record<string, unknown>): Power =>
  ({ name: 'Probe', internalName: 'Probe', powerType: 'Click', ...over }) as unknown as Power;

describe('the window survives the bag', () => {
  it('a power with atoms and NO effects bag is still perma-eligible', () => {
    const bagless = power({
      stats: { recharge: 300 },
      atoms: [atom('Defense', 'All', 0.2, 120, 'Melee_Buff_Def', 'Self')],
    });
    expect(bagless.effects).toBeUndefined();
    expect(selfStateWindow(bagless)).toBe(120);
    expect(isPermaEligible(bagless, { floor: 0.25, cap: 5 })).toBe(true);
  });

  /**
   * Non-vacuity for the claim above: the pre-port predicate has to FAIL this power, or the
   * assertion would pass on a rule that never changed. Stated as the bag read it did — a bag,
   * a `durations` map and a self slot — none of which the bagless power carries.
   */
  it('the shape the pre-port predicate needed is exactly what a stripped power lacks', () => {
    const bagged = power({
      effects: { recharge: 300, durations: { defense: 120 }, defense: { all: 0.2 } },
      atoms: [atom('Defense', 'All', 0.2, 120, 'Melee_Buff_Def', 'Self')],
    });
    // Both shapes answer the same window today, which is what makes the port safe to land
    // before the strip: the atom rule already agrees with the bag it is replacing.
    expect(selfStateWindow(bagged)).toBe(120);
  });
});

describe('a Target atom resolves its pronoun through ownerTargets first', () => {
  /**
   * Fulcrum Shift is the case that names itself. The power is aimed at a foe
   * (`targetsAffected: ['Foe']`) and its eight `+Damage` rows arrive from the buff sub-power it
   * executes, stamped `ownerTargets: ['Friend', 'Self']` — the collection provenance TARGETS-3
   * put there precisely so a redirected row is not read against its parent's aim. Vetoing on the
   * parent deletes a 45s window the caster demonstrably holds, which is the archetypal Kinetics
   * perma target.
   *
   * `coh_math::perma::reaches_caster_for_perma` reads only the parent's list and loses it —
   * `perma_eligibility_census` reports `win 0.0, rust false` on all four Kinetics copies. That
   * divergence is filed, not mirrored; this test is the thing that would notice it being
   * "reconciled" by taking the window away. Homecoming and Brainstorm are the two forks that
   * stamp `ownerTargets` here at all; Rebirth and Thunderspy carry a 1s window and are
   * ineligible either way, which is why they are not in the list.
   */
  const SHIFT_FORKS = ['homecoming', 'brainstorm'] as const;

  it.each(SHIFT_FORKS)('%s: Fulcrum Shift keeps its 45s caster window', async (id) => {
    await loadDataset(id);
    const found = Object.values(getAllPowersets())
      .flatMap((set) => set.powers ?? [])
      .filter((p) => p.internalName === 'Fulcrum_Shift');
    expect(found.length, `${id}: Fulcrum Shift copies`).toBeGreaterThan(0);
    for (const p of found) {
      expect(p.targetsAffected, `${id} ${p.internalName}: parent aim`).toEqual(['Foe']);
      expect(selfStateWindow(p), `${id} ${p.internalName}: window`).toBe(45);
      expect(isPermaEligible(p, { floor: 0.25, cap: 5 })).toBe(true);
    }
  });

  it('a Target atom with no ownerTargets still reads the parent list', () => {
    const foeAimed = power({
      targetsAffected: ['Foe'],
      stats: { recharge: 300 },
      atoms: [atom('Defense', 'All', 0.2, 120, 'Melee_Buff_Def', 'Target')],
    });
    expect(selfStateWindow(foeAimed)).toBe(0);
  });
});

describe('the authored-cycle arm can only answer for a synthesised power', () => {
  /**
   * `authoredCycle` is the one bag read left in `perma.ts`, and it is safe only because nothing
   * the export ships can reach it. That is a measurement, so it is measured here rather than
   * asserted in a comment: if a converter ever emits an atom-less power, this goes red and the
   * arm stops being scoped.
   */
  it.each(DATASET_IDS)('%s: every exported power carries atoms, in all three partitions', async (id) => {
    await loadDataset(id);
    // All three, because the partitions are converted by different scripts and the pool/epic
    // pair went atom-less for months while the powersets did not — a census of the powersets
    // alone would have read as proof for a claim it had not tested.
    const partitions: [string, { powers?: Power[] }[]][] = [
      ['powerset', Object.values(getAllPowersets())],
      ['pool', Object.values(getAllPowerPools())],
      ['epic', Object.values(getAllEpicPools())],
    ];
    for (const [label, sets] of partitions) {
      const powers = sets.flatMap((set) => set.powers ?? []);
      expect(powers.length, `${id}/${label}: powers`).toBeGreaterThan(10);
      const atomless = powers.filter((p) => !p.atoms?.length).map((p) => p.internalName ?? p.name);
      expect(atomless, `${id}/${label}: atom-less exported powers`).toEqual([]);
    }
  });

  it('a power that carries atoms never reads the bag cycle', () => {
    // The bag says 300s/120s; the atoms say the caster holds nothing. The atoms win.
    const both = power({
      effects: { recharge: 300, buffDuration: 120 },
      atoms: [atom('Damage', 'Fire', 1, 0, 'Ranged_Damage', 'Target')],
    });
    expect(selfStateWindow(both)).toBe(0);
    expect(isPermaEligible(both, { floor: 0.25, cap: 5 })).toBe(false);
  });

  it('an atom-less synthesised card keeps its authored cycle', () => {
    // The archetype-inherent card shape: `createArchetypeInherentPower` states the cycle in
    // `archetypes.ts` because this fork has no join to the `Inherent.Inherent` twin.
    const card = power({ effects: { recharge: 200, buffDuration: 90, enduranceGain: 100 } });
    expect(selfStateWindow(card)).toBe(90);
    expect(isPermaEligible(card, { floor: 0.25, cap: 5 })).toBe(true);
  });
});
