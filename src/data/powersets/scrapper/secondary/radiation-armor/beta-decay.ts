/**
 * Beta Decay
 * Toggle: Foe, Taunt, -To Hit, -Defense, Self +Recharge
 *
 * Source: scrapper_defense/radiation_armor/beta_decay.json
 */

import type { Power } from '@/types';

export const BetaDecay: Power = {
  "name": "Beta Decay",
  "internalName": "Beta_Decay",
  "available": 19,
  "description": "While Beta Decay is active, nearby foes will have their chance to hit and defense decreased slightly and will be taunted. You will gain a recharge bonus per nearby target up to 10 targets. The first target grants the largest benefit.",
  "shortHelp": "Toggle: Foe, Taunt, -To Hit, -Defense, Self +Recharge",
  "icon": "radiationarmor_betadecay.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 0.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Defense Debuff"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "Threat Duration",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    },
    "defenseDebuff": {
      "scale": 1.5,
      "table": "Melee_Debuff_Def"
    },
    "rechargeBuff": {
      "scale": 0.025,
      "table": "Melee_Ones"
    }
  }
};
