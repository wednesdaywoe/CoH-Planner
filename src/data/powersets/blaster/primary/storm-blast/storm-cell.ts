/**
 * Storm Cell
 * Ranged (Location AoE), Foe -Recharge, -SPD, +Wet, Special
 *
 * Source: blaster_ranged/storm_blast/storm_cell.json
 */

import type { Power } from '@/types';

export const StormCell: Power = {
  "name": "Storm Cell",
  "internalName": "Storm_Cell",
  "available": 5,
  "description": "You conjure a storm in the area that defines the boundaries of your stormy powers. Rain from this power will slightly lower a foe's movement and chance to hit. The use of your Storm Blast attacks may create high winds and lightning within the storm cell, delivering stronger debuffs and causing damage. Additionally, Storm Blast attacks will be enhanced when used against foes victimized by Storm Cell.",
  "shortHelp": "Ranged (Location AoE), Foe -Recharge, -SPD, +Wet, Special",
  "icon": "stormblast_stormcell.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 25,
    "recharge": 60,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Storm Cell",
      "powers": [
        "Pets.ResistAll_NoFly.ResistAll",
        "Redirects.Storm_Blast.StormCell_Tempest",
        "Redirects.Storm_Blast.StormCell_SelfDestruct"
      ],
      "duration": 60
    }
  }
};
