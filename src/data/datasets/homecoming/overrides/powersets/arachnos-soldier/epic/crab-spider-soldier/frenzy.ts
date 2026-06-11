/**
 * Frenzy — OVERRIDES LAYER
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
  "description": "Your Crab Spider backpack arms go into a frenzy, striking all nearby foes with a barrage of attacks dealing heavy Energy damage in an area around you. Can also reduce the targets' Defense. Damage: Heavy",
  "shortHelp": "Melee(PBAoE), Heavy DMG(Energy), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "range": 7
  },
  "targetType": "Foe (Alive)",
  "effects": {}
};
