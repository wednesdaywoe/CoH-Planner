/**
 * Dark Blast
 * Ranged, Light DMG(Negative), Foe -To Hit
 *
 * Source: dominator_assault/dark_assault/dark_blast.json
 */

import type { Power } from '@/types';

export const DarkBlast: Power = {
  "name": "Dark Blast",
  "internalName": "Dark_Blast",
  "available": 0,
  "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's chance to hit.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Negative), Foe -To Hit",
  "icon": "darknessassault_darkblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
