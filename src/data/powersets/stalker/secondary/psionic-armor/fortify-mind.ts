/**
 * Psychokinetic Barrier
 * Self, +Absorb, +MaxHP, +Regeneration, +Res(-Regeneration, -Recovery, -Recharge, -Endurance)
 *
 * Source: stalker_defense/psionic_armor/fortify_mind.json
 */

import type { Power } from '@/types';

export const PsychokineticBarrier: Power = {
  "name": "Psychokinetic Barrier",
  "internalName": "Fortify_Mind",
  "available": 19,
  "description": "You can erect a temporary wall of crystalized psionic energy that will absorb a large amount of damage before breaking off. Psychokinetic Barrier will grant a moderate amount of absorption and reduce the effect debuffs have on you.",
  "shortHelp": "Self, +Absorb, +MaxHP, +Regeneration, +Res(-Regeneration, -Recovery, -Recharge, -Endurance)",
  "icon": "psionicarmor_psychokineticbarrier.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxStacks": 3,
    "stacksLinear": ["absorb", "debuffResistance"],
    "absorb": {
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    "durations": {
      "absorb": 30,
      "maxHPBuff": 45,
      "regenBuff": 45,
      "debuffResistance": 45
    },
    "maxHPBuff": {
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "endurance": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "regeneration": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "recovery": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "recharge": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "buffDuration": 45
  }
};
