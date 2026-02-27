/**
 * Sonic Thrust
 * Melee, DMG(Energy/Smash), Foe Knockdown, -Res(Debuffs)
 *
 * Source: brute_melee/sonic_melee/sonic_thrust.json
 */

import type { Power } from '@/types';

export const SonicThrust: Power = {
  "name": "Sonic Thrust",
  "internalName": "Sonic_Thrust",
  "available": 0,
  "description": "A focused attack of intense sonic power with high chance to violently knock a nearby foe off their feet. Deals minimal damage, but can be very effective. This power will inflict a strong additional damage over time effect for 25 seconds against Attuned targets.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Knockdown, -Res(Debuffs)",
  "icon": "sonicmanipulation_sonicthrust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 2.5,
    "endurance": 3.952,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.76,
    "table": "Melee_Damage"
  },
  "effects": {
    "elusivity": {
      "all": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      }
    },
    "enduranceDrain": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "tohitDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "flySpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      },
      "jumpSpeed": {
        "scale": 0.8,
        "table": "Melee_Debuff_Res_Dmg"
      }
    },
    "regenDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "recoveryDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "rechargeDebuff": {
      "scale": 0.8,
      "table": "Melee_Debuff_Res_Dmg"
    },
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
