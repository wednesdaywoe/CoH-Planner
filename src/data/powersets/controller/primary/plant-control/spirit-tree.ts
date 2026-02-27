/**
 * Spirit Tree
 * Place Tree: PBAoE +Regen
 *
 * Source: controller_control/plant_control/spirit_tree.json
 */

import type { Power } from '@/types';

export const SpiritTree: Power = {
  "name": "Spirit Tree",
  "internalName": "Spirit_Tree",
  "available": 11,
  "description": "You can tap into the elusive and powerful energy of the World Tree and extract a Spirit Tree at a targeted location. The Sprit Tree is immobile, but possesses incredible rejuvenating powers. The Regeneration Rate of you, or your allies, will be greatly increased as long as you are near the Spirit Tree. The tree will also distract some enemies, taunting them to attack it instead of you.",
  "shortHelp": "Place Tree: PBAoE +Regen",
  "icon": "plantcontrol_spirittree.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 120,
    "endurance": 13,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Threat Duration"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Spirit Tree",
      "powers": [
        "Villain_Pets.Spirit_Tree_Aura.Spirit_Tree"
      ],
      "duration": 60
    }
  }
};
