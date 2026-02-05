/**
 * Shatter
 * Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF
 *
 * Source: sentinel_ranged/seismic_blast/shatter.json
 */

import type { Power } from '@/types';

export const Shatter: Power = {
  "name": "Shatter",
  "internalName": "Shatter",
  "available": 0,
  "description": "Cover a foe in stone shards and shatter them, inflicting light damage and lowering their defense. They will also become heavy, limiting their ability to jump and fly for a short time. Shatter grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
  "icon": "seismicblast_encase.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 7,
    "endurance": 7.696,
    "castTime": 1.33
  },
  "allowedEnhancements": [
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.48,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "movement": {
      "jumpSpeed": {
        "scale": 1,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 1,
        "table": "Ranged_Slow"
      }
    }
  }
};
