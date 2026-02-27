/**
 * Eviscerate
 * Melee (Cone), DMG(Lethal), Foe -DEF
 *
 * Source: brute_melee/claws/eviscerate.json
 */

import type { Power } from '@/types';

export const Eviscerate: Power = {
  "name": "Eviscerate",
  "internalName": "Eviscerate",
  "available": 21,
  "description": "You spin and slash violently, Eviscerating all foes in a wide arc in front of you.",
  "shortHelp": "Melee (Cone), DMG(Lethal), Foe -DEF",
  "icon": "claws_evicerate.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 12,
    "endurance": 11.4816,
    "castTime": 2.33,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 2.181,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.9815,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
