/**
 * Living Shadows
 * Ranged (Cone), Minor DoT(Negative), Foe Immobilize, -To Hit, -Fly
 *
 * Source: dominator_control/darkness_control/living_shadows.json
 */

import type { Power } from '@/types';

export const LivingShadows: Power = {
  "name": "Living Shadows",
  "internalName": "Living_Shadows",
  "available": 1,
  "description": "You extend and animate your own shadow causing it to entangle all foes within a long cone pattern in front of you, rendering all affected foes immobilized.Damage: Minor.Recharge: Moderate.",
  "shortHelp": "Ranged (Cone), Minor DoT(Negative), Foe Immobilize, -To Hit, -Fly",
  "icon": "darknesscontrol_livingshadows.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 1.0472,
    "recharge": 8,
    "endurance": 13,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.13,
    "table": "Ranged_Damage",
    "duration": 5.2,
    "tickRate": 2
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    }
  }
};
