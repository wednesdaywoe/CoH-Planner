/**
 * Ebon Eye
 * Ranged, Moderate DMG(Negative), Foe -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const EbonEye: Power = {
  "name": "Ebon Eye",
  "available": 0,
  "description": "You can emit a beam of dark energy from your eyes, dealing moderate Negative Energy damage. Ebon Eye can also slow your target's attack rate and movement speed. This power can be used while in Nova form at an increased range and with higher damage but slower recharge.  Damage: Moderate. Recharge: Fast.",
  "shortHelp": "Ranged, Moderate DMG(Negative), Foe -Recharge, -SPD",
  "icon": "umbralblast_eboneye.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)"
};
