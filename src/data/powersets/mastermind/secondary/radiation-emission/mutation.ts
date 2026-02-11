/**
 * Mutation
 * Close, Ally Rez, Special
 *
 * Source: mastermind_buff/radiation_emission/mutation.json
 */

import type { Power } from '@/types';

export const Mutation: Power = {
  "name": "Mutation",
  "internalName": "Mutation",
  "available": 15,
  "description": "Using a concentrated burst of radiation, you can revive a fallen ally and Mutate them into a killing machine. The Mutated target has increased damage, chance to hit, Endurance recovery, and attack speed and is protected from XP Debt for 90 seconds. The entire experience is very taxing on your ally, and they will soon be severely weakened. All effects of the Mutation will eventually wear off.Recharge: Long.",
  "shortHelp": "Close, Ally Rez, Special",
  "icon": "radiationpoisoning_mutation.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 120,
    "endurance": 6.5,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 1,
    "table": "Ranged_Ones",
    "duration": 0.5,
    "tickRate": 1
  },
  "effects": {
    "enduranceGain": {
      "scale": 1,
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
