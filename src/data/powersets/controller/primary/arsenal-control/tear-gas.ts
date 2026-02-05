/**
 * Tear Gas
 * Ranged (Location AoE), DoT(Toxic), Foe Hold, -DMG
 *
 * Source: controller_control/arsenal_control/tear_gas.json
 */

import type { Power } from '@/types';

export const TearGas: Power = {
  "name": "Tear Gas",
  "internalName": "Tear_Gas",
  "available": 21,
  "description": "The Tear Gas canister serves as the ultimate crowd control tool, rendering enemies incapacitated and choking, thereby preventing them from taking any action while also debuffing their damage output.",
  "shortHelp": "Ranged (Location AoE), DoT(Toxic), Foe Hold, -DMG",
  "icon": "arsenalcontrol_teargas.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 0.85,
    "range": 80,
    "radius": 20,
    "recharge": 180,
    "endurance": 15.6,
    "castTime": 1.87
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
      "displayName": "Tear Gas",
      "powers": [
        "Redirects.Assault_Rifle.Tear_Gas",
        "Redirects.Assault_Rifle.Tear_Gas_Debuff",
        "Redirects.Assault_Rifle.Tear_Gas_OneShot",
        "Pets.ResistAll.ResistAll"
      ],
      "duration": 60
    }
  }
};
