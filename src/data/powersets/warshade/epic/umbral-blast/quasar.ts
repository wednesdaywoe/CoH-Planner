/**
 * Quasar
 * PBAoE, Extreme DMG(Negative), Foe -Recharge, -SPD, Knockback
 *
 * Source: warshade_offensive/umbral_blast/quasar.json
 */

import type { Power } from '@/types';

export const Quasar: Power = {
  "name": "Quasar",
  "available": 25,
  "description": "You can explode in a tremendous blast of Negative Energy, sending nearby foes flying. The Quasar deals massive damage to all nearby foes. Affected foes will be knocked down and their attack rate and movement speed will be slowed.  Damage: Extreme. Recharge: Long.",
  "shortHelp": "PBAoE, Extreme DMG(Negative), Foe -Recharge, -SPD, Knockback",
  "icon": "umbralblast_quasar.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.4,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 3,
    "radius": 25,
    "maxTargets": 16
  },
  "targetType": "Self",
  "damage": {
    "type": "Negative",
    "scale": 4,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 10,
      "table": "Ranged_Knockback"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
