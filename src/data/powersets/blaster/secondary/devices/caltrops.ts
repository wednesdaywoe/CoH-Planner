/**
 * Caltrops
 * Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed
 *
 * Source: blaster_support/gadgets/caltrops.json
 */

import type { Power } from '@/types';

export const Caltrops: Power = {
  "name": "Caltrops",
  "internalName": "Caltrops",
  "available": 0,
  "description": "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any villains that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Minor DoT(Lethal), Foe -Speed",
  "icon": "gadgets_caltrops.png",
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
    "Blaster Archetype Sets",
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
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
