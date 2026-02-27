/**
 * Rise to the Challenge
 * Toggle: Self +Regen, Foe -ACC
 *
 * Source: tanker_defense/willpower/rise_to_the_challenge.json
 */

import type { Power } from '@/types';

export const RisetotheChallenge: Power = {
  "name": "Rise to the Challenge",
  "internalName": "Rise_to_the_Challenge",
  "available": 7,
  "description": "The more the odds are against you, the more determined you become. When surrounded by foes, your ability to regenerate health increases greatly. Additionally, your resolve and the look in your eye is enough to leave most foes shaken, so their attacks are less accurate. The first foe you engage in melee grants the highest regeneration bonus, and up to 10 foes can contribute to this effect.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Regen, Foe -ACC",
  "icon": "willpower_risetothechallenge.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "Healing",
    "Threat Duration",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Melee_DeBuff_ToHit"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Melee_Ones"
    }
  }
};
