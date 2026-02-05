/**
 * Quills
 * Toggle: PBAoE, DoT(Lethal), Foe -Speed, -Recharge
 *
 * Source: tanker_melee/spines/quills.json
 */

import type { Power } from '@/types';

export const Quills: Power = {
  "name": "Quills",
  "internalName": "Quills",
  "available": 27,
  "description": "While this power is active, you will constantly fire dozens of Spines in all directions. These Spines do minor damage, but can poison all foes in close range. Spine poison Slows affected foes.",
  "shortHelp": "Toggle: PBAoE, DoT(Lethal), Foe -Speed, -Recharge",
  "icon": "quills_quills.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 15,
    "endurance": 1.04,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee AoE Damage",
    "Slow Movement",
    "Tanker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.15,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.0675,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    },
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
    "immobilize": {
      "mag": 0.33,
      "scale": 3,
      "table": "Melee_Immobilize"
    }
  }
};
