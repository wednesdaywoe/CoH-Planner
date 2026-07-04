import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { synthesizePseudoPetEffects } from './pet-damage';
import type { SummonEffect } from '@/types/power';

/**
 * Pseudo-pet enhanceable-effect unify.
 *
 * Location / patch powers (Glue Arrow, etc.) deliver their enhanceable debuffs
 * through a non-commandable pseudo-pet, carrying nothing on the parent power.
 * `synthesizePseudoPetEffects` lifts those debuffs into a PowerEffects fragment
 * so the parent's Power Effects block can scale them by the summoner's
 * enhancements (the pet inherits them via CopyBoosts). Only ENHANCEABLE scalar
 * debuffs are surfaced — convert-pet-entities already drops the binary's
 * IgnoreStrength templates (-Recharge / -Fly / -Jump for Glue Arrow), so they
 * never reach the pet's ability list and must not appear here.
 */
describe('synthesizePseudoPetEffects', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('lifts Glue Arrow pseudo-pet Slow into the parent effects (enhanceable)', () => {
    const summon: SummonEffect = { isPseudoPet: false, entity: 'Pets_StickyArrow_Blaster', duration: 30 };
    const out = synthesizePseudoPetEffects(summon);
    expect(out).not.toBeNull();
    expect(out!.slow).toEqual({ scale: 0.72, table: 'Melee_Slow' });
  });

  it('does not surface IgnoreStrength debuffs (-Recharge / -Fly / -Jump)', () => {
    const summon: SummonEffect = { isPseudoPet: false, entity: 'Pets_StickyArrow_Blaster' };
    const out = synthesizePseudoPetEffects(summon);
    // Only the enhanceable Slow — never rechargeDebuff or movement slows, which
    // carry IgnoreStrength and are filtered from the pet's abilities upstream.
    expect(Object.keys(out ?? {})).toEqual(['slow']);
  });

  it('lifts a location AoE hold (Shadow Field) into the parent effects as a MezEffect', () => {
    // Shadow Field applies ALL its control through Pets_Shadow_Field_Controller,
    // so the hold must be hoisted for it to appear in Power Effects at all.
    const summon: SummonEffect = { isPseudoPet: false, entity: 'Pets_Shadow_Field_Controller', duration: 45, copyBoosts: true };
    const out = synthesizePseudoPetEffects(summon);
    expect(out).not.toBeNull();
    // The guaranteed pulse (mag 3, scale 8) wins over the aura's 5% proc.
    expect(out!.hold).toEqual({ mag: 3, scale: 8, table: 'Melee_Ones' });
    // The pet's ToHitDebuff still surfaces alongside the hold.
    expect(out!.tohitDebuff).toEqual({ scale: 1.5, table: 'Melee_DeBuff_ToHit' });
  });

  it('does not surface a low-chance mez proc as a guaranteed hold', () => {
    // Shadow Field's aura carries a 5%-chance mag-3 hold; only the guaranteed
    // Shadow_Field_Hold_Controller pulse (scale 8, not 4) should be chosen.
    const out = synthesizePseudoPetEffects({ isPseudoPet: false, entity: 'Pets_Shadow_Field_Controller' });
    expect(out!.hold).toMatchObject({ scale: 8 });
    expect((out!.hold as { scale: number }).scale).not.toBe(4);
  });

  it('returns null for commandable pets (real summons keep their Summons block)', () => {
    const summon: SummonEffect = { isPseudoPet: false, entity: 'MastermindPets_Assault_Bot' };
    expect(synthesizePseudoPetEffects(summon)).toBeNull();
  });

  it('returns null when there is no summon', () => {
    expect(synthesizePseudoPetEffects(undefined)).toBeNull();
  });
});
