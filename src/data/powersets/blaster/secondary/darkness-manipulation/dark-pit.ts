/**
 * Dark Pit
 * Ranged (Targeted AoE), Foe Disorient
 *
 * Source: blaster_support/darkness_manipulation/dark_pit.json
 */

import type { Power } from '@/types';

export const DarkPit: Power = {
  "name": "Dark Pit",
  "internalName": "Dark_Pit",
  "available": 27,
  "description": "Envelops a targeted foe and any nearby enemies in a pit of Negative Energy. The attack deals no damage, but Disorients all affected foes for a good while.",
  "shortHelp": "Ranged (Targeted AoE), Foe Disorient",
  "icon": "darknessmanipulation_darkpit.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 20,
    "recharge": 90,
    "endurance": 20.18,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Stuns"
  ],
  "maxSlots": 6,
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 8,
      "table": "Ranged_Stun"
    },
    "damageBuff": {
      "scale": 0.018,
      "table": "Ranged_Ones"
    }
  }
};
