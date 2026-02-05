/**
 * Blackstar
 * PBAoE, DMG(Negative), Foe -To Hit
 *
 * Source: sentinel_ranged/dark_blast/blackstar.json
 */

import type { Power } from '@/types';

export const Blackstar: Power = {
  "name": "Blackstar",
  "internalName": "Blackstar",
  "available": 25,
  "description": "You can unleash a devastating blast of Negative Energy around yourself, dealing massive Negative Energy and Smashing damage and severely reducing affected foes' chance to hit.",
  "shortHelp": "PBAoE, DMG(Negative), Foe -To Hit",
  "icon": "darkcast_blackstar.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Melee AoE Damage",
    "Sentinel Archetype Sets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.928,
      "table": "Ranged_Damage"
    },
    {
      "type": "Negative",
      "scale": 2.253,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 5,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
