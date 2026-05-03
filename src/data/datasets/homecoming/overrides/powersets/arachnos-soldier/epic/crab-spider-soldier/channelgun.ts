/**
 * Channelgun — OVERRIDES LAYER
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
  "description": "Your Crab Spider backpack is equipped with a powerful energy Channelgun. This ranged attack deals moderate Energy damage and can reduce the target's Defense. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DMG(Energy), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "endurance": 8.12
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 1.16,
    "table": "Ranged_Damage"
  },
  "effects": {}
};
