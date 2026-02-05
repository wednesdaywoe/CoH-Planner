/**
 * Flashing Steel
 * Melee (Cone), DMG(Lethal), Foe -Def
 *
 * Source: tanker_melee/katana/slice.json
 */

import type { Power } from '@/types';

export const FlashingSteel: Power = {
  "name": "Flashing Steel",
  "internalName": "Slice",
  "available": 3,
  "description": "You swing your katana in a wide arc in front of you, slicing multiple foes. This attack can reduce a target's Defense, making them easier to hit.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
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
    "endurance": 6.864,
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
    "Tanker Archetype Sets",
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
