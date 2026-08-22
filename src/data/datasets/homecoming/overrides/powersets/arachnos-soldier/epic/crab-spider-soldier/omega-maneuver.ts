/**
 * Omega Maneuver — OVERRIDES LAYER
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
  "description": "You launch a devastating Omega Maneuver from your Crab Spider backpack. A powerful explosive is fired at a targeted location, detonating with extreme force dealing extreme Smashing and Energy damage. Foes struck may be disoriented. Recharge: Very Long",
  "shortHelp": "Ranged(Location AoE), Extreme DMG(Smash/Energy), Foe Disorient",
  "effectArea": "AoE",
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Stun",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "stats": {
    "radius": 15,
    "maxTargets": 16
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
