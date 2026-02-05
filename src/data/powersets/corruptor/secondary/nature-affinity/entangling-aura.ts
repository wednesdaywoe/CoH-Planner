/**
 * Entangling Aura
 * Toggle, Foe Hold
 *
 * Source: corruptor_buff/nature_affinity/raging_tempest.json
 */

import type { Power } from '@/types';

export const EntanglingAura: Power = {
  "name": "Entangling Aura",
  "internalName": "Raging_Tempest",
  "available": 27,
  "description": "While this power is active there is a high chance that entangling vines will grasp nearby foes and render them held for a short time.Recharge: Slow.",
  "shortHelp": "Toggle, Foe Hold",
  "icon": "natureaffinity_ragingtempest.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 1.3,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Holds"
  ],
  "maxSlots": 6,
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 4,
      "table": "Ranged_Ones"
    }
  }
};
