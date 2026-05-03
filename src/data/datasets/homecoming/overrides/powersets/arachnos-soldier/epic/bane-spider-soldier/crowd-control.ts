/**
 * Crowd Control — OVERRIDES LAYER
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
  "description": "Swing your Nullifier Mace in a wide arc in front of you. This attack strikes all foes within melee range, deals them high damage and minor Toxic damage over time, and knocks them down. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: High",
  "shortHelp": "Melee(Cone), High DMG(Smash), Minor DoT(Toxic), Foe Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "arc": 120
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.1,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Knockback"
    }
  }
};
