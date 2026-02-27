/**
 * Geode
 * Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold
 *
 * Source: sentinel_defense/stone_armor/geode.json
 */

import type { Power } from '@/types';

export const Geode: Power = {
  "name": "Geode",
  "internalName": "Geode",
  "available": 29,
  "description": "When you activate this power, you encase yourself in various protective mineral layers that can absorb incoming damage while you heal and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot stay in this Geode for more than 30 seconds. If enemies inflict enough damage, they can break you out of this effect.If Brimstone Armor is owned, this power will also grant Geothermal Power every 5 seconds, increasing the damage inflicted by Brimstone's Fire by 8% per stack.Recharge: Long.",
  "shortHelp": "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
  "icon": "stonearmor_geode.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 180,
    "endurance": 0.026,
    "castTime": 0.07
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 7.5,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 3,
      "table": "Melee_Ones"
    },
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "slow": {
      "fly": {
        "scale": 10000,
        "table": "Melee_Ones"
      }
    },
    "untouchable": {
      "scale": 1000,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 999,
      "table": "Melee_Ones"
    },
    "taunt": {
      "scale": 999,
      "table": "Melee_Ones"
    },
    "summon": {
      "isPseudoPet": false,
      "displayName": "Geode",
      "powers": [
        "Redirects.Stone_Armor.Geode",
        "Redirects.Stone_Armor.Geode_Scaling"
      ]
    }
  }
};
