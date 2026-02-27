/**
 * Voltaic Sentinel
 * Summon Sentinel: Ranged, Moderate DMG(Energy), Foe -End
 *
 * Source: dominator_assault/electricity_manipulation/shocking_grasp.json
 */

import type { Power } from '@/types';

export const VoltaicSentinel: Power = {
  "name": "Voltaic Sentinel",
  "internalName": "Shocking_Grasp",
  "available": 29,
  "description": "You can manifest a polarized electricity field that hovers above the ground and hurls bolts of electricity at nearby foes. Any enemy that passes near this Sentinel risks serious injury. The Sentinel is not alive and cannot be targeted or attacked by enemies. The Sentinel can fly and will follow you.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Summon Sentinel: Ranged, Moderate DMG(Energy), Foe -End",
  "icon": "electricalassault_voltaicsentinel.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 2,
    "range": 60,
    "recharge": 60,
    "endurance": 26,
    "castTime": 3.1
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
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
        "Pets.VoltaicSentinel_Dominator.Electrical_Bolt",
        "Pets.VoltaicSentinel_Dominator.Electrical_Field"
      ],
      "duration": 60
    }
  }
};
