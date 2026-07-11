/**
 * Buff-pet aura detection.
 *
 * A "buff-pet" is a summonable, non-commandable drone whose purpose is to
 * project a persistent AoE buff onto the caster and team — Traps' Force Field
 * Generator (+Defense), Marine's Barrier Reef (+Defense / Absorb), Traps' Triage
 * Beacon (+Regeneration), and the like. The buff lives on the pet entity's own
 * abilities (parsed by convert-pet-entities' extractBuffAura into `DefenseBuff` /
 * `ResistanceBuff` / `Absorb` / `RegenBuff` / `RecoveryBuff` / `ToHitBuff` /
 * `RechargeBuff` PetEffects), NOT on the summoning power itself.
 *
 * The character-totals engine walks only the player's own powers, so these auras
 * never reached the top-of-screen totals. This module is the shared detection
 * seam: the calc uses it to fold a buff-pet's aura into the totals (gated by an
 * opt-in per-pet toggle), and the info panel uses it to decide whether to show
 * that toggle and how to label it.
 *
 * Detection is intentionally broad (any player-summoned non-commandable pet with
 * an ally-buff aura) because the fold is OPT-IN and per-pet — nothing is added to
 * your totals until you flip the toggle, so surfacing the toggle on, say, a Lore
 * support pet that buffs your ToHit is a feature, not a surprise.
 */

import type { SummonEffect } from '@/types/power';
import { getPetEntity, type PetEffect } from '@/data/pet-entities';

/** mechanicAdjusters sub-id for a summon's "count this buff-pet's aura" toggle,
 *  keyed `${power.internalName}:${BUFF_PET_TOGGLE_ID}`. Off by default. */
export const BUFF_PET_TOGGLE_ID = 'buffpet';

/** PetEffect.type values that are ally buffs a buff-pet projects onto the team. */
export const BUFF_PET_AURA_TYPES: ReadonlySet<string> = new Set([
  'DefenseBuff',
  'ResistanceBuff',
  'Absorb',
  'RegenBuff',
  'RecoveryBuff',
  'ToHitBuff',
  'RechargeBuff',
]);

export function isBuffPetAuraEffect(effect: PetEffect): boolean {
  return BUFF_PET_AURA_TYPES.has(effect.type);
}

/** One summoned entity's buff-aura contribution. */
export interface BuffPetSource {
  /** PET_ENTITIES key. */
  entityName: string;
  /** Human-readable pet name (e.g. "Force Field Generator"). */
  displayName: string;
  /** The deduped ally-buff aura effects gathered across the entity's abilities. */
  auras: PetEffect[];
}

function auraKey(e: PetEffect): string {
  const sub = (e.defenseTypes ?? e.resistanceTypes ?? []).join(',');
  return `${e.type}|${e.scale ?? ''}|${e.table ?? ''}|${sub}`;
}

/**
 * Resolve the buff-pet aura sources of a summon effect — the non-commandable
 * summoned entities that project ally buffs. Returns `[]` when the summon isn't a
 * buff-pet (no such entity, or the entity is a commandable combat pet, or it has
 * no ally-buff auras), which callers treat as "not a buff-pet."
 */
export function getBuffPetSources(summon: SummonEffect | undefined): BuffPetSource[] {
  if (!summon) return [];

  const names = new Set<string>();
  if (summon.entity) names.add(summon.entity);
  for (const e of summon.entities ?? []) {
    if (e.entity) names.add(e.entity);
  }

  const sources: BuffPetSource[] = [];
  for (const name of names) {
    const entity = getPetEntity(name);
    // Commandable pets are the player's directable combat pets (Mastermind
    // henchmen, Gang War). A buff drone is uncommandable — the user's "floaty
    // buff pets whose only purpose is providing AoE buffs."
    if (!entity || entity.commandable) continue;

    const auras: PetEffect[] = [];
    const seen = new Set<string>();
    for (const ability of entity.abilities) {
      for (const eff of ability.effects ?? []) {
        if (!isBuffPetAuraEffect(eff)) continue;
        const key = auraKey(eff);
        if (seen.has(key)) continue;
        seen.add(key);
        auras.push(eff);
      }
    }
    if (auras.length > 0) {
      sources.push({ entityName: name, displayName: entity.displayName, auras });
    }
  }
  return sources;
}

/** True when a summon projects at least one ally-buff aura (i.e. is a buff-pet). */
export function summonIsBuffPet(summon: SummonEffect | undefined): boolean {
  return getBuffPetSources(summon).length > 0;
}
