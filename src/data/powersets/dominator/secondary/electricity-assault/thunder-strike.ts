/**
 * Thunder Strike
 * Melee (AoE), Superior DMG(Smash, Energy), Foe Disorient, Knockback
 *
 * Source: dominator_assault/electricity_manipulation/power_sink.json
 */

import type { Power } from '@/types';

export const ThunderStrike: Power = {
  "name": "Thunder Strike",
  "internalName": "Power_Sink",
  "available": 27,
  "description": "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee (AoE), Superior DMG(Smash, Energy), Foe Disorient, Knockback",
  "icon": "electricalassault_thunderstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.53
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.044,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.876,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
