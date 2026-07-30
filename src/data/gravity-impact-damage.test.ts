import { describe, it, expect, beforeAll } from 'vitest';
import type { Power, ScaledDamageEntry } from '@/types';
import { loadDataset } from '@/data/dataset';
import { selectActiveConditionals } from '@/utils/conditional-effects';
import { applyActiveConditionals } from '@/components/info/powerDisplayUtils';
import { calculatePowerDamage } from '@/utils/calculations/damage';
import { calculateContainmentDamage } from '@/utils/calculations/inherents';
import { applyAtMechanicBonus } from '@/utils/calculations/power-at-mechanics';
import { Propel as ControllerPropel } from './datasets/homecoming/generated/powersets/controller/primary/gravity-control/propel';
import { Lift as ControllerLift } from './datasets/homecoming/generated/powersets/controller/primary/gravity-control/lift';
import { Propel as DominatorPropel } from './datasets/homecoming/generated/powersets/dominator/primary/gravity-control/propel';
import { Propel as RebirthPropel } from './datasets/rebirth/generated/powersets/controller/primary/gravity-control/propel';
import { Propel as TspyPropel } from './datasets/thunderspy/generated/powersets/controller/primary/gravity-control/propel';
import { PET_ENTITIES } from './datasets/homecoming/pet-entities';

/**
 * Gravity Control's "Impact" bonus damage (reported 2026-07-30).
 *
 * Propel and Lift deal bonus damage to a target hit by Gravity Distortion — or
 * Gravity Distortion Field — within the last 12 seconds. In the binary it is a
 * separate effect group gated on `now GravityDistortion target.TokenTime> - 12 <`
 * with the floater "Impact!":
 *
 *   Propel  ['Smashing_Dmg'] Ranged_Damage 0.49   (base group is 1.96)
 *   Lift    ['Smashing_Dmg'] Ranged_Damage 0.33   (base group is 1.32)
 *
 * It was dropped entirely: `_isUntoggleableGate` blanket-blacklisted `.TokenTime>`,
 * so the group was excluded from the base collectors AND never surfaced as a
 * conditional. The blacklist is now source-side only (Radiation Melee's
 * Contamination, Kinetic Assault's secondaries are genuine caster combo state);
 * target-side token windows are target state the player drives by attack order.
 *
 * Three properties from the report, each verifiable in the export:
 *   - not mez-dependent — the gate has no kHeld/kImmobilized clause, unlike the
 *     Containment groups whose gate is entirely mez checks;
 *   - enhanceable — same `Ranged_Damage` table as base, no IgnoreStrength;
 *   - NOT doubled by Containment — the game mints `*_InherentDamage` twins only of
 *     the BASE group; there is no Containment twin of the Impact group.
 */

const IMPACT_ID = 'gravitydistortion';

function impactOf(power: Power) {
  return power.conditionalEffects?.find((c) => c.id === IMPACT_ID);
}

/** The conditional set the UI would apply with no user toggling at all. */
function defaultActive(power: Power) {
  return selectActiveConditionals(power, {}, {}, {});
}

const CTX = { archetypeId: 'controller', level: 50 } as const;

function damageOf(power: Power, enh = 0) {
  return calculatePowerDamage(power as never, CTX as never, { damage: enh }, 0, 0);
}

describe('Gravity Impact — data shape', () => {
  it.each([
    ['HC controller Propel', ControllerPropel as unknown as Power, 0.49],
    ['HC controller Lift', ControllerLift as unknown as Power, 0.33],
    ['HC dominator Propel', DominatorPropel as unknown as Power, 0.49],
    ['Rebirth controller Propel', RebirthPropel as unknown as Power, 0.49],
    ['Thunderspy controller Propel', TspyPropel as unknown as Power, 0.49],
  ])('%s carries the Impact conditional', (_label, power, scale) => {
    const impact = impactOf(power);
    expect(impact, 'Impact conditional missing').toBeDefined();
    expect(impact!.label).toBe('Impact (Gravity Distortion)');
    expect(impact!.scope).toBe('per-power');

    const entry = (Array.isArray(impact!.damage) ? impact!.damage[0] : impact!.damage) as ScaledDamageEntry;
    expect(entry.scale).toBeCloseTo(scale, 4);
    // Same table as the base damage → enhanced by Damage enhancement.
    expect(entry.table).toBe('Ranged_Damage');
    expect(entry.excludeFromAtMechanic).toBe(true);
  });

  it('defaults ON — Gravity Distortion opens the ST rotation, so Impact is the normal case', () => {
    const impact = impactOf(ControllerPropel as unknown as Power);
    expect(impact!.defaultActive).toBe(true);
    expect(defaultActive(ControllerPropel as unknown as Power).map((c) => c.id)).toContain(IMPACT_ID);
  });

  it('is NOT gated on the target being mezzed', () => {
    // A mez-gated bonus would have classified as Containment, not as its own
    // conditional. Guard the distinction by asserting Impact is the ONLY
    // conditional here and no Containment entry leaked into the array.
    const ids = ControllerPropel.conditionalEffects!.map((c) => c.id);
    expect(ids).toEqual([IMPACT_ID]);
  });
});

describe('Gravity Impact — damage math', () => {
  // calculatePowerDamage reads the AT damage tables off the active dataset.
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('adds its scale to the total when active', () => {
    const bare = damageOf(ControllerPropel as unknown as Power)!;
    const withImpact = damageOf(
      applyActiveConditionals(
        ControllerPropel as unknown as Power,
        defaultActive(ControllerPropel as unknown as Power),
      ).power,
    )!;
    // 1.96 base + 0.49 impact = 2.45
    expect(bare.scale).toBeCloseTo(1.96, 4);
    expect(withImpact.scale).toBeCloseTo(2.45, 4);
    expect(withImpact.final / bare.final).toBeCloseTo(2.45 / 1.96, 5);
  });

  it('is boosted by damage enhancement', () => {
    const power = applyActiveConditionals(
      ControllerPropel as unknown as Power,
      defaultActive(ControllerPropel as unknown as Power),
    ).power;
    const unenh = damageOf(power)!;
    const enh = damageOf(power, 1.0)!; // +100% damage
    expect(enh.enhanced / unenh.enhanced).toBeCloseTo(2, 5);
    // And the exempt slice scales too — it is enhanceable, just not AT-multiplied.
    expect(enh.atMechanicExemptDamage!.enhanced / unenh.atMechanicExemptDamage!.enhanced)
      .toBeCloseTo(2, 5);
  });

  it('reports the exempt slice as exactly the Impact share of the total', () => {
    const power = applyActiveConditionals(
      ControllerPropel as unknown as Power,
      defaultActive(ControllerPropel as unknown as Power),
    ).power;
    const d = damageOf(power)!;
    expect(d.atMechanicExemptDamage).toBeDefined();
    expect(d.atMechanicExemptDamage!.final / d.final).toBeCloseTo(0.49 / 2.45, 6);
  });

  it('a power with no Impact reports no exempt slice', () => {
    expect(damageOf(ControllerPropel as unknown as Power)!.atMechanicExemptDamage).toBeUndefined();
  });

  it('Containment doubles the BASE damage only, never Impact', () => {
    const power = applyActiveConditionals(
      ControllerPropel as unknown as Power,
      defaultActive(ControllerPropel as unknown as Power),
    ).power;
    const d = damageOf(power)!;
    const exempt = d.atMechanicExemptDamage!.final;
    const multiplier = calculateContainmentDamage(1, true);
    expect(multiplier).toBe(2);

    // The SHIPPED function the InfoPanel's applyBonus delegates to — not a local
    // re-implementation, so removing the exemption makes this test go red.
    const withContainment = applyAtMechanicBonus(d.final, multiplier, exempt);

    // Game-correct: base × 2 + impact. In scale terms, 1.96×2 + 0.49 = 4.41.
    const perScale = d.final / 2.45;
    expect(withContainment).toBeCloseTo(perScale * 4.41, 4);

    // The bug this guards: doubling the whole merged total → (1.96+0.49)×2 = 4.90,
    // an ~11% overstatement.
    const naive = d.final * multiplier;
    expect(naive).toBeCloseTo(perScale * 4.9, 4);
    expect(withContainment).toBeLessThan(naive);
    expect(naive / withContainment).toBeCloseTo(4.9 / 4.41, 4);
  });

  it('Impact off → Containment doubles everything, as before', () => {
    const d = damageOf(ControllerPropel as unknown as Power)!;
    const exempt = d.atMechanicExemptDamage?.final ?? 0;
    expect(exempt).toBe(0);
    expect(applyAtMechanicBonus(d.final, 2, exempt)).toBeCloseTo(d.final * 2, 6);
  });

  it('applyAtMechanicBonus clamps a mismatched exempt rather than going negative', () => {
    // Defensive: a pure-DoT power's direct tier is not part of the value passed in.
    expect(applyAtMechanicBonus(100, 2, 250)).toBe(100);
    expect(applyAtMechanicBonus(100, 2, -50)).toBe(200);
  });
});

describe("Gravity Impact — Singularity's Lift (the inverse bug)", () => {
  /**
   * convert-pet-entities.cjs has no conditional-gate filter, so the pet twin of the
   * same Impact group was summed UNCONDITIONALLY: Singularity's Lift read 1.32 + 0.33
   * = 1.65 always, a +25% over-count. A pet's powers carry no user toggle, so base
   * damage only is the honest reading.
   */
  it('shows base damage only, not base + Impact', () => {
    const singularities = Object.entries(PET_ENTITIES).filter(([key]) =>
      key.startsWith('Pets_Singularity'),
    );
    expect(singularities.length, 'no Singularity pets found — fixture stale').toBeGreaterThan(0);

    for (const [key, pet] of singularities) {
      const lift = pet.abilities?.find((p) => p.name === 'Lift');
      expect(lift, `${key} has no Lift`).toBeDefined();
      const entries = (lift!.damage ?? []) as { scale: number }[];
      expect(entries, `${key} Lift damage entries`).toHaveLength(1);
      expect(entries[0].scale).toBeCloseTo(1.32, 4);
    }
  });
});
