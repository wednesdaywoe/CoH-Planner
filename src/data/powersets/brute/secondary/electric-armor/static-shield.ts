/**
 * Static Shield
 * Toggle: Self +Res(Hold, Sleep, Disorient, End Drain, Recovery DeBuff, Psionic, Toxic, Teleport)
 *
 * Source: brute_defense/electric_armor/static_shield.json
 */

import type { Power } from '@/types';

export const StaticShield: Power = {
  "name": "Static Shield",
  "internalName": "Static_Shield",
  "available": 9,
  "description": "You can create a field of Static Electricity around your body. This Static Shield protects you from Hold, Sleep, and Disorient effects as well as Endurance Drain, Recovery DeBuffs and enemy Teleportation. Static Shield can also help normalize your synaptic activity, granting you good resistance to Psionic Damage.",
  "shortHelp": "Toggle: Self +Res(Hold, Sleep, Disorient, End Drain, Recovery DeBuff, Psionic, Toxic, Teleport)",
  "icon": "electricarmor_selfresistmez.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 4,
    "endurance": 0.104,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "enduranceGain": {
      "scale": 3,
      "table": "Melee_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 3,
      "table": "Melee_Res_Boolean"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "resistance": {
      "psionic": {
        "scale": 3.5,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "effectDuration": 0.75
  }
};
