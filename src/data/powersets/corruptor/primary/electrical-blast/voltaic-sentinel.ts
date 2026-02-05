/**
 * Voltaic Sentinel
 * Summon Sentinel: Ranged, Moderate DMG(Energy), Foe -End
 *
 * Source: corruptor_ranged/electrical_blast/voltaic_sentinel.json
 */

import type { Power } from '@/types';

export const VoltaicSentinel: Power = {
  "name": "Voltaic Sentinel",
  "internalName": "Voltaic_Sentinel",
  "available": 21,
  "description": "You can manifest a polarized electricity field that hovers above the ground and hurls bolts of electricity at nearby foes. Any enemy that passes near this Sentinel risks serious injury. The Sentinel is not alive and cannot be targeted or attacked by enemies. The Sentinel can fly and will follow you.",
  "shortHelp": "Summon Sentinel: Ranged, Moderate DMG(Energy), Foe -End",
  "icon": "electricalbolt_voltaicsentinal.png",
  "powerType": "Toggle",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 2,
    "range": 60,
    "recharge": 10,
    "endurance": 0.52,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Endurance Modification",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Voltaic Sentinel",
      "powers": [
        "Pets.ResistAll_NoFly.ResistAll",
        "Pets.VoltaicSentinel_PseudoPet.Electrical_Bolt",
        "Pets.VoltaicSentinel_PseudoPet.Electrical_Field"
      ]
    }
  }
};
