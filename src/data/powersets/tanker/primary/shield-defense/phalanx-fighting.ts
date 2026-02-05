/**
 * Phalanx Fighting
 * Auto: Self Special +DEF(Melee, Ranged, AoE)
 *
 * Source: tanker_defense/shield_defense/phalanx_fighting.json
 */

import type { Power } from '@/types';

export const PhalanxFighting: Power = {
  "name": "Phalanx Fighting",
  "internalName": "Phalanx_Fighting",
  "available": 11,
  "description": "Fighting very near your allies allows you to deflect attacks much easier. You will gain a small bonus to your melee, ranged and area of effect defense. This bonus grows for each ally near you. This power is always on and costs no endurance.",
  "shortHelp": "Auto: Self Special +DEF(Melee, Ranged, AoE)",
  "icon": "shielddefense_phalanxfighting.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "maxTargets": 3
  },
  "allowedEnhancements": [],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseBuff": {
      "ranged": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      },
      "aoe": {
        "scale": 0.5,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
