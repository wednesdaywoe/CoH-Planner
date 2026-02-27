/**
 * Sound Barrier
 * Toggle: Self +Absorb, +Recovery, +Res(Smashing, Energy, Sleep)
 *
 * Source: blaster_support/sonic_manipulation/sound_barrier.json
 */

import type { Power } from '@/types';

export const SoundBarrier: Power = {
  "name": "Sound Barrier",
  "internalName": "Sound_Barrier",
  "available": 19,
  "description": "Creates a barrier around the caster which reduces incoming energy and smashing damage, provides protection against sleep effects and grants an absorption shield. Recovery is also increased.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +Absorb, +Recovery, +Res(Smashing, Energy, Sleep)",
  "icon": "sonicmanipulation_soundbarrier.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "castTime": 2.7
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceModification",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "absorb": {
      "scale": 0.15,
      "table": "Melee_HealSelf"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 2.25
  }
};
