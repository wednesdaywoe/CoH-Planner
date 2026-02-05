/**
 * Sleet
 * Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF, -Res (All), Knockdown
 *
 * Source: corruptor_buff/cold_domination/sleet.json
 */

import type { Power } from '@/types';

export const Sleet: Power = {
  "name": "Sleet",
  "internalName": "Sleet",
  "available": 27,
  "description": "Summons a Sleet Storm at a targeted location. Sleet deals minimal Cold damage to anything that passes through the storm. It also Slows the affected foes and severely reduces their Defense and resistance to damage. Many foes may even slip and fall trying to escape the storm.Damage: Minor(DoT).Recharge: Slow.",
  "shortHelp": "Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF, -Res (All), Knockdown",
  "icon": "colddomination_sleet.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 60,
    "endurance": 18.2,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Corruptor Archetype Sets",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Sleet",
      "powers": [
        "Pets.Sleet.Sleet",
        "Pets.Sleet.Avoid"
      ],
      "duration": 15
    }
  }
};
