/**
 * Spectral Wall
 * Ranged, DoT (Psionic), Foe Immobilize, -ToHit
 *
 * Source: dominator_control/illusion_control/spectral_wall.json
 */

import type { Power } from '@/types';

export const SpectralWall: Power = {
  "name": "Spectral Wall",
  "internalName": "Spectral_Wall",
  "available": 0,
  "description": "Creates an illusionary wall of specters that prevents enemies from moving. As the foe is surrounded, they take psionic damage over time.",
  "shortHelp": "Ranged, DoT (Psionic), Foe Immobilize, -ToHit",
  "icon": "illusions_immob.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 7.8,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.2,
    "table": "Ranged_Damage",
    "duration": 9.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 4,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
