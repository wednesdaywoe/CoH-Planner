/**
 * Call Hawk
 * Ranged, Moderate DMG(Lethal), Foe -To Hit, Knockdown, -Fly
 *
 * Source: mastermind_summon/beast_mastery/call_hawk.json
 */

import type { Power } from '@/types';

export const CallHawk: Power = {
  "name": "Call Hawk",
  "internalName": "Call_Hawk",
  "available": 1,
  "description": "You call forth a hawk ally to swoop in and viciously peck at your target causing High Lethal damage. The attack often catches foes off their guard and can knock them down as well as reducing their chance to hit. This power has a good chance at granting your pets a stack of Pack Mentality.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DMG(Lethal), Foe -To Hit, Knockdown, -Fly",
  "icon": "beastmastery_callhawk.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 6,
    "endurance": 9.62,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Knockback",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.3256,
    "table": "Ranged_Damage",
    "duration": 1.3,
    "tickRate": 0.3
  },
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
