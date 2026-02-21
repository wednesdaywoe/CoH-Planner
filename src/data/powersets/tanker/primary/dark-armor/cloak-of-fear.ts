/**
 * Cloak of Fear
 * Toggle: PBAoE Self +Res(Knockback), Foe Fear, -ACC
 *
 * Source: tanker_defense/dark_armor/cloak_of_fear.json
 */

import type { Power } from '@/types';

export const CloakofFear: Power = {
  "name": "Cloak of Fear",
  "internalName": "Cloak_of_Fear",
  "available": 17,
  "description": "You can wrap yourself in a nightmarish Cloak of Fear. Foes close to you are treated to visions most horrific, lowering their damage ouptupt and forcing them to tremble in terror, only attacking if attacked, and even then, with a reduced chance to hit. Feeding on your enemies fear will increase your protection against knockback effects.Notes: Mez enhancements on this power enhance its magnitude instead of its duration.",
  "shortHelp": "Toggle: PBAoE Self +Res(Knockback), Foe Fear, -ACC",
  "icon": "darkarmor_fearfulaura.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.8,
    "radius": 15,
    "recharge": 4,
    "endurance": 0.26,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Fear",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "Threat Duration",
    "To Hit Debuff"
  ],
  "effects": {
    "effectDuration": 3,
    "fear": {
      "mag": 2,
      "scale": 1,
      "table": "Melee_Ones"
    },
    "tohitDebuff": {
      "scale": 0.05,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Dam"
    }
  },
  "maxSlots": 6
};
