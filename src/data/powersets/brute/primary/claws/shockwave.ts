/**
 * Shockwave
 * Melee (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: brute_melee/claws/shockwave.json
 */

import type { Power } from '@/types';

export const Shockwave: Power = {
  "name": "Shockwave",
  "internalName": "Shockwave",
  "available": 25,
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
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.13,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5085,
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
