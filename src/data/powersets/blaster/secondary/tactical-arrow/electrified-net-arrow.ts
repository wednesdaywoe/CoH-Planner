/**
 * Electrified Net Arrow
 * Ranged, DoT(Energy), Foe Immobilize, -Fly, -Recharge, -SPD, -Jump
 *
 * Source: blaster_support/tactical_arrow/electrified_net_arrow.json
 */

import type { Power } from '@/types';

export const ElectrifiedNetArrow: Power = {
  "name": "Electrified Net Arrow",
  "internalName": "Electrified_Net_Arrow",
  "available": 0,
  "description": "Upon impact, the Electrified Net Arrow releases an electrically charged net that can Immobilize most targets. This device deals electric damage over time but does not prevent targets from attacking. The Electrified Net Arrow can bring down flying entities, halts jumping and slows all of their actions.Damage: Moderate.Recharge: Fast.",
  "shortHelp": "Ranged, DoT(Energy), Foe Immobilize, -Fly, -Recharge, -SPD, -Jump",
  "icon": "tacticalarrow_immobilize.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
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
    "type": "Energy",
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
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      },
      "jumpHeight": {
        "scale": 500,
        "table": "Ranged_Ones"
      },
      "fly": {
        "scale": 10,
        "table": "Ranged_Ones"
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
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Ranged_Slow"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
