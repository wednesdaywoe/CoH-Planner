/**
 * Black Hole
 * Ranged (Targeted AoE), Foe Intangible
 *
 * Source: controller_buff/darkness_affinity/black_hole.json
 */

import type { Power } from '@/types';

export const BlackHole: Power = {
  "name": "Black Hole",
  "internalName": "Black_Hole",
  "available": 27,
  "description": "Opens up a Black Hole to the Netherworld that temporarily pulls in all foes within its grasp. Victims that are immune to the pull become phase shifted and are completely intangible. They are hard to see, and cannot affect or be affected by those in normal space.",
  "shortHelp": "Ranged (Targeted AoE), Foe Intangible",
  "icon": "darkmiasma_blackhole.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 20,
    "recharge": 120,
    "endurance": 13,
    "castTime": 1.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "maxSlots": 6,
  "effects": {
    "repel": {
      "scale": 1,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 3,
      "table": "Ranged_Ones"
    },
    "effectDuration": 30
  }
};
