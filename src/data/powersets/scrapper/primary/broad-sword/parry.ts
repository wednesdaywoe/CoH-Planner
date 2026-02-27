/**
 * Parry
 * Melee, DMG(Lethal), Self +DEF(Melee,Lethal)
 *
 * Source: scrapper_melee/broad_sword/parry.json
 */

import type { Power } from '@/types';

export const Parry: Power = {
  "name": "Parry",
  "internalName": "Parry",
  "available": 7,
  "description": "You can use this power to Parry incoming melee attacks. The Parry itself does minor damage, but every successful hit will increase your Defense against melee and lethal attacks for a short while.",
  "shortHelp": "Melee, DMG(Lethal), Self +DEF(Melee,Lethal)",
  "icon": "sword_parry.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Defense",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseBuff": {
      "melee": {
        "scale": 2,
        "table": "Melee_Buff_Def"
      },
      "lethal": {
        "scale": 2,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
