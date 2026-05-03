/**
 * Venom Grenade — OVERRIDES LAYER
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
  "description": "This poisonous grenade causes toxic damage over time and weakens the resistance of all foes within the area of effect. NOTE: If you take this power you cannot also take the Crab Spider version. Damage: Moderate",
  "shortHelp": "Ranged(Targeted AoE), DoT(Toxic), -Res(All)",
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Toxic",
    "scale": 0.1964,
    "table": "Ranged_Damage",
    "duration": 4.125,
    "tickRate": 1
  },
  "effects": {
    "resistanceDebuff": {
      "scale": -2,
      "table": "Ranged_Res_Dmg"
    }
  }
};
