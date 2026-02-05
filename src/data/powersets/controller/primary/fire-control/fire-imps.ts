/**
 * Fire Imps
 * Summon Imps: Melee Minor DMG(Fire)
 *
 * Source: controller_control/fire_control/fire_imps.json
 */

import type { Power } from '@/types';

export const FireImps: Power = {
  "name": "Fire Imps",
  "internalName": "Fire_Imps",
  "available": 25,
  "description": "You can craft 3 small Fire Imps out of pure flame in a targeted location. Fire Imps will viciously attack any nearby foes, but they only possess the most basic instincts. Fire Imps can be healed and buffed like any teammate. Type ''/release_pets'' in the chat window to release all your pets.",
  "shortHelp": "Summon Imps: Melee Minor DMG(Fire)",
  "icon": "firetrap_fireimps.png",
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
      "entity": "Pets_FireImp_Controller"
    }
  }
};
