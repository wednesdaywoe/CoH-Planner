/**
 * Sting of the Wasp
 * Melee, High DMG(Lethal), Foe -Def
 *
 * Source: blaster_support/ninja_training/sting_of_the_wasp.json
 */

import type { Power } from '@/types';

export const StingoftheWasp: Power = {
  "name": "Sting of the Wasp",
  "internalName": "Sting_of_the_Wasp",
  "available": 0,
  "description": "You perform a standard attack with your Ninja Blade. Sting of the Wasp can reduce a target's Defense, making them easier to hit.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Lethal), Foe -Def",
  "icon": "ninjatools_katanalight.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 6.03,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.96,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
