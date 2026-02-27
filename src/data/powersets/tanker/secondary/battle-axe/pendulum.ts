/**
 * Pendulum
 * Melee (Targeted AoE), DMG(Lethal), Foe Knockdown
 *
 * Source: tanker_melee/battle_axe/pendulum.json
 */

import type { Power } from '@/types';

export const Pendulum: Power = {
  "name": "Pendulum",
  "internalName": "Pendulum",
  "available": 19,
  "description": "This attack swings your Battle Axe directly in front of you. Foes struck by this attack are dealt heavy damage, and may be knocked down.",
  "shortHelp": "Melee (Targeted AoE), DMG(Lethal), Foe Knockdown",
  "icon": "battleaxe_taoe.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "radius": 7,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.3463,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
