/**
 * Toxic Web Grenade
 * Ranged, Moderate DoT(Toxic), Target Immobilize, -Recharge, -Fly
 *
 * Source: blaster_support/gadgets/web_grenade.json
 */

import type { Power } from '@/types';

export const ToxicWebGrenade: Power = {
  "name": "Toxic Web Grenade",
  "internalName": "Web_Grenade",
  "available": 0,
  "description": "Upon impact, the Toxic Web Grenade expels a strong, tenuous, and very sticky substance that can Immobilize and corrode most targets, dealing moderate Toxic damage. This device does not prevent targets from attacking, although their attack rate is Slowed. The Web can bring down flying entities and halts jumping.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DoT(Toxic), Target Immobilize, -Recharge, -Fly",
  "icon": "gadgets_webgrenade.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.37
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Toxic",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 8.2,
    "tickRate": 2
  },
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
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
