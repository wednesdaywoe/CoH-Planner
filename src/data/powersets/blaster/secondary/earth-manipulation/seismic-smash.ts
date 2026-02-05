/**
 * Seismic Smash
 * Melee, Extreme DMG(Smashing), Foe Hold
 *
 * Source: blaster_support/earth_manipulation/seismic_smash.json
 */

import type { Power } from '@/types';

export const SeismicSmash: Power = {
  "name": "Seismic Smash",
  "internalName": "Seismic_Smash",
  "available": 29,
  "description": "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage and may Hold the target if they are not defeated outright.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Smashing), Foe Hold",
  "icon": "earthmanip_seismicsmash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Holds",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 3.56,
    "table": "Melee_Damage"
  },
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Immobilize"
    }
  }
};
