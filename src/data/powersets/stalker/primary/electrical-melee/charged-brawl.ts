/**
 * Charged Brawl
 * Melee, DMG(Smash/Energy), Target Sleep, -End
 *
 * Source: stalker_melee/electrical_melee/charged_brawl.json
 */

import type { Power } from '@/types';

export const ChargedBrawl: Power = {
  "name": "Charged Brawl",
  "internalName": "Charged_Brawl",
  "available": 0,
  "description": "Your fists become electrically charged and deliver a powerful punch. Charged Brawl can drain some Endurance from the target and may overload their synapses, leaving them writhing for a moment. A portion of drained Endurance may be returned to you. Disturbing an overloaded target will disperse the electrical charge and release him.",
  "shortHelp": "Melee, DMG(Smash/Energy), Target Sleep, -End",
  "icon": "electricmelee_targetedminordmg.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
  },
  "allowedEnhancements": [
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.34,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Melee_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 2.184,
      "table": "Melee_Ones"
    }
  }
};
