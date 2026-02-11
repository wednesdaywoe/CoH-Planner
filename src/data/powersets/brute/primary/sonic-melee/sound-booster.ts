/**
 * Sound Booster
 * Self +DMG, +To Hit, +Special
 *
 * Source: brute_melee/sonic_melee/build_up.json
 */

import type { Power } from '@/types';

export const SoundBooster: Power = {
  "name": "Sound Booster",
  "internalName": "Build_Up",
  "available": 5,
  "description": "Greatly boosts your attacks for a few seconds. Slightly increases chance to hit. Moderately increases the duration of mez effects. Moderately increases the chance for Sound Manipulation powers to induce migraines.",
  "shortHelp": "Self +DMG, +To Hit, +Special",
  "icon": "sonicmanipulation_buildup.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 90,
    "endurance": 5.2,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 6,
      "table": "Melee_Buff_Dmg"
    },
    "confuse": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "effectDuration": 10,
    "fear": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "immobilize": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "sleep": {
      "mag": 1,
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  }
};
