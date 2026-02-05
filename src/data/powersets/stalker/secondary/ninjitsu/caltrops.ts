/**
 * Caltrops
 * Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed
 *
 * Source: stalker_defense/ninjitsu/caltrops.json
 */

import type { Power } from '@/types';

export const Caltrops: Power = {
  "name": "Caltrops",
  "internalName": "Caltrops",
  "available": 9,
  "description": "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any enemy that passes over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
  "icon": "ninjitsu_caltrops.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 25,
    "recharge": 45,
    "endurance": 7.8,
    "castTime": 1.07
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
      "entity": "Pets_Caltrops",
      "duration": 45
    }
  }
};
