/**
 * Havoc Punch
 * Melee, High DMG(Smash/Energy), Foe Sleep, -End, Knock Back
 *
 * Source: dominator_assault/electricity_manipulation/havok_punch.json
 */

import type { Power } from '@/types';

export const HavocPunch: Power = {
  "name": "Havoc Punch",
  "internalName": "Havok_Punch",
  "available": 9,
  "description": "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with greater damage and a chance to knock the target off their feet. Havoc Punch can drain some Endurance from your target and may overload its synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release him.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Smash/Energy), Foe Sleep, -End, Knock Back",
  "icon": "electricalassault_havocpunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Knockback",
    "Melee Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.5092,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.4508,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.1,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 3,
      "scale": 15,
      "table": "Melee_Sleep"
    },
    "knockback": {
      "scale": 0.75,
      "table": "Melee_Knockback"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
