/**
 * Liquid Nitrogen
 * Ranged (Location AoE), DoT(Cold), Knockdown, -SPD
 *
 * Source: controller_control/arsenal_control/liquid_nitrogen.json
 */

import type { Power } from '@/types';

export const LiquidNitrogen: Power = {
  "name": "Liquid Nitrogen",
  "internalName": "Liquid_Nitrogen",
  "available": 5,
  "description": "The Liquid Nitrogen dispenser can spray a target location with liquid nitrogen creating a large patch of ice. Those caught in the patch of ice are dramatically slowed, tend to fall down taking damage, and will be unable to jump.",
  "shortHelp": "Ranged (Location AoE), DoT(Cold), Knockdown, -SPD",
  "icon": "arsenalcontrol_liquidnitrogen.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 90,
    "endurance": 10.4,
    "castTime": 2
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_LiquidNitrogen",
      "duration": 30
    }
  }
};
