/**
 * Shatter — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. The generated layer is now sourced from the live HC
 * binary (exported_powers/), so the legacy numeric pins that used to live
 * here were stale CoD2 values and have been retired (2026-06 override audit).
 * Any remaining entries are display fixes or planner-only enrichments the
 * parser doesn't emit yet — prefer fixing the parser/converter over re-adding
 * an override. See GAME-DATA-PRINCIPLES.md §13 and src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal extreme damage and can knock foes back a great ways. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: Extreme",
  "shortHelp": "Melee, Extreme DMG(Smash), Minor DoT(Toxic), Foe High Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ]
};
