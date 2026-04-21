/**
 * Suppression — OVERRIDES LAYER
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
  "description": "Your Crab Spider backpack unleashes a sustained barrage of energy in a wide cone in front of you, dealing moderate Energy damage over time to all foes hit. Can also reduce the targets' Defense. Damage: Moderate",
  "shortHelp": "Ranged(Cone), Moderate DoT(Energy), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "endurance": 20.44,
    "arc": 60
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 0.19,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 0.6
  },
  "effects": {}
};
