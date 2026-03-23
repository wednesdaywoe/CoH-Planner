/**
 * Death Shroud
 * Toggle: PBAoE Minor DoT(Negative)
 *
 * Source: tanker_defense/dark_armor/death_shroud.json
 */

import type { Power } from '@/types';

export const DeathShroud: Power = {
  "name": "Death Shroud",
  "internalName": "Death_Shroud",
  "available": 0,
  "description": "You become a focus point for the Netherworld, allowing its Negative Energy to seep from your body. This will continuously damage all foes in melee range.Damage: Minor(DoT).Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE Minor DoT(Negative)",
  "icon": "darkarmor_touchofdeath.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 4,
    "endurance": 1.04,
    "castTime": 2.47,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
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
    "type": "Negative",
    "scale": 0.1571,
    "table": "Melee_Damage"
  }
};
