/**
 * Spin
 * PBAoE Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: widow_training/widow_training/spin.json
 */

import type { Power } from '@/types';

export const Spin: Power = {
  "name": "Spin",
  "available": 11,
  "description": "Spin does moderate lethal damage to all foes within an 8' radius of you, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power may deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "PBAoE Melee, DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "widowtraining_spin.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "recharge": 14,
    "endurance": 15.451,
    "castTime": 2.5,
    "radius": 8,
    "maxTargets": 10
  },
  "targetType": "Self",
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.3506,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.9004,
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
