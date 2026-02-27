/**
 * Shockwave
 * Melee (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: tanker_melee/claws/shockwave.json
 */

import type { Power } from '@/types';

export const Shockwave: Power = {
  "name": "Shockwave",
  "internalName": "Shockwave",
  "available": 29,
  "description": "Projects a Shockwave of focused power that can travel a short distance. Shockwave travels in a wide arc in front of you dealing moderate damage and, possibly knocking back foes.",
  "shortHelp": "Melee (Cone), DMG(Lethal), Foe Knockback",
  "icon": "claws_wave.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 1.5708,
    "recharge": 14.4,
    "endurance": 13.4784,
    "castTime": 1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.1301,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5084,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.7,
      "table": "Melee_Knockback"
    }
  }
};
