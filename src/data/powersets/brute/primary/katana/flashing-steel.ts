/**
 * Flashing Steel
 * Melee (Cone), DMG(Lethal), Foe -Def
 *
 * Source: brute_melee/katana/slice.json
 */

import type { Power } from '@/types';

export const FlashingSteel: Power = {
  "name": "Flashing Steel",
  "internalName": "Slice",
  "available": 1,
  "description": "You swing your katana in a wide arc in front of you, slicing multiple foes. This attack can reduce a target's Defense, making them easier to hit.",
  "shortHelp": "Melee (Cone), DMG(Lethal), Foe -Def",
  "icon": "katana_slice.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "radius": 7,
    "arc": 2.2689,
    "recharge": 6,
    "endurance": 6.032,
    "castTime": 1.17,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.99,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.4455,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
