/**
 * Practiced Brawler
 * Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize)
 *
 * Source: brute_defense/super_reflexes/practiced_brawler.json
 */

import type { Power } from '@/types';

export const PracticedBrawler: Power = {
  "name": "Practiced Brawler",
  "internalName": "Practiced_Brawler",
  "available": 9,
  "description": "Your training has allowed you to become a Practiced Brawler, tuning you into a perfect fighting machine. You gain a resistance to Knockback, Disorient, Hold, Sleep, and Immobilization powers for a short duration.Recharge: Long.",
  "shortHelp": "Self +Res(Knockback, Disorient, Hold, Sleep, Immobilize)",
  "icon": "superreflexes_practicedbrawler.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 200,
    "endurance": 10.4,
    "castTime": 1.53
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "knockup": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "knockback": {
      "scale": 10,
      "table": "Melee_Ones"
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 120,
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 30,
      "table": "Melee_Res_Boolean"
    }
  }
};
