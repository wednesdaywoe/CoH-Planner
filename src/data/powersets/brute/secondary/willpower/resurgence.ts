/**
 * Resurgence
 * Self Rez, Special
 *
 * Source: brute_defense/willpower/resurgence.json
 */

import type { Power } from '@/types';

export const Resurgence: Power = {
  "name": "Resurgence",
  "internalName": "Resurgence",
  "available": 27,
  "description": "Should you fall in battle, you can Revive yourself from the brink of death. You will revive with most of your Hit Points and half your Endurance and be protected from XP Debt for 20 seconds. Additionally, for 90 seconds, your damage, attack rate, endurance recovery and chance to hit will be improved, then for another 45 seconds, your damage and chance to hit will be diminished. You will also have 15 seconds of immunity to most damage.Recharge: Very Long.",
  "shortHelp": "Self Rez, Special",
  "icon": "willpower_resurgence.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 300,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 0.8,
    "table": "Ranged_Ones",
    "duration": 0.5,
    "tickRate": 1
  },
  "effects": {
    "enduranceGain": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    },
    "recoveryBuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    },
    "rechargeBuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 4,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 3,
      "table": "Ranged_Buff_ToHit"
    },
    "damageDebuff": {
      "scale": 4,
      "table": "Ranged_Debuff_Dam"
    },
    "tohitDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
