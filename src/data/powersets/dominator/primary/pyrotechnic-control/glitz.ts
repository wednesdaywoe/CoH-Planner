/**
 * Brilliant Barrage
 * Ranged (AoE), Foe Stun, Foe Terrorize, Minor DMG (Fire, Energy)
 *
 * Source: dominator_control/pyrotechnic_control/glitz.json
 */

import type { Power } from '@/types';

export const BrilliantBarrage: Power = {
  "name": "Brilliant Barrage",
  "internalName": "Glitz",
  "available": 11,
  "description": "With a single gesture, you conjure pyrotechnic missiles to assault two locations at once. First, select a target for the first missile and then a location for the second. Enemies near the target you have selected will be bombarded with miniature missiles and Stunned. Meanwhile, enemies near the location you have selected on the ground will be hit by a shrill noisemaking rocket and become Terrified.",
  "shortHelp": "Ranged (AoE), Foe Stun, Foe Terrorize, Minor DMG (Fire, Energy)",
  "icon": "pyrotechnic_multipurposemissiles.png",
  "powerType": "Click",
  "targetType": "Foe",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.67,
    "maxTargets": 8
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Fear",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Fear",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 0.1625,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.1625,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 8,
      "table": "Ranged_Stun"
    }
  }
};
