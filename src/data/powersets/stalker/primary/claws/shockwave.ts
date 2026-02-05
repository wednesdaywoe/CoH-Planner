/**
 * Shockwave
 * Ranged (Cone), DMG(Lethal), Foe Knockback
 *
 * Source: stalker_melee/claws/shockwave.json
 */

import type { Power } from '@/types';

export const Shockwave: Power = {
  "name": "Shockwave",
  "internalName": "Shockwave",
  "available": 25,
  "description": "Projects a Shockwave of focused power that can travel a short distance. Shockwave travels in a wide arc in front of you dealing moderate lethal damage and, possibly knocking back foes. If executed while hidden, all affected targets have a chance to be hit with a Critical for extra damage.",
  "shortHelp": "Ranged (Cone), DMG(Lethal), Foe Knockback",
  "icon": "claws_wave.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 1.5708,
    "recharge": 12.1,
    "endurance": 11.5648,
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
    "Knockback",
    "Ranged AoE Damage",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.04,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.7,
      "table": "Melee_Knockback"
    }
  }
};
