/**
 * Encase
 * Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF
 *
 * Source: sentinel_ranged/seismic_blast/encase.json
 */

import type { Power } from '@/types';

export const Encase: Power = {
  "name": "Encase",
  "internalName": "Encase",
  "available": 0,
  "description": "Encase a foe in stone for a short moment, dealing damage and lowering their defense. The enemy will also become heavy, limiting their ability to jump and fly for a short time. Encase grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
  "icon": "seismicblast_shatter.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
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
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
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
