/**
 * Salt Crystals
 * PBAoE, Foe Deep Sleep, -DEF
 *
 * Source: controller_control/earth_control/salt_crystals.json
 */

import type { Power } from '@/types';

export const SaltCrystals: Power = {
  "name": "Salt Crystals",
  "internalName": "Salt_Crystals",
  "available": 7,
  "description": "Attempts to encrust all nearby foes in a Pillar of Salt. The victims will remain encased within the salt for quite a while, but will automatically break free if attacked. Affected targets have reduced defense for a while, even if they break free.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "PBAoE, Foe Deep Sleep, -DEF",
  "icon": "earthgrasp_saltpillars.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 30,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 1.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Sleep",
    "Recharge",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Sleep"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    },
    "sleep": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Sleep"
    }
  }
};
