/**
 * Animate Stone
 * Summon Golem: Melee DMG(Smashing)
 *
 * Source: controller_control/earth_control/animate_stone.json
 */

import type { Power } from '@/types';

export const AnimateStone: Power = {
  "name": "Animate Stone",
  "internalName": "Animate_Stone",
  "available": 25,
  "description": "Earth and stone coalesce to form an incredibly tough entity that can attack your foes. The Animated Stone is not alive and is immune to Psionic damage. It is also virtually immune to Sleep, Immobilize, Disorient, and Hold effects. The entity can be healed and buffed like any teammate. Type ''/release_pets'' in the chat window to release all your pets.",
  "shortHelp": "Summon Golem: Melee DMG(Smashing)",
  "icon": "earthgrasp_animatestone.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 20.8,
    "castTime": 3.2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Stone_Controller"
    }
  }
};
