/**
 * Eviscerate
 * Melee (Cone), DMG(Lethal), DoT(Toxic), -Recharge, -SPD
 *
 * Source: widow_training/night_widow_training/nw_eviscerate.json
 */

import type { Power } from '@/types';

export const Eviscerate: Power = {
  "name": "Eviscerate",
  "available": 21,
  "description": "Eviscerate does superior lethal damage to your foe, then poisons them. The poison does toxic damage over time and slows their recovery rate and movement speed.  Notes: This power may deal critical damage if used after a successful Placate or while the user is hidden with the Night Widow or Fortunata Mask Presence power.",
  "shortHelp": "Melee (Cone), DMG(Lethal), DoT(Toxic), -Recharge, -SPD",
  "icon": "nightwidowtraining_eviscerate.png",
  "powerType": "Click",
  "effectArea": "Cone",
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
    "range": 7,
    "recharge": 12,
    "endurance": 13.548,
    "castTime": 2.33,
    "radius": 7,
    "arc": 1.5708,
    "maxTargets": 5
  },
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 2.076,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 2.076,
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
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.4,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.4,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    }
  }
};
