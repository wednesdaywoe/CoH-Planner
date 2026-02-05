/**
 * Entomb
 * Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF
 *
 * Source: sentinel_ranged/seismic_blast/entomb.json
 */

import type { Power } from '@/types';

export const Entomb: Power = {
  "name": "Entomb",
  "internalName": "Entomb",
  "available": 5,
  "description": "Entomb foes in a giant boulder, dealing high damage and lowering their defense. They will also become heavy, limiting their ability to jump and fly for a short time. Entomb grants two stacks of Seismic Pressure.",
  "shortHelp": "Ranged, DMG(Smash), Foe -Jump, -Fly, -DEF",
  "icon": "seismicblast_entomb.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 2.07
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
    "scale": 2.12,
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
