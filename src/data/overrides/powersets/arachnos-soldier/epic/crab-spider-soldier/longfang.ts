/**
 * Longfang — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. Each field below is a value the previously-committed
 * composed file carried that the current CoD2-raw extraction does not.
 * Keep them — the CoD2 archive we convert from is a snapshot, and these
 * overrides are where current HC values live when they've drifted from
 * that snapshot. See src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "Your Crab Spider backpack is equipped with a powerful Longfang cannon. This ranged attack deals superior Lethal damage and can reduce the target's Defense. Damage: Superior",
  "shortHelp": "Ranged, Superior DMG(Lethal), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "endurance": 13.72
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 2.76,
    "table": "Ranged_Damage"
  },
  "effects": {}
};
