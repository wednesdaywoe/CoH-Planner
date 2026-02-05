/**
 * Blackstar
 * PBAoE, DMG(Negative/Smash), Foe -To Hit
 *
 * Source: corruptor_ranged/dark_blast/blackstar.json
 */

import type { Power } from '@/types';

export const Blackstar: Power = {
  "name": "Blackstar",
  "internalName": "Blackstar",
  "available": 25,
  "description": "You can unleash a devastating blast of Negative Energy around yourself, dealing massive Negative Energy and Smashing damage and severely reducing affected foes' chance to hit.",
  "shortHelp": "PBAoE, DMG(Negative/Smash), Foe -To Hit",
  "icon": "darkcast_blackstar.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 25,
    "recharge": 145,
    "endurance": 27.7316,
    "castTime": 3,
    "maxTargets": 16
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
    "Corruptor Archetype Sets",
    "Melee AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Negative",
      "scale": 3,
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
