/**
 * Phantom Army
 * Summon Decoys: Ranged DMG(Psionic)
 *
 * Source: dominator_control/illusion_control/decoy.json
 */

import type { Power } from '@/types';

export const PhantomArmy: Power = {
  "name": "Phantom Army",
  "internalName": "Decoy",
  "available": 17,
  "description": "You can fabricate 3 Phantom heroes around a targeted foe. These Phantoms are not real, and are indestructible. Though they deal damage, it is illusory and will heal if the victim survives long enough. Phantoms are short lived and cannot be buffed or healed.",
  "shortHelp": "Summon Decoys: Ranged DMG(Psionic)",
  "icon": "illusions_phantomarmy2.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 240,
    "endurance": 26,
    "castTime": 3.1
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
      "entity": "Pets_Decoy_Dominator",
      "duration": 60
    }
  }
};
