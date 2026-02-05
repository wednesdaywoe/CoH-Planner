/**
 * Caltrops
 * Ranged (Location AoE), DoT(Lethal), Foe -Speed
 *
 * Source: corruptor_buff/traps/caltrops.json
 */

import type { Power } from '@/types';

export const Caltrops: Power = {
  "name": "Caltrops",
  "internalName": "Caltrops",
  "available": 0,
  "description": "You toss a handful of Caltrops at a targeted location and spread the tiny metal spikes over a large area. Any enemy that pass over the Caltrops will be forced to move at a slower rate. They will also take some trivial Lethal damage over time.",
  "shortHelp": "Ranged (Location AoE), DoT(Lethal), Foe -Speed",
  "icon": "traps_droppedaoedebuffrunspeed.png",
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
    "Corruptor Archetype Sets",
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
