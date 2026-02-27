/**
 * Seismic Smash
 * Melee, DMG(Smashing), Foe Hold
 *
 * Source: brute_melee/stone_melee/seismic_smash.json
 */

import type { Power } from '@/types';

export const SeismicSmash: Power = {
  "name": "Seismic Smash",
  "internalName": "Seismic_Smash",
  "available": 17,
  "description": "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage, and may Hold the target if they are not defeated outright.",
  "shortHelp": "Melee, DMG(Smashing), Foe Hold",
  "icon": "stonemelee_seismicsmash.png",
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
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Holds",
    "Melee Damage",
    "Threat Duration",
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
      "mag": 4,
      "scale": 8,
      "table": "Melee_Immobilize"
    }
  }
};
