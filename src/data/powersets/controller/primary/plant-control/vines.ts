/**
 * Vines
 * Ranged (Targeted AoE), Foe Hold, -DMG, -DoT(Toxic)
 *
 * Source: controller_control/plant_control/vines.json
 */

import type { Power } from '@/types';

export const Vines: Power = {
  "name": "Vines",
  "internalName": "Vines",
  "available": 17,
  "description": "Creates a field of Strangler Vines that can Hold multiple foes at range. The affected targets are held helpless by the massive root-like vines. Vines lowers damage output of targets and deals toxic damage over time if they are held.",
  "shortHelp": "Ranged (Targeted AoE), Foe Hold, -DMG, -DoT(Toxic)",
  "icon": "plantcontrol_vines.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 2.1
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Vines",
      "powers": [
        "Villain_Pets.Vines.Self_Destruct",
        "Pets.ResistAll.ResistAll",
        "Villain_Pets.Vines.Vines_Pulse",
        "Villain_Pets.Vines.Vines_Debuff",
        "Villain_Pets.Vines.Vines_OneShot"
      ]
    }
  }
};
