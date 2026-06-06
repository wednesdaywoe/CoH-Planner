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

  it('returns null for commandable pets (real summons keep their Summons block)', () => {
    const summon: SummonEffect = { isPseudoPet: false, entity: 'MastermindPets_Assault_Bot' };
    expect(synthesizePseudoPetEffects(summon)).toBeNull();
  });

  it('returns null when there is no summon', () => {
    expect(synthesizePseudoPetEffects(undefined)).toBeNull();
  });
});
