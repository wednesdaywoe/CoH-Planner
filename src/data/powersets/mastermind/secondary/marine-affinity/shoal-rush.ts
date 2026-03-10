/**
 * Shoal Rush
 * Ranged (Targeted AoE), Foe -DEF, -SPD, Special
 *
 * Source: mastermind_buff/marine_affinity/shoal_rush.json
 */

import type { Power } from '@/types';

export const ShoalRush: Power = {
  "name": "Shoal Rush",
  "internalName": "Shoal_Rush",
  "available": 0,
  "description": "By sensing the water in an area, you can direct a shoal of marine life to harass your foes. This lowers the defense and movement speed of all enemies struck.If you direct a Shoal Rush on targets inside a Tide Pool, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
  "shortHelp": "Ranged (Targeted AoE), Foe -DEF, -SPD, Special",
  "icon": "marineaffinity_shoalrush.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "radius": 20,
    "arc": 1.5708,
    "recharge": 15,
    "endurance": 13,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "defenseDebuff": {
      "scale": 1.6,
      "table": "Ranged_Debuff_Def"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.448,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.448,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.448,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.448,
        "table": "Ranged_Slow"
      }
    },
    "slow": {
      "runSpeed": {
        "scale": 1,
        "table": "Ranged_SpeedRunning"
      }
    }
  }
};
