/**
 * Dark Pit
 * Ranged (Targeted AoE), Foe Disorient
 *
 * Source: defender_ranged/dark_blast/dark_pit.json
 */

import type { Power } from '@/types';

export const DarkPit: Power = {
  "name": "Dark Pit",
  "internalName": "Dark_Pit",
  "available": 9,
  "description": "Envelops a targeted foe and any nearby enemies in a pit of Negative Energy. The attack deals no damage, but Disorients all affected foes for a good while.",
  "shortHelp": "Ranged (Targeted AoE), Foe Disorient",
  "icon": "darkcast_darkpit.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 70,
    "radius": 20,
    "recharge": 60,
    "endurance": 13,
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
    }
  }
};
