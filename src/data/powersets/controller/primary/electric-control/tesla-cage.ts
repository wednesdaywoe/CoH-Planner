/**
 * Tesla Cage
 * Ranged, DMG(Energy), Foe Hold, -End
 *
 * Source: controller_control/electric_control/tesla_cage.json
 */

import type { Power } from '@/types';

export const TeslaCage: Power = {
  "name": "Tesla Cage",
  "internalName": "Tesla_Cage",
  "available": 0,
  "description": "Tesla Cage confines the target in an electrical prison. The target is overwhelmed by the electrical charge and is left helpless and can be attacked. The target is drained of some Endurance and some of that Endurance may be transferred back to you.",
  "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
  "icon": "electriccontrol_teslacage.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Endurance Modification",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 3.43,
      "table": "Ranged_Ones"
    }
  }
};
