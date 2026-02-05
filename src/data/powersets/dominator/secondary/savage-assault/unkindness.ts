/**
 * Unkindness
 * Ranged (Cone), DoT (Lethal), Foe -Speed, -Defense, -Fly, +2 Blood Frenzy
 *
 * Source: dominator_assault/savage_assault/call_ravens.json
 */

import type { Power } from '@/types';

export const Unkindness: Power = {
  "name": "Unkindness",
  "internalName": "Call_Ravens",
  "available": 9,
  "description": "With a mighty roar, you command an unkindness of ravens to quickly assault and harass your foes. Your foes will suffer Moderate Lethal damage over time and have their speed and defense reduced. The power inflicts lethal damage over time that scales in strength with the number Blood Frenzy stacks. This power grants 2 stacks of Blood Frenzy.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Cone), DoT (Lethal), Foe -Speed, -Defense, -Fly, +2 Blood Frenzy",
  "icon": "savagemelee_callravens.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.155,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 14,
    "endurance": 16.9,
    "castTime": 2,
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
    "scale": 0.241,
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
