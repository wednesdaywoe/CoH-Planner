/**
 * Charged Bolts
 * Ranged, DMG(Energy), Foe -End
 *
 * Source: corruptor_ranged/electrical_blast/charged_bolts.json
 */

import type { Power } from '@/types';

export const ChargedBolts: Power = {
  "name": "Charged Bolts",
  "internalName": "Charged_Bolts",
  "available": 0,
  "description": "You can quickly hurl small bolts of electricity at foes, dealing some damage and draining some Endurance. Some of this Endurance may transfer back to you. Charged Bolts deals light damage but recharges quickly.",
  "shortHelp": "Ranged, DMG(Energy), Foe -End",
  "icon": "electricalbolt_chargedbolts.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
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
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Ranged_EndDrain"
    }
  }
};
