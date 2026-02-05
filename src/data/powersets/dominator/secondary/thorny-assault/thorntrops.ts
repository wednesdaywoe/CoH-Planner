/**
 * Thorntrops
 * Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed
 *
 * Source: dominator_assault/thorny_assault/thorntrops.json
 */

import type { Power } from '@/types';

export const Thorntrops: Power = {
  "name": "Thorntrops",
  "internalName": "Thorntrops",
  "available": 23,
  "description": "You fling dozens of Thorns into the ground at a targeted location. The small Thorns pepper the ground over a large area. Any enemy that pass over the Thorntrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
  "icon": "thornyassault_thorntrops.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 25,
    "recharge": 45,
    "endurance": 7.8,
    "castTime": 1.63
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage"
  ],
  "allowedSetCategories": [
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Thorntrops",
      "duration": 45
    }
  }
};
