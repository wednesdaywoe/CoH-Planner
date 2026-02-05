/**
 * Salt Crystals
 * PBAoE, Foe Sleep, -DEF
 *
 * Source: blaster_support/earth_manipulation/salt_crystals.json
 */

import type { Power } from '@/types';

export const SaltCrystals: Power = {
  "name": "Salt Crystals",
  "internalName": "Salt_Crystals",
  "available": 3,
  "description": "Attempts to encrust all nearby foes in a Pillar of Salt. The victims will remain encased within the salt for quite a while, but will automatically break free if attacked. Affected targets have reduced defense for a while, even if they break free.Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required against AVs and players, as well as to make secondary effects apply.Recharge: Slow.",
  "shortHelp": "PBAoE, Foe Sleep, -DEF",
  "icon": "earthmanip_saltcrystals.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 15.6,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Sleep"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
