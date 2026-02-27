/**
 * Strike
 * Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: widow_training/widow_training/strike.json
 */

import type { Power } from '@/types';

export const Strike: Power = {
  "name": "Strike",
  "available": 1,
  "description": "Strike does high lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "widowtraining_strike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 12,
    "endurance": 9.485,
    "castTime": 0.83
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.824,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 1.216,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Melee_Slow"
    }
  }
};
