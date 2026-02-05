/**
 * Ki Push
 * Melee, Light DMG(Smash), Foe Repel, KB
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
    "Accuracy",
    "Damage",
    "Recharge",
    "EnduranceReduction"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Universal Damage Sets",
    "Blaster Archetype Sets",
    "Knockback"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Melee_Damage"
  },
  "effects": {
    "damageBuff": {
      "scale": 0.055,
      "table": "Melee_Ones"
    },
    "effectDuration": 2,
    "hold": {
      "mag": 4,
      "scale": 2,
      "table": "Melee_Ones"
    },
    "knockback": {
      "mag": 8.31,
      "scale": 4
    },
    "repel": {
      "mag": 4,
      "scale": 2,
      "table": "Melee_Ones"
    }
  }
};
