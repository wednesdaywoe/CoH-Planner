/**
 * Athletic Regulation
 * Auto: Self +SPD, +Special
 *
 * Source: sentinel_defense/bio_organic_armor/athletic_regulation.json
 */

import type { Power } from '@/types';

export const AthleticRegulation: Power = {
  "name": "Athletic Regulation",
  "internalName": "Athletic_Regulation",
  "available": 23,
  "description": "Your body is continually regulating your athletic capabilities to best fit your current need. You also gain a small amount of defense debuff resistance.*While Offensive Adaptation is active you gain increased movement speed. *While Defensive Adaptation is active you are more resistant to run and fly speed debuffs. *While Efficient Adaptation is active all your run and fly powers have their speeds boosted.Bonuses granted from Adaptations are unenhanceable.This power is always on and permanently increases your movement speed, regardless your Adaptation.",
  "shortHelp": "Auto: Self +SPD, +Special",
  "icon": "bioorganicarmor_athleticaugmentation.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Run Speed",
    "Fly"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.33,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.33,
        "table": "Melee_Ones"
      }
    },
    "elusivity": {
      "all": {
        "scale": 0.75,
        "table": "Melee_Res_Boolean"
      }
    }
  }
};
