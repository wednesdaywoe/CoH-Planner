/**
 * Flashing Steel
 * Melee (Cone), DMG(Lethal), Foe -Def
 *
 * Source: stalker_melee/ninja_sword/slice.json
 */

import type { Power } from '@/types';

export const FlashingSteel: Power = {
  "name": "Flashing Steel",
  "internalName": "Slice",
  "available": 1,
  "description": "You swing your Ninja Blade in a wide arc in front of you, slicing multiple foes with lethal damage. This attack can reduce a target's Defense, making them easier to hit. If executed while hidden, all affected targets have a chance to be hit with a Critical for extra damage.",
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
    "Defense Debuff",
    "Melee AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.99,
    "table": "Melee_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
