/**
 * Tesla Coil
 * Ranged (Targeted AoE), Foe DMG(Energy), Hold, -End, -Fly, -Jump, -Recharge
 *
 * Source: controller_control/electric_control/paralyzing_blast.json
 */

import type { Power } from '@/types';

export const TeslaCoil: Power = {
  "name": "Tesla Coil",
  "internalName": "Paralyzing_Blast",
  "available": 17,
  "description": "Summoning a large amount of energy that periodically jolts at nearby enemies dealing energy damage and paralizing them for a short time. These foes may be drained of some endurance as well.",
  "shortHelp": "Ranged (Targeted AoE), Foe DMG(Energy), Hold, -End, -Fly, -Jump, -Recharge",
  "icon": "electriccontrol_paralyzingblastpatch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 0.8,
    "range": 80,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 1.67
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
      "displayName": "Tesla Coil",
      "powers": [
        "Redirects.Electric_Control.Tesla_Coil_Pulse",
        "Redirects.Electric_Control.Tesla_Coil_Debuff",
        "Redirects.Electric_Control.Tesla_Coil_OneShot",
        "Redirects.Electric_Control.Self_Destruct"
      ],
      "copyBoosts": true
    }
  }
};
