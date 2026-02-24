/**
 * Ignite
 * Ranged, DoT(Fire)
 *
 * Source: corruptor_ranged/assault_rifle/ignite.json
 */

import type { Power } from '@/types';

export const Ignite: Power = {
  "name": "Ignite",
  "internalName": "Ignite",
  "available": 21,
  "description": "Sprays a target with accelerant from your flamethrower, igniting it and causing extreme damage over time. Also sets the location on fire if the target is grounded, inflicting damage to additional foes that step in the area.",
  "shortHelp": "Ranged, DoT(Fire)",
  "icon": "assaultweapons_dot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.15,
    "range": 60,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1022,
      "table": "Ranged_Damage",
      "duration": 5.25,
      "tickRate": 0.25
    }
  ],
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Flames",
      "powers": [
        "Pets.ResistAll_NoFly.ResistAll",
        "Redirects.Assault_Rifle.Ignite",
        "Redirects.Assault_Rifle.Avoid"
      ],
      "duration": 5.5
    }
  }
};
