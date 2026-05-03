/**
 * Omega Maneuver — OVERRIDES LAYER
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
    "range": 80,
    "endurance": 26,
    "castTime": 2.5,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Smashing",
      "scale": 2,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.5,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
