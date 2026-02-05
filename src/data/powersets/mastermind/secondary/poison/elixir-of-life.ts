/**
 * Elixir of Life
 * Close, Ally Rez, Special
 *
 * Source: mastermind_buff/poison/elixir_of_life.json
 */

import type { Power } from '@/types';

export const ElixirofLife: Power = {
  "name": "Elixir of Life",
  "internalName": "Elixir_of_Life",
  "available": 15,
  "description": "With this Elixir, you can revive a fallen ally and turn him into a killing machine. The revived target has increased damage, chance to hit, Endurance recovery, and attack speed, and gains a resistance to Toxic damage. A brew of this sort is not without its side effects. The revived target will soon become very sick and severely weak after about 90 seconds. All effects of the Elixir will eventually wear off. Elixir of Life can only be used on Players and cannot be used on your Henchmen.Recharge: Long.",
  "shortHelp": "Close, Ally Rez, Special",
  "icon": "poison_elixiroflife.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "recharge": 180,
    "endurance": 32.5,
    "castTime": 1.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Resist Damage"
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
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 1000,
      "table": "Ranged_Ones"
    },
    "effectDuration": 4,
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
