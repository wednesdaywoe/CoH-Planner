/**
 * Thorny Darts
 * Ranged, Light DMG(Lethal), DoT(Toxic) -DEF
 *
 * Source: dominator_assault/thorny_assault/thorny_darts.json
 */

import type { Power } from '@/types';

export const ThornyDarts: Power = {
  "name": "Thorny Darts",
  "internalName": "Thorny_Darts",
  "available": 0,
  "description": "Hurls small Thorny Darts at your foes. Thorny Darts deal moderate damage. Poison from the Darts deals additional Toxic damage and can reduce your foes Defense.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Lethal), DoT(Toxic) -DEF",
  "icon": "thornyassault_darts.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.0595,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
