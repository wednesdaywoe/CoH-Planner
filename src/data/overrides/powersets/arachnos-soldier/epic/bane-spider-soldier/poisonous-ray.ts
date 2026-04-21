/**
 * Poisonous Ray — OVERRIDES LAYER
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
  "description": "You fire a poisonous ray from your Nullifier Mace causing toxic damage over time as well as reducing the target's Defense. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DoT(Toxic), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 10.192
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Toxic",
    "scale": 0.3,
    "table": "Ranged_Damage",
    "duration": 4.1,
    "tickRate": 1
  },
  "effects": {}
};
