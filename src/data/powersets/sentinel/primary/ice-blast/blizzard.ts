/**
 * Blizzard
 * Ranged (Location AoE), Extreme DoT(Cold), Foe -To Hit, -SPD, -Recharge, Knockback
 *
 * Source: sentinel_ranged/ice_blast/blizzard.json
 */

import type { Power } from '@/types';

export const Blizzard: Power = {
  "name": "Blizzard",
  "internalName": "Blizzard",
  "available": 25,
  "description": "You can conjure a Blizzard that inflicts Extreme Cold and Lethal damage over time and can Slow the attack rate of all your opponents in a large area, reducing their chance to hit and possibly knocking them back.",
  "shortHelp": "Ranged (Location AoE), Extreme DoT(Cold), Foe -To Hit, -SPD, -Recharge, Knockback",
  "icon": "iceblast_blizzard.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 2,
    "range": 40,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Slow Movement",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Blizzard_Sentinel",
      "duration": 8
    }
  }
};
