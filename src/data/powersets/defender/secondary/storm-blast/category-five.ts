/**
 * Category Five
 * Ranged (Location AoE), DoT(Energy), +Wet
 *
 * Source: defender_ranged/storm_blast/category_five.json
 */

import type { Power } from '@/types';

export const CategoryFive: Power = {
  "name": "Category Five",
  "internalName": "Category_Five",
  "available": 29,
  "description": "Summons a severe storm that begins light, but grows in power until it becomes a raging engine of destruction. Left on its own, the Category Five storm is capable of delivering moderate damage. As it grows in power, foes may begin to fling through the air. In addition, each use of your Storm Blast powers is capable of delivering lightning attacks within the Category Five storm, delivering energy damage.",
  "shortHelp": "Ranged (Location AoE), DoT(Energy), +Wet",
  "icon": "stormblast_categoryfive.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 2,
    "range": 60,
    "recharge": 170,
    "endurance": 27.716,
    "castTime": 2.5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Category Five Eye",
      "powers": [
        "Pets.ResistAll_NoFly.ResistAll",
        "Redirects.Storm_Blast.Nukenado_Skin",
        "Redirects.Storm_Blast.Nukenado_Pulse",
        "Redirects.Storm_Blast.Nukenado_SelfDestruct"
      ],
      "duration": 25
    }
  }
};
