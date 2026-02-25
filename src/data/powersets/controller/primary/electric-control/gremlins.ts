/**
 * Gremlins
 * Summon Gremlins: Minor DMG(Energy)
 *
 * Source: controller_control/electric_control/gremlins.json
 */

import type { Power } from '@/types';

export const Gremlins: Power = {
  "name": "Gremlins",
  "internalName": "Gremlins",
  "available": 25,
  "description": "Mastery over electricity allows you to create almost sentient elementals of lightning. These elementals are mischievous in nature, and enjoy creating havoc and interfering with electronic equipment or magical cantrips. They also never work alone, where there is one Gremlin, there is often another nearby.",
  "shortHelp": "Summon Gremlins: Minor DMG(Energy)",
  "icon": "electriccontrol_gremlins.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 26,
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
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Gremlin_Controller",
      "copyBoosts": true,
      "entityCount": 2
    }
  }
};
