/**
 * Gravestone
 * Ranged, DMG(Smash), Foe -Jump, -Fly
 *
 * Source: sentinel_ranged/seismic_blast/gravestone.json
 */

import type { Power } from '@/types';

export const Gravestone: Power = {
  "name": "Gravestone",
  "internalName": "Gravestone",
  "available": 17,
  "description": "Create a giant pillar of stone, creating a Gravestone around your target, dealing extreme damage and limiting their ability to jump and fly for a short time.Gravestone grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged, DMG(Smash), Foe -Jump, -Fly",
  "icon": "seismicblast_gravestone.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 2.28,
    "table": "Ranged_Damage"
  },
  "effects": {
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
