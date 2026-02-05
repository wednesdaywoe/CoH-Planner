/**
 * Fire Sword
 * Melee, Moderate DMG(Fire), -Defense
 *
 * Source: blaster_support/fire_manipulation/fire_sword.json
 */

import type { Power } from '@/types';

export const FireSword: Power = {
  "name": "Fire Sword",
  "internalName": "Fire_Sword",
  "available": 0,
  "description": "Through concentration, you can create a Sword of Fire that sets foes ablaze. Successful attacks from the Fire Sword will cut through your target defenses and ignite them, dealing damage over time.",
  "shortHelp": "Melee, Moderate DMG(Fire), -Defense",
  "icon": "firemanipulation_firesword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.33
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
  "damage": [
    {
      "type": "Fire",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 0.75
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0.088,
      "table": "Melee_Ones"
    }
  }
};
