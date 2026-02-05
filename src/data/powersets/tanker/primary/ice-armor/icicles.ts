/**
 * Icicles
 * Toggle: PBAoE, DoT(Cold)
 *
 * Source: tanker_defense/ice_armor/icicles.json
 */

import type { Power } from '@/types';

export const Icicles: Power = {
  "name": "Icicles",
  "internalName": "Icicles",
  "available": 11,
  "description": "While active, you form sharp icicles on your body that continuously cut all foes that attempt to enter melee range.",
  "shortHelp": "Toggle: PBAoE, DoT(Cold)",
  "icon": "icearmor_icicles.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 4,
    "endurance": 1.04,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.1571,
    "table": "Melee_Damage"
  }
};
