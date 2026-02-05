/**
 * Psychokinetic Barrier
 * Self, +Absorb, +MaxHP, +Regeneration, +Res(-Regeneration, -Recovery, -Recharge, -Endurance)
 *
 * Source: tanker_defense/psionic_armor/fortify_mind.json
 */

import type { Power } from '@/types';

export const PsychokineticBarrier: Power = {
  "name": "Psychokinetic Barrier",
  "internalName": "Fortify_Mind",
  "available": 11,
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
    "absorb": {
      "scale": 3,
      "table": "Melee_HealSelf"
    },
    "maxHPBuff": {
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    "regenBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "enduranceGain": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
