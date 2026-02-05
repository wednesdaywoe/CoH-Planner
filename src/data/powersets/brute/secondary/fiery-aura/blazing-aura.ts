/**
 * Blazing Aura
 * Toggle: PBAoE, DoT (Fire)
 *
 * Source: brute_defense/fiery_aura/blazing_aura.json
 */

import type { Power } from '@/types';

export const BlazingAura: Power = {
  "name": "Blazing Aura",
  "internalName": "Blazing_Aura",
  "available": 0,
  "description": "While active, you are surrounded by flames that burn all foes that attempt to enter melee range.Damage: Minor(DoT).Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE, DoT (Fire)",
  "icon": "flamingshield_fieryaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 1.04,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.22,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.099,
      "table": "Melee_Damage"
    }
  ]
};
