import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { PET_ENTITIES } from '@/data/pet-entities';
import { calculatePetDamage } from '@/utils/calculations/pet-damage';
import {
  EFFECT_DISPLAY,
  formatPetEffect,
  formatPetEffectValue,
  partitionPetEffects,
  petEffectColor,
  petEffectLabel,
  petEffectSubtypes,
} from './petEffectDisplay';

/**
 * What a pet's effect list says to a player.
 *
 * The bar is not "renders something" — the broken version rendered something.
 * It printed `SelfResistance 0.21`: an internal discriminator and a bare
 * scale × table product, with the damage types it covered thrown away. Three
 * separate failures are gated here:
 *
 *  1. VOCABULARY — every effect type a converter emits must have a display
 *     entry. A type without one falls through to its own internal name, and
 *     nothing errors. This is the same shape as the AT-table allowlist gap:
 *     the omission is invisible because the fallback is silent.
 *
 *  2. IDENTITY — two effects of the same type are two effects. A Soldier
 *     carries Mag 4 Placate protection AND Mag 2 Confuse protection; keying an
 *     aggregated list on `type` alone kept the first and dropped the rest.
 *
 *  3. SIGN — a negative self-resistance is a vulnerability. The converter
 *     preserves the sign on purpose ("abs()ing it would turn a weakness into a
 *     strength"); the calc layer then abs()ed it, so Dark Servant's −20% Energy
 *     read as +20%.
 */

const DATASETS = ['homecoming', 'rebirth', 'thunderspy'] as const;

describe.each(DATASETS)('pet effect display (%s)', (datasetId) => {
  beforeAll(async () => {
    await loadDataset(datasetId);
  });

  it('has player-facing vocabulary for every effect type any pet emits', () => {
    const unnamed = new Map<string, string>();
    for (const [name, entity] of Object.entries(PET_ENTITIES)) {
      const abilities = [
        ...entity.abilities,
        ...(entity.upgradeTiers ?? []).flatMap((t) => t.abilities),
      ];
      for (const ability of abilities) {
        for (const eff of ability.effects ?? []) {
          if (!EFFECT_DISPLAY[eff.type] && !unnamed.has(eff.type)) unnamed.set(eff.type, name);
        }
      }
    }
    expect(
      [...unnamed].map(([type, where]) => `${type} (e.g. ${where})`),
      'effect types with no display entry — these render as their internal name',
    ).toEqual([]);
  });

  it('never leaks an internal type name into a rendered line', () => {
    // `SelfResistance`, `SelfMezProtection` and friends are the converter's
    // discriminators, not words. Sweep every entity rather than a sample — a
    // type with no display entry is by definition one nobody thought to check.
    const bad: string[] = [];
    for (const name of Object.keys(PET_ENTITIES)) {
      const result = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, 2);
      if (!result) continue;
      for (const eff of result.allEffects) {
        if (/Self[A-Z]/.test(petEffectLabel(eff))) {
          bad.push(`${name}: ${formatPetEffect(eff)}`);
        }
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });

  it('gives every self stat a unit', () => {
    // The pet's own stats are all percentages or magnitudes, so a rendered value
    // must always say which — "0.21" was the original complaint and it is not
    // fixed by relabelling alone. Knockback and endurance drain are deliberately
    // NOT in scope: their magnitudes are genuinely unitless in the game's own UI.
    const bad: string[] = [];
    for (const name of Object.keys(PET_ENTITIES)) {
      const result = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, 2);
      if (!result) continue;
      for (const eff of partitionPetEffects(result.allEffects).self) {
        const value = formatPetEffectValue(eff);
        if (!/%$|^Mag |^Immune$|^—$/.test(value)) {
          bad.push(`${name}: ${formatPetEffect(eff)}`);
        }
      }
    }
    expect(bad.slice(0, 20)).toEqual([]);
  });

  it('keeps two effects of the same type apart when they cover different things', () => {
    // The discriminator is the sub-type list, so an aggregated list that keys on
    // type alone silently loses the second of every pair. Checked corpus-wide:
    // any ability carrying two same-type effects with different sub-types must
    // still show two rows.
    const lost: string[] = [];
    for (const [name, entity] of Object.entries(PET_ENTITIES)) {
      const abilities = [
        ...entity.abilities,
        ...(entity.upgradeTiers ?? []).flatMap((t) => t.abilities),
      ];
      const expectedKeys = new Set<string>();
      for (const ability of abilities) {
        for (const eff of ability.effects ?? []) expectedKeys.add(petEffectLabel(eff));
      }
      if (expectedKeys.size === 0) continue;
      const result = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, 2);
      if (!result) continue;
      const shown = new Set(result.allEffects.map((e) => petEffectLabel(e)));
      for (const key of expectedKeys) {
        if (!shown.has(key)) lost.push(`${name}: ${key}`);
      }
    }
    expect(lost.slice(0, 20)).toEqual([]);
  });

  it('files a pet\'s own stats separately from what it applies to others', () => {
    for (const name of Object.keys(PET_ENTITIES)) {
      const result = calculatePetDamage(name, 50, 1, undefined, 0, false, 0, 2);
      if (!result) continue;
      const { self, applied } = partitionPetEffects(result.allEffects);
      expect(self.length + applied.length).toBe(result.allEffects.length);
      expect(self.every((e) => e.type.startsWith('Self'))).toBe(true);
      expect(applied.some((e) => e.type.startsWith('Self'))).toBe(false);
    }
  });
});

describe('pet effect display — anchored (homecoming)', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  const linesFor = (entityName: string) => {
    const result = calculatePetDamage(entityName, 50, 1, undefined, 0, false, 0, 2);
    expect(result, entityName).toBeTruthy();
    return partitionPetEffects(result!.allEffects);
  };

  it('shows both of the Soldier\'s mez protections and both of its defenses', () => {
    // The two pairs the type-keyed map used to collapse. Mag 2 Confuse and +3.7%
    // AoE were the discarded halves — no error, no warning, just absent.
    const lines = linesFor('MastermindPets_Soldier').self.map(formatPetEffect);
    expect(lines).toContain('Protection (Placate) Mag 4');
    expect(lines).toContain('Protection (Confuse) Mag 2');
    expect(lines).toContain('Defense (Ranged) +6.2%');
    expect(lines).toContain('Defense (AoE) +3.7%');
    expect(lines).toContain('Resist (Smash/Leth) +26%');
  });

  it('renders a vulnerability as negative, not as armour', () => {
    // Dark Servant genuinely takes 20% MORE energy damage. Under the old
    // abs()-then-key-by-type path it showed one row, "SelfResistance 0.30" —
    // the resistance kept, the vulnerability both unsigned and dropped.
    const self = linesFor('Pets_DarkServant').self;
    const energy = self.find((e) => e.type === 'SelfResistance' && e.resistanceTypes?.includes('energy'));
    expect(energy, 'energy resistance row').toBeTruthy();
    expect(energy!.value).toBeLessThan(0);
    expect(formatPetEffect(energy!)).toBe('Resist (Eng) −20%');
    expect(petEffectColor(energy!)).toBe('text-red-400');

    const negative = self.find((e) => e.type === 'SelfResistance' && e.resistanceTypes?.includes('negative'));
    expect(formatPetEffect(negative!)).toBe('Resist (Neg) +30%');
    expect(petEffectColor(negative!)).not.toBe('text-red-400');
  });

  it('keeps a Creeper Vine\'s five separate vulnerabilities apart', () => {
    // Six resistance templates at six different scales on one pet — the case
    // where type-keying loses the most.
    const lines = linesFor('Pets_Creeper_Vine').self.map(formatPetEffect);
    expect(lines).toContain('Resist (Smash) −1.0%');
    expect(lines).toContain('Resist (Leth/Fire) −4.0%');
    expect(lines).toContain('Resist (Psi/Tox) +4.0%');
  });

  it('collapses a full-coverage list and names an immunity as one', () => {
    const applied = linesFor('Pets_Traps_FF_Generator').applied.map(formatPetEffect);
    // All 11 defense vectors — spelled out it was a 60-character wall.
    expect(applied).toContain('+Defense (All) 10%');

    const self = linesFor('Pets_Traps_FF_Generator').self.map(formatPetEffect);
    // Mez resistance shortens the mez; at 100% it is already gone. The
    // untauntable marker is a literal 10000%, which reads as a bug.
    expect(self).toContain('Mez Resist (Taunt) Immune');
  });

  it('formats each family in its own units', () => {
    expect(formatPetEffectValue({ type: 'SelfResistance', value: 0.26 })).toBe('+26%');
    expect(formatPetEffectValue({ type: 'SelfResistance', value: -0.2 })).toBe('−20%');
    expect(formatPetEffectValue({ type: 'SelfDefense', value: 0.062 })).toBe('+6.2%');
    expect(formatPetEffectValue({ type: 'SelfMezProtection', value: 4 })).toBe('Mag 4');
    expect(formatPetEffectValue({ type: 'SelfMezProtection', value: 4.5 })).toBe('Mag 4.5');
    expect(formatPetEffectValue({ type: 'SelfMezResistance', value: 0.5 })).toBe('50%');
    expect(formatPetEffectValue({ type: 'ToHitDebuff', value: 0.3 })).toBe('30%');
  });

  it('names the sub-types a number is about', () => {
    expect(petEffectSubtypes({ type: 'SelfResistance', resistanceTypes: ['smashing', 'lethal'] })).toBe('Smash/Leth');
    expect(petEffectSubtypes({
      type: 'SelfResistance',
      resistanceTypes: ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic'],
    })).toBe('All');
    expect(petEffectSubtypes({ type: 'SelfDefense', defenseTypes: ['melee', 'ranged', 'aoe'] })).toBe('All Positions');
    // Scalar effects carry no sub-types and must not grow an empty "()".
    expect(petEffectSubtypes({ type: 'Taunt' })).toBe('');
    expect(petEffectLabel({ type: 'Taunt' })).toBe('Taunt');
  });
});
