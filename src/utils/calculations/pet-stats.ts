/**
 * A summoned pet's own character stats.
 *
 * A summon is a second character, not an effect (COH-DATA-MODEL §6): it has its
 * own hit points, its own resistance ceiling, its own movement. Those numbers
 * live on the PET's class row — `Class_Minion_Pets`, `Class_Henchman_Boss`,
 * `Class_LT_PraetorianGrunt_Pet` — and never on the caster's archetype. A
 * Bruiser's 90% resistance cap is not its Mastermind's 75%, and its 963 HP is
 * not the Mastermind's 803.
 *
 * The class row is extracted alongside the modifier tables (`extract-at-tables`)
 * and read here through the active dataset, so these follow the loaded fork.
 *
 * ## The level you pass is the PET's level, not the caster's
 *
 * Every number here is indexed by the level the pet is standing at. That is a
 * separate question from the character's level: a summon's level is encoded on
 * its `Create_Entity` template as `scale × table` — `*_Level` (caster level),
 * `*_Levelminus` (caster − 1), `*_Levelminus2` (caster − 2). See COH-DATA-MODEL
 * §6. That rule is not yet applied anywhere in the app, so today's callers pass
 * the caster's level, which reads one or two levels high for the pets that sit
 * below it. This module deliberately takes the level as a parameter rather than
 * deriving it, so it needs no change when the rule lands.
 */

import { PET_TABLES } from '@/data/at-tables';
import { getPetEntity } from '@/data/pet-entities';
import type { PetClassAttribs, PetMovementAttrib } from '@/data/dataset';

/** A pet's stats resolved at one level. */
export interface PetBaseStats {
  characterClass: string;
  /** The level these were resolved at — the PET's level (see module note). */
  level: number;
  /** Base max HP before any +MaxHP the pet's own powers grant. */
  hitPoints: number;
  hpCap?: number;
  absorbCap?: number;
  /** Damage-resistance ceiling as a fraction (0.9 = 90%). */
  resistanceCap?: number;
  /** Damage strength ceiling as a multiplier (4 = +300%). */
  damageCap?: number;
  baseThreat?: number;
  /** Bounds on NET recharge strength. Pet classes ship `{floor: 1, cap: 1}` —
   *  a pet's recharge cannot be buffed OR debuffed at all, which is why slotted
   *  recharge copied onto a pet does nothing to its attack cadence. */
  rechargeBounds?: { floor: number; cap: number };
  enduranceBounds?: { floor: number; cap: number };
  /** Movement multipliers against the player base (run 1.0). Pets run 1.5. */
  movement?: {
    runSpeed?: number;
    flySpeed?: number;
    jumpSpeed?: number;
    jumpHeight?: number;
  };
  movementCaps?: {
    runSpeed?: number;
    flySpeed?: number;
    jumpSpeed?: number;
    jumpHeight?: number;
  };
}

/** Level 1 = index 0, clamped to the array (HP arrays run to 50, pets can
 *  stand above it on an incarnate shift). */
function atLevel(values: number[] | undefined, level: number): number | undefined {
  if (!values || values.length === 0) return undefined;
  const index = Math.max(0, Math.min(values.length - 1, Math.round(level) - 1));
  return values[index];
}

function axis(attrib: PetMovementAttrib | undefined, key: keyof PetMovementAttrib, level: number) {
  const v = attrib?.[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? atLevel(v, level) : v;
}

function movementAt(attrib: PetMovementAttrib | undefined, level: number) {
  if (!attrib) return undefined;
  const out = {
    runSpeed: axis(attrib, 'run_speed', level),
    flySpeed: axis(attrib, 'fly_speed', level),
    jumpSpeed: axis(attrib, 'jump_speed', level),
    jumpHeight: axis(attrib, 'jump_height', level),
  };
  return Object.values(out).some((v) => v !== undefined) ? out : undefined;
}

function bounds(floor: number | undefined, cap: number | undefined) {
  return typeof floor === 'number' && typeof cap === 'number' ? { floor, cap } : undefined;
}

/** The raw class row, or null when the active dataset didn't export one. */
export function getPetClassAttribs(characterClass: string): PetClassAttribs | null {
  return PET_TABLES[characterClass]?.attribs ?? null;
}

/**
 * Resolve a pet class's stats at a level.
 *
 * Returns null rather than a zeroed stat block when the class has no attribs —
 * a missing class must read as "we don't know", not as a pet with no hit points.
 * That failure was live until 2026-07-30: the extractor's pet-class allowlist
 * named only Homecoming's spellings, so on Rebirth and Thunderspy every
 * Mastermind henchman and every Lore pet resolved against no class row at all.
 */
export function getPetClassStats(characterClass: string, level: number): PetBaseStats | null {
  const attribs = getPetClassAttribs(characterClass);
  if (!attribs) return null;

  const hitPoints = atLevel(attribs.hitPoints, level);
  if (hitPoints === undefined) return null;

  return {
    characterClass,
    level,
    hitPoints,
    hpCap: atLevel(attribs.hpCap, level),
    absorbCap: atLevel(attribs.absorbCap, level),
    resistanceCap: attribs.resistanceCap,
    damageCap: attribs.damageCap,
    baseThreat: attribs.baseThreat,
    rechargeBounds: bounds(attribs.rechargeFloor, attribs.rechargeCap),
    enduranceBounds: bounds(attribs.enduranceFloor, attribs.enduranceCap),
    movement: movementAt(attribs.movementBase, level),
    movementCaps: movementAt(attribs.movementCap, level),
  };
}

/**
 * Resolve a summoned entity's stats at a level, by entity name
 * (`'MastermindPets_Thug_Boss'`, `'Pets_Singularity'`, …).
 */
export function getPetBaseStats(entityName: string, level: number): PetBaseStats | null {
  const entity = getPetEntity(entityName);
  if (!entity) return null;
  return getPetClassStats(entity.characterClass, level);
}
