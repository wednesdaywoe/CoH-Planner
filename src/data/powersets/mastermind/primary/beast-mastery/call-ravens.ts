/**
 * Call Ravens
 * Ranged (Cone), Moderate DoT(Lethal), Foe -Speed, -Defense, -Fly
 *
 * Source: mastermind_summon/beast_mastery/call_locusts.json
 */

import type { Power } from '@/types';

export const CallRavens: Power = {
  "name": "Call Ravens",
  "internalName": "Call_Locusts",
  "available": 7,
  "description": "You command an unkindness of ravens to quickly assault and harass your foes. Your foes will suffer Moderate Lethal damage over time and have their speed and defense reduced. This power has a high chance at granting your pets a stack of Pack Mentality.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Moderate DoT(Lethal), Foe -Speed, -Defense, -Fly",
  "icon": "beastmastery_calllocusts.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.155,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 14,
    "endurance": 16.9,
    "castTime": 2.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.3036,
    "table": "Ranged_Damage",
    "duration": 3.1,
    "tickRate": 0.75
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
