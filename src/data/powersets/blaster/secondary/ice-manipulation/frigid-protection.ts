/**
 * Frigid Protection
 * Toggle: PBAoE, Foe -Recharge, -Speed, -DMG, Self +Absorb over Time, +Recovery
 *
 * Source: blaster_support/ice_manipulation/chilling_embrace.json
 */

import type { Power } from '@/types';

export const FrigidProtection: Power = {
  "name": "Frigid Protection",
  "internalName": "Chilling_Embrace",
  "available": 9,
  "description": "While active, you dramatically lower the temperature around yourself, Slowing the attack rate of all nearby foes, as well as their movement speed and damage. The air around your body becomes so cold that attacks deflect off of it, granting you absorption, while your body becomes extremely energy efficient, granting you bonus Recovery.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Foe -Recharge, -Speed, -DMG, Self +Absorb over Time, +Recovery",
  "icon": "icemanipulation_chillingembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 30,
    "recharge": 10,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Dam"
    }
  }
};
