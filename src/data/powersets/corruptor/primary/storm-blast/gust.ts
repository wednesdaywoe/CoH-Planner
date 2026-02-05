/**
 * Gust
 * Ranged, DMG(Smash), -Fly
 *
 * Source: corruptor_ranged/storm_blast/gust.json
 */

import type { Power } from '@/types';

export const Gust: Power = {
  "name": "Gust",
  "internalName": "Gust",
  "available": 0,
  "description": "You create a chaotic change in atmospheric pressure, causing a sudden gust of wind to deliver a small amount of Smashing damage and knock your foe out of the sky. While in a Storm Cell, targets experience additional Smashing damage over time.",
  "shortHelp": "Ranged, DMG(Smash), -Fly",
  "icon": "stormblast_gust.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "slow": {
      "fly": {
        "scale": 2.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
