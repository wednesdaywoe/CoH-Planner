import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { STANCE_GROUPS, stanceAdjusterOverrides, activeStanceOptionId } from '@/data';
import type { StancePowerLike } from '@/data';

/**
 * Dual Pistols "Swap Ammo": each attack's SECONDARY effect changes with the
 * loaded ammo (Standard -Def, Cryo -Recharge, Chemical -Damage; Incendiary's
 * DoT is damage). In the binary this is a Tag + global-chance-mod mechanic
 * (no `requires_expression`); the parser now captures the Tag, and the converter
 * attributes each tag-gated secondary to its ammo, emitting mutually-exclusive
 * `swap-ammo` conditionals and removing them from base. Core effects that are
 * NOT ammo-specific (knockback, damage) must remain in base. The active ammo is
 * the build-scoped `Swap_Ammo.activeSubPower`, defaulting to Standard.
 */
describe('Dual Pistols Swap Ammo (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('routes each ammo secondary into mutually-exclusive swap-ammo conditionals, out of base', () => {
    const ps = getPowerset('blaster/dual-pistols');
    const pistols = ps?.powers.find((p) => p.internalName === 'Pistols');
    expect(pistols).toBeDefined();
    const conds = pistols!.conditionalEffects ?? [];
    const byId = Object.fromEntries(conds.map((c) => [c.id, c]));

    expect(byId.lethalammo?.effects?.defenseDebuff).toBeDefined(); // Standard -Def
    expect(byId.lethalammo?.defaultActive).toBe(true);
    // Cryo carries BOTH halves of its Slow in one conditional: -Recharge + -Movement.
    expect(byId.cryoammunition?.effects?.rechargeDebuff).toBeDefined();
    expect((byId.cryoammunition?.effects as Record<string, unknown> | undefined)?.slow).toBeDefined();
    expect(byId.chemicalammunition?.effects?.damageDebuff).toBeDefined(); // Chemical -Damage

    for (const id of ['lethalammo', 'cryoammunition', 'chemicalammunition']) {
      expect(byId[id]?.group).toBe('swap-ammo');
    }
    // The -Def moved out of base into lethalammo (no longer always-on).
    expect(pistols!.effects?.defenseDebuff).toBeUndefined();
  });

  it('keeps core (non-ammo) effects like knockback in base, not in an ammo conditional', () => {
    const ps = getPowerset('blaster/dual-pistols');
    const empty = ps?.powers.find((p) => p.internalName === 'Empty_Clips');
    expect(empty?.effects?.knockback).toBeDefined();
    const lethal = (empty?.conditionalEffects ?? []).find((c) => c.id === 'lethalammo');
    // lethalammo carries only the ammo secondary (-Def), not the attack's knockback.
    expect((lethal?.effects as Record<string, unknown> | undefined)?.knockback).toBeUndefined();
  });

  it('Standard is the default when no ammo is loaded; selecting Cryo flips the active option', () => {
    const group = STANCE_GROUPS.find((g) => g.key === 'swap-ammo');
    expect(group).toBeDefined();

    // No Swap Ammo power taken → Standard (default) is active.
    expect(activeStanceOptionId([], group!)).toBe('lethalammo');

    // Swap Ammo taken, Cryo loaded → Cryo active, Standard off.
    const withCryo: StancePowerLike[] = [{ internalName: 'Swap_Ammo', activeSubPower: 'Cryo_Ammunition' }];
    expect(activeStanceOptionId(withCryo, group!)).toBe('cryoammunition');
    const overrides = stanceAdjusterOverrides(withCryo);
    expect(overrides.cryoammunition).toBe(true);
    expect(overrides.lethalammo).toBe(false);

    // Swap Ammo taken but nothing loaded → back to Standard default.
    const noAmmo: StancePowerLike[] = [{ internalName: 'Swap_Ammo' }];
    expect(activeStanceOptionId(noAmmo, group!)).toBe('lethalammo');
  });
});
