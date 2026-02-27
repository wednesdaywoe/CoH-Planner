/**
 * Ki Push
 * Melee, Light DMG(Smash), Foe Repel, KB
 *
 * Source: blaster_support/martial_manipulation/ki_push.json
 */

import type { Power } from '@/types';

export const KiPush: Power = {
  "name": "Ki Push",
  "internalName": "Ki_Push",
  "available": 0,
  "description": "You smash your foe with a burst of Ki Energy, sending them flying through the air in slow motion.Damage: Light.Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Smash), Foe Repel, KB",
  "icon": "martialmanipulation_kipush.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "repel": {
      "scale": 4,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 4,
      "table": "Melee_Ones"
    },
    "effectDuration": 2,
    "knockback": {
      "scale": 4,
      "table": "Melee_Knockback"
    },
    "damageBuff": {
      "scale": 0.055,
      "table": "Melee_Ones"
    }
  }
};
