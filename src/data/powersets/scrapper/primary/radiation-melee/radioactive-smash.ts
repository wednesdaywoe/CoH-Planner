/**
 * Radioactive Smash
 * Melee, DMG(Energy/Smash), Foe -Def, Knockdown, Special
 *
 * Source: scrapper_melee/radiation_melee/radioactive_smash.json
 */

import type { Power } from '@/types';

export const RadioactiveSmash: Power = {
  "name": "Radioactive Smash",
  "internalName": "Radioactive_Smash",
  "available": 0,
  "description": "You channel a greater amount of radiation into your fists and deliver a hard hitting blow that deals Moderate Energy and Smashing damage to the target as well as reducing their Defense for a short time. Affected targets also have a chance to be knocked down and have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe -Def, Knockdown, Special",
  "icon": "radiationmelee_radioactivesmash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 7,
    "endurance": 7.696,
    "castTime": 1.5
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
    "Defense Debuff",
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.37,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.11,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.666,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.37,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.11,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.37,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1.11,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.5,
      "table": "Melee_Debuff_Def"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
