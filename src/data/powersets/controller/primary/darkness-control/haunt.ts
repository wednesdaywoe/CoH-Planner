/**
 * Haunt
 * Foe Targeted, Summon Shades
 *
 * Source: controller_control/darkness_control/haunt.json
 */

import type { Power } from '@/types';

export const Haunt: Power = {
  "name": "Haunt",
  "internalName": "Haunt",
  "available": 17,
  "description": "You summon a pair of Shades from the Netherworld to harass your target foe. Shades deal moderate damage and they terrorize their victims.Recharge: Long.",
  "shortHelp": "Foe Targeted, Summon Shades",
  "icon": "darknesscontrol_haunt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 210,
    "endurance": 10.4,
    "castTime": 2.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "Pet Damage",
    "Recharge Intensive Pets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Shade"
    }
  }
};
