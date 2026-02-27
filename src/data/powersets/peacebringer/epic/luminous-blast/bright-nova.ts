/**
 * Bright Nova
 * Toggle: Shapeshift, Special
 *
 * Source: peacebringer_offensive/luminous_blast/bright_nova.json
 */

import type { Power } from '@/types';

export const BrightNova: Power = {
  "name": "Bright Nova",
  "available": 3,
  "description": "Kheldians are masters of energy and matter. A Peacebringer can transform into a flying energy beast known as a Bright Nova. When you choose this power, you will have access to 4 very powerful ranged attacks that can only be used while in this form. You will not be able to use any other powers while in Bright Nova form. Bright Nova can fly, has increased Accuracy, and improved Endurance Recovery, but has no defense.  Recharge: Very Fast.",
  "shortHelp": "Toggle: Shapeshift, Special",
  "icon": "luminousblast_brightnova.png",
  "powerType": "Toggle",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Fly",
    "ToHit"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Flight",
    "To Hit Buff",
    "Universal Travel"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 1,
    "endurance": 0.13
  },
  "targetType": "Self",
  "effects": {
    "movement": {
      "fly": {
        "scale": 4,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 1.5,
        "table": "Melee_SpeedFlying"
      },
      "movementControl": {
        "scale": 2,
        "table": "Melee_Control"
      },
      "movementFriction": {
        "scale": 2,
        "table": "Melee_Friction"
      }
    },
    "recoveryBuff": {
      "scale": 0.15,
      "table": "Melee_Ones"
    },
    "tohitBuff": {
      "scale": 1,
      "table": "Melee_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 5,
      "table": "Melee_Buff_Dmg"
    },
    "resistance": {
      "energy": {
        "scale": 0.15,
        "table": "Melee_Ones"
      },
      "negative": {
        "scale": 0.15,
        "table": "Melee_Ones"
      }
    }
  }
};
