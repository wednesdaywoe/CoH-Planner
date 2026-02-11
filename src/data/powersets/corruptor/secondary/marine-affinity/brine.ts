/**
 * Brine
 * Ranged, Foe -Resist(All), -MaxHP
 *
 * Source: corruptor_buff/marine_affinity/brine.json
 */

import type { Power } from '@/types';

export const Brine: Power = {
  "name": "Brine",
  "internalName": "Brine",
  "available": 19,
  "description": "You coat an enemy in an extremely salinated layer of deep-sea brine that reduces your foe's resistance to damage and maximum hitpoints.If Shifting Tides is active, Brine will consume up to 3 stacks upon use to reduce its base recharge by 15 seconds per stack.",
  "shortHelp": "Ranged, Foe -Resist(All), -MaxHP",
  "icon": "marineaffinity_brine.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 7,
    "castTime": 1.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 3,
        "table": "Ranged_Res_Dmg"
      }
    },
    "maxHPBuff": {
      "scale": 2,
      "table": "Ranged_Heal"
    }
  }
};
