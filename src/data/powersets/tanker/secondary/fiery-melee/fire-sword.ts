/**
 * Fire Sword
 * Melee, DMG(Fire), -Defense
 *
 * Source: tanker_melee/fiery_melee/fire_sword.json
 */

import type { Power } from '@/types';

export const FireSword: Power = {
  "name": "Fire Sword",
  "internalName": "Fire_Sword",
  "available": 0,
  "description": "Through concentration, you can create a Sword of Fire that sets foes ablaze. Successful attacks from the Fire Sword will cut through your target defenses and ignite them, dealing damage over time.",
  "shortHelp": "Melee, DMG(Fire), -Defense",
  "icon": "fieryfray_firesword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
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
    "Defense Debuff",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Melee_Debuff_Def"
    }
  }
};
