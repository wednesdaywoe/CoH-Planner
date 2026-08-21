import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { getPowerset } from '@/data/powersets';
import { STANCE_GROUPS, stanceAdjusterOverrides, activeStanceOptionId } from '@/data';
import type { StancePowerLike } from '@/data';

/**
 * Dual Pistols "Swap Ammo": each attack's SECONDARY effect changes with the
 * loaded ammo (Standard -Def, Cryo -Recharge/-Slow, Chemical -Damage;
 * Incendiary's DoT is damage). In the binary this is a Tag + global-chance-mod
 * mechanic; the converter reads the whole set's selectors and writes the gate
 * the mechanic implies (COND-9, `scripts/_variant-modes.cjs`): each ammo's
 * groups gain `k<Ammo>Ammo Source.Mode?` and surface as per-mode conditionals,
 * while the STANDARD secondary is the power's base — it stays in the bag, and
 * its atoms carry the negation of all three modes so a gate-honouring reader
 * drops it while an ammo is loaded. Mutual exclusion is the stance machinery's
 * job (the build's `Swap_Ammo.activeSubPower`), not a `group` field.
 */
describe('Dual Pistols Swap Ammo (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('surfaces each ammo secondary as a mode conditional, with Standard staying base', () => {
    const ps = getPowerset('blaster/dual-pistols');
    const pistols = ps?.powers.find((p) => p.internalName === 'Pistols');
    expect(pistols).toBeDefined();
    const conds = pistols!.conditionalEffects ?? [];
    const byId = Object.fromEntries(conds.map((c) => [c.id, c]));

    // Cryo carries BOTH halves of its Slow in one conditional: -Recharge + -Movement.
    expect(byId.iceammo?.effects?.rechargeDebuff).toBeDefined();
    expect((byId.iceammo?.effects as Record<string, unknown> | undefined)?.slow).toBeDefined();
    expect(byId.toxicammo?.effects?.damageDebuff).toBeDefined(); // Chemical -Damage
    expect(byId.fireammo?.damage).toBeDefined(); // Incendiary DoT is damage

    // Standard rounds are the DEFAULT variant: the entry exists to NAME the
    // cleared stance (payload-less — its payload IS the power's base), and the
    // base keeps the -Def rather than moving it into a conditional.
    expect(byId.lethalammo).toBeDefined();
    expect(byId.lethalammo?.defaultActive).toBe(true);
    expect(byId.lethalammo?.effects).toBeUndefined();
    expect(byId.lethalammo?.damage).toBeUndefined();
    expect(pistols!.effects?.defenseDebuff).toBeDefined();

    // The wire states the same fact: the standard secondary's atoms negate all
    // three ammo modes, so a gate-honouring reader drops them while one is live.
    const negated = (pistols!.atoms ?? []).filter((a) => {
      const gate = JSON.stringify(a);
      return gate.includes('kIceAmmo') && gate.includes('"!"');
    });
    expect(negated.length).toBeGreaterThan(0);
  });

  it('keeps core (non-ammo) effects like knockback in base, not in an ammo conditional', () => {
    const ps = getPowerset('blaster/dual-pistols');
    const empty = ps?.powers.find((p) => p.internalName === 'Empty_Clips');
    expect(empty?.effects?.knockback).toBeDefined();
    const lethal = (empty?.conditionalEffects ?? []).find((c) => c.id === 'lethalammo');
    // lethalammo is payload-less; the attack's knockback stays in base.
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
