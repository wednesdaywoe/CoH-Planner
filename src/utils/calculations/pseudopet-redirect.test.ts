import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { calculateResolvedPseudoPetDamage, calculatePetDamage } from './pet-damage';
import { getPetEntity } from '@/data/pet-entities';
import { StormCell } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/storm-blast/storm-cell';
import { CategoryFive } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/storm-blast/category-five';
import { TarPatch } from '@/data/datasets/homecoming/generated/powersets/defender/primary/dark-miasma/tar-patch';
import { Meteor } from '@/data/datasets/homecoming/generated/powersets/blaster/primary/seismic-blast/meteor';
import { Sleet } from '@/data/datasets/homecoming/generated/powersets/defender/primary/cold-domination/sleet';
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

    it('Tempest carries -recharge, -speed, -tohit (all IgnoreStrength); recharge split from speed', () => {
      const tempest = pets[0].abilities.find(a => a.name === 'StormCell_Tempest')!;
      const rech = tempest.effects!.find(e => e.type === 'RechargeDebuff')!;
      const slow = tempest.effects!.find(e => e.type === 'Slow')!;
      const tohit = tempest.effects!.find(e => e.type === 'ToHitDebuff')!;
      expect(rech).toMatchObject({ scale: 0.07, ignoreStrength: true });
      expect(slow).toMatchObject({ scale: 0.14, ignoreStrength: true }); // movement, distinct from -rech
      expect(tohit).toMatchObject({ scale: 0.7, table: 'Ranged_Debuff_ToHit', ignoreStrength: true });
    });

    it('Tempest carries the empowered WindSpeed values (~2x) for the High Winds toggle', () => {
      const tempest = pets[0].abilities.find(a => a.name === 'StormCell_Tempest')!;
      const pu = tempest.poweredUpEffects!;
      expect(pu.find(e => e.type === 'RechargeDebuff')!.scale).toBeCloseTo(0.14, 3);
      expect(pu.find(e => e.type === 'Slow')!.scale).toBeCloseTo(0.28, 3);
      expect(pu.find(e => e.type === 'ToHitDebuff')!.scale).toBeCloseTo(1.4, 3);
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

    it('flags mode-gated lightning effects conditional, but not the always-on Tempest debuffs', () => {
      const tempest = pets[0].abilities.find(a => a.name === 'StormCell_Tempest')!;
      const lightning = pets[0].abilities.find(a => a.name === 'Lightning_Proc')!;
      // Tempest (-rech/-tohit) is always on while the cell exists.
      expect(tempest.effects!.every(e => !e.conditional)).toBe(true);
      // Lightning effects only apply "while High Winds active".
      expect(lightning.effects!.every(e => e.conditional)).toBe(true);
    });

    it('Storm Cell exposes no guaranteed headline damage (it is a debuff field)', () => {
      const r = calculateResolvedPseudoPetDamage(pets[0], 'blaster', 1);
      expect(r?.abilities ?? []).toHaveLength(0);
    });

    it('powered up (High Winds): lightning folds into DPS, Tempest shows WindSpeed, nothing flagged conditional', () => {
      const off = calculateResolvedPseudoPetDamage(pets[0], 'blaster', 50)!;
      const on = calculateResolvedPseudoPetDamage(pets[0], 'blaster', 50, 0, false, 0, true)!;
      // Off: no guaranteed damage (lightning is conditional). On: lightning counts.
      expect(off.totalDpsBase).toBe(0);
      expect(on.totalDpsBase).toBeGreaterThan(0);
      // On: Tempest debuffs show the empowered WindSpeed values (~2× the base).
      const rechOff = off.allEffects.find(e => e.type === 'RechargeDebuff')!.value!;
      const rechOn = on.allEffects.find(e => e.type === 'RechargeDebuff')!.value!;
      expect(rechOn).toBeCloseTo(rechOff * 2, 1);
      // Off flags conditional content; On shows everything active.
      expect(off.allEffects.some(e => e.conditional)).toBe(true);
      expect(on.allEffects.every(e => !e.conditional)).toBe(true);
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

  describe('Tar Patch (typed resistance debuff capture)', () => {
    it('captures the -resistance debuff (all-types template at aspect=Resistance)', () => {
      const pets = TarPatch.effects!.summon!.resolvedEntities!;
      const effs = pets.flatMap(p => p.abilities).flatMap(a => a.effects ?? []);
      const res = effs.find(e => e.type === 'ResistanceDebuff');
      expect(res).toBeDefined();
      expect(res!.table).toMatch(/Res_Dmg/i);
      // and it still carries the Slow (it's a -res AND -speed patch)
      expect(effs.some(e => e.type === 'Slow')).toBe(true);
    });
  });

  describe('named shells (Meteor — nested Create_Entity hop)', () => {
    it('resolves damage one Create_Entity hop deep (the spawned MeteorHit)', () => {
      const pets = Meteor.effects!.summon!.resolvedEntities!;
      const dmg = pets.flatMap(p => p.abilities).flatMap(a => a.damage);
      const types = new Set(dmg.map(d => d.damageType));
      expect(types.has('Fire')).toBe(true);
      expect(types.has('Smashing')).toBe(true);
    });
  });

  describe('un-prefixed priority_list (Sleet → Pets_Sleet fallback)', () => {
    it("getPetEntity tolerates the bare name and finds the Pets_-prefixed entity", () => {
      expect(getPetEntity('Sleet')?.name).toBe('Pets_Sleet');
    });
    it('Sleet summon resolves to the real pet so its damage/effects surface', () => {
      const summon = Sleet.effects!.summon!;
      expect(summon.entity).toBe('Sleet'); // stays un-prefixed in data
      const r = calculatePetDamage(summon.entity!, 50, 1, summon.duration);
      expect(r).not.toBeNull();
      // Pets_Sleet carries Cold damage + Slow/-Def
      expect(r!.abilities.some(a => a.damageByType.some(d => d.type === 'Cold'))).toBe(true);
    });
  });
});
