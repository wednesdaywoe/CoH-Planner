/**
 * Entropy Shield
 * Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), +Rech
 *
 * Source: stalker_defense/energy_aura/entropy_shield.json
 */

import type { Power } from '@/types';

export const EntropyShield: Power = {
  "name": "Entropy Shield",
  "internalName": "Entropy_Shield",
  "available": 9,
  "description": "Entropy Shield diminishes and dampens the energy of controlling type effects. The shield makes you resistant to Knockback, Repel, Disorient, Hold, Sleep, Immobilization, and enemy Teleportation for as long as you can keep this toggle power active. Entropy Shield also grants you good resistance to Defense Debuffs. Additionally, this power grants the user a moderate recharge bonus while active and resistance to endurance drain effects.",
  "shortHelp": "Toggle: Self +Res(Knockback, Repel, Disorient, Hold, Sleep, Immobilize, Teleport, DeBuff DEF), +Rech",
  "icon": "energyaura_entropy.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.13,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "repel": {
      "scale": 100,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 0.75,
    "immobilize": {
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
    "teleport": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "elusivity": {
      "all": {
        "scale": 0.5,
        "table": "Melee_Res_Boolean"
      }
    },
    "enduranceGain": {
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
