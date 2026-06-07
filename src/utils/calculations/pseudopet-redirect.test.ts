import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { calculateResolvedPseudoPetDamage } from './pet-damage';
import { StormCell } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/storm-blast/storm-cell';
import { CategoryFive } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/storm-blast/category-five';
import type { ResolvedPseudoPet } from '@/types/power';

/**
 * Pseudo-pet redirect resolution (Storm Cell / Category Five).
 *
 * These location powers deliver all damage + debuffs through a pseudo-pet that
 * runs a list of redirect powers (summon.powers). The converter resolves those
 * into summon.resolvedEntities; the runtime computes damage off the SUMMONER's
 * archetype table (not a fixed pet class). Numbers below are anchored to the
 * in-game tooltip for a level-1 Blaster (verified 2026-06-06):
 *   - Storm Cell lightning: 5.12 energy / tick   (0.5 × Ranged_Damage(blaster,1))
 *   - Category Five storm:  0.08 cold, 0.82 smashing / tick
 *   - Category Five Eye:    5.12 energy / tick (lightning)
 */
describe('pseudo-pet redirect resolution', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  // Guaranteed damage lands in result.abilities (counts toward the headline DoT).
  const dmgType = (
    entity: ResolvedPseudoPet, abilityName: string, type: string,
  ): number | undefined => {
    const r = calculateResolvedPseudoPetDamage(entity, 'blaster', 1);
    const ab = r?.abilities.find(a => a.ability.name === abilityName);
    return ab?.damageByType.find(d => d.type === type)?.base;
  };

  // Conditional (storm-gated / proc) damage is surfaced as an informational
  // effect ("<type> Dmg") and kept OUT of result.abilities / the DPS total.
  const condDmg = (entity: ResolvedPseudoPet, type: string) => {
    const r = calculateResolvedPseudoPetDamage(entity, 'blaster', 1);
    return r?.allEffects.find(e => e.type === `${type} Dmg`);
  };

  describe('Storm Cell', () => {
    const summon = StormCell.effects!.summon!;
    const pets = summon.resolvedEntities!;

    it('resolves a single pseudo-pet (60s) with Tempest + Lightning', () => {
      expect(pets).toHaveLength(1);
      expect(pets[0].duration).toBe(60);
      const names = pets[0].abilities.map(a => a.name);
      expect(names).toContain('StormCell_Tempest');
      expect(names).toContain('Lightning_Proc');
    });

    it('Tempest carries the -recharge and -tohit debuffs, both IgnoreStrength', () => {
      const tempest = pets[0].abilities.find(a => a.name === 'StormCell_Tempest')!;
      const slow = tempest.effects!.find(e => e.type === 'Slow')!;
      const tohit = tempest.effects!.find(e => e.type === 'ToHitDebuff')!;
      expect(slow).toMatchObject({ scale: 0.07, table: 'Melee_Slow', ignoreStrength: true });
      expect(tohit).toMatchObject({ scale: 0.7, table: 'Ranged_Debuff_ToHit', ignoreStrength: true });
    });

    it('lightning is mode-gated (storm-strength), shown conditionally not summed', () => {
      const lightning = pets[0].abilities.find(a => a.name === 'Lightning_Proc')!;
      expect(lightning.conditionalDamage).toBe(true); // chance:0 = "while High Winds active"
      expect(lightning.damageChance).toBeUndefined(); // no computable rate
      // Kept out of the headline DoT…
      expect(dmgType(pets[0], 'Lightning_Proc', 'Energy')).toBeUndefined();
      // …surfaced as a conditional effect at the verified 5.12/tick (lvl 1, full).
      expect(condDmg(pets[0], 'Energy')?.value).toBeCloseTo(5.12, 1);
    });

    it('does not double-count the storm-powered-up Energy copy', () => {
      const lightning = pets[0].abilities.find(a => a.name === 'Lightning_Proc')!;
      expect(lightning.damage.filter(d => d.damageType === 'Energy')).toHaveLength(1);
    });

    it('surfaces the lightning Stun at its 33% proc chance (from the lightning pet)', () => {
      const lightning = pets[0].abilities.find(a => a.name === 'Lightning_Proc')!;
      const stun = lightning.effects!.find(e => e.type === 'Stun')!;
      expect(stun.chance).toBeCloseTo(0.33, 2);
      expect(stun).toMatchObject({ scale: 4, table: 'Ranged_Stun', magnitude: 3 });
    });

    it('Storm Cell exposes no guaranteed headline damage (it is a debuff field)', () => {
      const r = calculateResolvedPseudoPetDamage(pets[0], 'blaster', 1);
      expect(r?.abilities ?? []).toHaveLength(0);
    });
  });

  describe('Category Five', () => {
    const summon = CategoryFive.effects!.summon!;
    const pets = summon.resolvedEntities!;

    it('resolves TWO pseudo-pets — the 20s storm and the 17s Eye (collapse fix)', () => {
      expect(pets).toHaveLength(2);
      expect(pets.map(p => p.duration).sort()).toEqual([17, 20]);
    });

    it('storm ticks 0.08 cold + 0.82 smashing at level 1 (guaranteed DoT)', () => {
      const storm = pets.find(p => p.duration === 20)!;
      expect(dmgType(storm, 'Category_Five', 'Cold')).toBeCloseTo(0.08, 2);
      expect(dmgType(storm, 'Category_Five', 'Smashing')).toBeCloseTo(0.82, 2);
    });

    it('Eye lightning is a 25% proc — counted at EXPECTED value (chance × per-hit)', () => {
      const eye = pets.find(p => p.duration === 17)!;
      const lightning = eye.abilities.find(a => a.name === 'Category_Five_Lightning')!;
      expect(lightning.conditionalDamage).toBeUndefined(); // not mode-gated — it's a proc
      expect(lightning.damageChance).toBeCloseTo(0.25, 2);
      // Counted in the headline DoT at expected value: 5.12/tick × 0.25 ≈ 1.28 (lvl 1).
      expect(dmgType(eye, 'Category_Five_Lightning', 'Energy')).toBeCloseTo(5.12 * 0.25, 1);
    });

    it('Eye carries the mag-50 Fear (IgnoreStrength)', () => {
      const eye = pets.find(p => p.duration === 17)!;
      const fear = eye.abilities.flatMap(a => a.effects ?? []).find(e => e.type === 'Fear');
      expect(fear).toMatchObject({ magnitude: 50, ignoreStrength: true });
    });

    it('Eye lightning Stun uses the PvE table (Ranged_Stun×4), not PvP', () => {
      const eye = pets.find(p => p.duration === 17)!;
      const stun = eye.abilities.flatMap(a => a.effects ?? []).find(e => e.type === 'Stun')!;
      expect(stun).toMatchObject({ scale: 4, table: 'Ranged_Stun', magnitude: 3 });
    });
  });
});
