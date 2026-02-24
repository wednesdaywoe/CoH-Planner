/**
 * Cloudburst
 * Ranged, DoT(Cold), +Wet, Special
 *
 * Source: corruptor_ranged/storm_blast/cloudburst.json
 */

import type { Power } from '@/types';

export const Cloudburst: Power = {
  "name": "Cloudburst",
  "internalName": "Cloudburst",
  "available": 21,
  "description": "Unleashes a cloud that drops a torrent of freezing rain on your target, causing Cold damage. While in a Storm Cell, targets experience Recharge, ToHit, and Movement speed debuffs.",
  "shortHelp": "Ranged, DoT(Cold), +Wet, Special",
  "icon": "stormblast_cloudburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Slow",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "Slow Movement",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.2275,
    "table": "Ranged_Damage",
    "duration": 2.9,
    "tickRate": 0.3
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "tohitDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
