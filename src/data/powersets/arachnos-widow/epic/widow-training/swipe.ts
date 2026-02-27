/**
 * Swipe
 * Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: widow_training/widow_training/swipe.json
 */

import type { Power } from '@/types';

export const Swipe: Power = {
  "name": "Swipe",
  "available": 0,
  "description": "Swipe does light lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "widowtraining_swipe.png",
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
    "recharge": 4,
    "endurance": 4.16,
    "castTime": 0.83
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.5333,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Toxic",
      "scale": 0.08,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Melee_Slow"
    }
  }
};
