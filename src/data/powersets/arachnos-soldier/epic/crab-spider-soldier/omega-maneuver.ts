/**
 * Omega Maneuver
 * Ranged(Location AoE), Extreme DMG(Smash/Energy), Foe Disorient
 */

import type { Power } from '@/types';

export const OmegaManeuver: Power = {
  "name": "Omega Maneuver",
  "available": 25,
  "description": "You launch a devastating Omega Maneuver from your Crab Spider backpack. A powerful explosive is fired at a targeted location, detonating with extreme force dealing extreme Smashing and Energy damage. Foes struck may be disoriented. Recharge: Very Long",
  "shortHelp": "Ranged(Location AoE), Extreme DMG(Smash/Energy), Foe Disorient",
  "icon": "crabspider_omegamaneuver.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
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
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 240,
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
  ]
};
