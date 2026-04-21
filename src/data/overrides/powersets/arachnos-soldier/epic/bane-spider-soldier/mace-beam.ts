/**
 * Mace Beam — OVERRIDES LAYER
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
  "description": "The Nullifier Mace has several different ranged attack modes. The Mace Beam is a moderate damage single target attack with a chance to knock a foe off their feet. Damage: Moderate",
  "shortHelp": "Ranged, Moderate DMG(Smash/Energy), Foe Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "endurance": 9.24
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 1.32,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.75,
      "table": "Ranged_Knockback"
    }
  }
};
