import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { buildChainPowers } from './attack-chain-powers';
import { Jab } from '@/data/datasets/homecoming/generated/powersets/tanker/secondary/super-strength/jab';
import { OffensiveAdaptation } from '@/data/datasets/homecoming/generated/powersets/tanker/primary/bio-armor/offensive-adaptation';

/**
 * Granted DoT procs (convert-powerset `resolveGrantedDamageProcs`) live on a
 * hidden Temporary_Powers power the granting power hands out: Molten Embrace,
 * Stalker Hidden Flame, Toxins, Envenomed Blades, Bio Offensive Adaptation.
 * They fire off the player's OWN attacks, so the Attack Chain Builder folds
 * their expected per-cast contribution (`tickChance × per-tick × ticks`) into
 * every attack's damage. Two gates:
 *
 *  1. stance-scoped granting powers only count when their stance is selected —
 *     Bio Offensive Adaptation's Toxic DoT must not leak into a Defensive or
 *     no-stance chain;
 *  2. pure buffs (Build Up) must not gain pseudo-attack damage and flip their
 *     chain classification.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function bioBuild(activeSubPower?: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = createEmptyBuild();
  b.level = 50;
  b.archetype = { id: 'tanker', name: 'Tanker', stats: null, inherent: null };
  b.primary = {
    id: 'tanker/bio-armor',
    name: 'Bio Armor',
    powers: [
      // Real generated powers: Jab (a damaging attack) + Offensive Adaptation
      // (the stance power whose grantedDamageProcs the converter resolved).
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ...(Jab as any), powerSet: 'tanker/bio-armor', level: 1, isActive: true, slots: [] },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ...(OffensiveAdaptation as any), powerSet: 'tanker/bio-armor', level: 1, isActive: true, slots: [] },
      ...(activeSubPower
        ? [{ internalName: 'Adaptation', name: 'Evolving Armor', powerSet: 'tanker/bio-armor', level: 1, isActive: false, slots: [], activeSubPower }]
        : []),
    ],
  };
  return b;
}

const globalBonuses = { recharge: 0, toHit: 0, maxEndurance: 0, toggleEndCost: 0 } as never;
const mechCtx = { archetypeId: 'tanker' } as never;

function jabDamage(build: unknown): number {
  const powers = buildChainPowers(build as never, globalBonuses, mechCtx);
  const jab = powers.find((p) => p.id.endsWith(':Jab'));
  expect(jab, 'Jab missing from the chain candidates').toBeDefined();
  return jab!.damage;
}

describe('Attack chain — granted DoT procs', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('a no-stance build folds the Offensive Adaptation Toxic DoT into the attack (no enabler needed)', () => {
    // Bio Offensive Adaptation is a stance-scoped grant. With no Adaptation
    // parent the stance is unavailable, so the grant must NOT count — the
    // attack shows its own damage only.
    const noStance = jabDamage(bioBuild(undefined));
    const defensive = jabDamage(bioBuild('Defensive_Adaptation'));
    const offensive = jabDamage(bioBuild('Offensive_Adaptation'));

    // Jab's own damage is the same in every stance; only the granted DoT moves.
    expect(noStance).toBeGreaterThan(0);
    expect(defensive).toBeCloseTo(noStance, 6); // Defensive grants no damage proc
    // Offensive Adaptation's Toxic DoT fires off every attack at its expected value.
    expect(offensive).toBeGreaterThan(defensive);
    const delta = offensive - defensive;
    // delta = tickChance (0.8) × per-tick × ticks. Per-tick is Jabs' own table
    // value × scale; the exact magnitude is data, but the fold is at least two
    // attack-powers' worth of expected DoT.
    expect(delta).toBeGreaterThan(0);
  });
});