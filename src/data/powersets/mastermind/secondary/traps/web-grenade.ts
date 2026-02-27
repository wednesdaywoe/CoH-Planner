/**
 * Web Grenade
 * Ranged, Target Immobilize, -Recharge, -Fly
 *
 * Source: mastermind_buff/traps/web_grenade.json
 */

import type { Power } from '@/types';

export const WebGrenade: Power = {
  "name": "Web Grenade",
  "internalName": "Web_Grenade",
  "available": 0,
  "description": "Upon impact, the Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize most targets. This non-lethal device deals no damage and does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.Recharge: Fast.",
  "shortHelp": "Ranged, Target Immobilize, -Recharge, -Fly",
  "icon": "traps_targetedimmoblize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 4,
    "endurance": 9.75,
    "castTime": 1.37
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Immobilize",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "slow": {
      "jumpHeight": {
        "scale": 500,
        "table": "Ranged_Ones"
      },
      "fly": {
        "scale": 10,
        "table": "Ranged_Ones"
      }
    },
    "rechargeDebuff": {
      "scale": 0.5,
      "table": "Ranged_Slow"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.5,
        "table": "Ranged_Slow"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    }
  }
};
