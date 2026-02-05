/**
 * Mutation
 * Close, Ally Rez, Special
 *
 * Source: defender_buff/radiation_emission/mutation.json
 */

import type { Power } from '@/types';

export const Mutation: Power = {
  "name": "Mutation",
  "internalName": "Mutation",
  "available": 7,
  "description": "Using a concentrated burst of radiation, you can revive a fallen hero and Mutate them into a killing machine. The Mutated hero has increased damage, chance to hit, Endurance recovery, and attack speed and is protected from XP Debt fort 90 seconds. The entire experience is very taxing on the Mutated hero, and they will soon be severely weakened. All effects of the Mutation will eventually wear off.Recharge: Long.",
  "shortHelp": "Close, Ally Rez, Special",
  "icon": "radiationpoisoning_mutation.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "recharge": 180,
    "endurance": 26,
    "castTime": 3.2
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
