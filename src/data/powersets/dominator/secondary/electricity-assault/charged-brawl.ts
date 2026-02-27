/**
 * Charged Brawl
 * Melee, Light DMG(Smash/Energy), Target Sleep, -End
 *
 * Source: dominator_assault/electricity_manipulation/charged_brawl.json
 */

import type { Power } from '@/types';

export const ChargedBrawl: Power = {
  "name": "Charged Brawl",
  "internalName": "Charged_Brawl",
  "available": 0,
  "description": "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving it writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release the target.Damage: Light.Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Smash/Energy), Target Sleep, -End",
  "icon": "electricalassault_chargedbrawl.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Melee Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.6732,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.6468,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Sleep"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 5.095,
      "table": "Melee_Ones"
    }
  }
};
