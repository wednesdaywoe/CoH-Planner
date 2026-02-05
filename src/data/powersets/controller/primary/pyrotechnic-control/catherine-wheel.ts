/**
 * Catherine Wheel
 * Summon Catherine Wheel: Ranged DMG (Fire, Energy), Special
 *
 * Source: controller_control/pyrotechnic_control/catherine_wheel.json
 */

import type { Power } from '@/types';

export const CatherineWheel: Power = {
  "name": "Catherine Wheel",
  "internalName": "Catherine_Wheel",
  "available": 25,
  "description": "You can craft a wheel of pure pyrotechnic energy to assist you in battle. The Catherine Wheel employs a variety of pyrotechnic powers to damage and distract enemies. If an enemy becomes affected by the Blast Off effect from one of your powers, the Catherine Wheel may Intercept the enemy with an attack, dealing additional damage.",
  "shortHelp": "Summon Catherine Wheel: Ranged DMG (Fire, Energy), Special",
  "icon": "pyrotechnic_catherinewheel.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 240,
    "endurance": 26,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_CatherineWheel_Controller"
    }
  }
};
