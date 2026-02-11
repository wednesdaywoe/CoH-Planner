/**
 * Greater Fire Sword
 * Melee, DMG(Fire)
 *
 * Source: tanker_melee/fiery_melee/greater_fire_sword.json
 */

import type { Power } from '@/types';

export const GreaterFireSword: Power = {
  "name": "Greater Fire Sword",
  "internalName": "Greater_Fire_Sword",
  "available": 29,
  "description": "Your mastery of fire allows you to create an enhanced Sword of Fire that can set foes ablaze and cut through their defenses. Successful attacks from the Greater Fire Sword will ignite your target, dealing damage over time.",
  "shortHelp": "Melee, DMG(Fire)",
  "icon": "fieryfray_greaterfiresword.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 12,
    "endurance": 12.688,
    "castTime": 1.37
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 2.44,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.2,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],

};
