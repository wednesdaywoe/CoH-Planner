/**
 * Call Hawk
 * Ranged, Foe DoT (Lethal), -To Hit, Knockdown, -Fly
 *
 * Source: dominator_assault/savage_assault/call_hawk.json
 */

import type { Power } from '@/types';

export const CallHawk: Power = {
  "name": "Call Hawk",
  "internalName": "Call_Hawk",
  "available": 27,
  "description": "You call forth a hawk ally to swoop in and viciously peck at your target causing High Lethal damage. The attack often catches foes off their guard and can knock them down as well as reducing their chance to hit. This power's damage over time effect will scale with the number of stacks of Blood Frenzy. Using this power with 5 stacks of Blood Frenzy causes you to become Exhausted for a short time, but the duration of its damage over time effect is increased. While exhausted you cannot gain Blood Frenzy.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Ranged, Foe DoT (Lethal), -To Hit, Knockdown, -Fly",
  "icon": "savagemelee_callhawk.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 14,
    "endurance": 10.9702,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.52,
      "table": "Ranged_Damage",
      "duration": 1.3,
      "tickRate": 0.3
    },
    {
      "type": "Lethal",
      "scale": 0.2429,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    },
    {
      "type": "Lethal",
      "scale": 0.2543,
      "table": "Ranged_Damage",
      "duration": 5.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    }
  }
};
