/**
 * Seismic Mallet
 * Melee, Superior DMG(Smashing), Knockback, Hold
 *
 * Source: stalker_melee/stone_melee/heavy_mallet.json
 */

import type { Power } from '@/types';

export const SeismicMallet: Power = {
  "name": "Seismic Mallet",
  "internalName": "Heavy_Mallet",
  "available": 17,
  "description": "A more impressive form of Stone Mallet, the Seismic Mallet deals more damage, but is slower to swing. It has a greater chance of knocking down opponents, in addition to a chance for hold.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee, Superior DMG(Smashing), Knockback, Hold",
  "icon": "stonemelee_heavymallet.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.63
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Holds",
    "Knockback",
    "Melee Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.92,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Melee_Immobilize"
    }
  }
};
