/**
 * Conduit of Pain
 * Ally Rez, Self +DMG, +Recharge, +Recovery, +To Hit, +Special
 *
 * Source: mastermind_buff/pain_domination/conduit_of_pain.json
 */

import type { Power } from '@/types';

export const ConduitofPain: Power = {
  "name": "Conduit of Pain",
  "internalName": "Conduit_of_Pain",
  "available": 9,
  "description": "You revive a fallen ally by becoming a Conduit of Pain and transferring the pain that was inflicted upon them back upon your enemies. This will briefly empower you increasing your damage output, recovery rate, attack rate and chance to hit. After a minute the effect will wear off leaving you weakened for 30 seconds. Your damage, attack rate and chance to hit will all be reduced during this period.Recharge: Long.",
  "shortHelp": "Ally Rez, Self +DMG, +Recharge, +Recovery, +To Hit, +Special",
  "icon": "paindomination_conduitofpain.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "recharge": 180,
    "endurance": 32.5,
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
    "scale": 4,
    "table": "Ranged_Ones",
    "duration": 0.5,
    "tickRate": 1
  },
  "effects": {
    "enduranceGain": {
      "scale": 4,
      "table": "Ranged_Ones"
    },
    "recoveryBuff": {
      "scale": 1.75,
      "table": "Ranged_Ones"
    },
    "rechargeBuff": {
      "scale": 0.75,
      "table": "Ranged_Ones"
    },
    "damageBuff": {
      "scale": 3,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 2,
      "table": "Ranged_Buff_ToHit"
    },
    "damageDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Dam"
    },
    "tohitDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
