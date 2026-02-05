/**
 * Explosive Bouquet
 * Ranged (AoE), Foe Hold, Blast Off
 *
 * Source: controller_control/pyrotechnic_control/explosive_bouquet.json
 */

import type { Power } from '@/types';

export const ExplosiveBouquet: Power = {
  "name": "Explosive Bouquet",
  "internalName": "Explosive_Bouquet",
  "available": 21,
  "description": "You create an explosion of light and sound in a flower formation. Foes inside the blast radius will be Held and Blasted Off into the air.Notes: This power has adaptive recharge. It has a base recharge of 8 seconds and each affected foe will increase the recharge by 14.5 seconds for a maximum total of 240 seconds.",
  "shortHelp": "Ranged (AoE), Foe Hold, Blast Off",
  "icon": "pyrotechnic_explosivebouquet.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "radius": 20,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 2.93,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Immobilize"
    }
  }
};
