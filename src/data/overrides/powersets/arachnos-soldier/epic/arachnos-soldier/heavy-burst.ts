/**
 * Heavy Burst — OVERRIDES LAYER
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
  "description": "Fires a Heavy Burst of rounds at foes in a long cone in front of the user. Can also reduce the targets' defense. Damage: Moderate(DoT)",
  "shortHelp": "Ranged Cone, Moderate DMG(Lethal), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "arc": 0.5236
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 0.1557,
    "table": "Ranged_Damage",
    "duration": 2,
    "tickRate": 0.3
  },
  "effects": {}
};
