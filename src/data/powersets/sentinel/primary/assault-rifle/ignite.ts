/**
 * Ignite
 * Ranged, DoT(Fire), Location AoE, DoT(Fire)
 *
 * Source: sentinel_ranged/assault_rifle/incinerator.json
 */

import type { Power } from '@/types';

export const Ignite: Power = {
  "name": "Ignite",
  "internalName": "Incinerator",
  "available": 21,
  "description": "Sprays a target with accelerant from your flamethrower, igniting it and causing extreme damage over time. Also sets the location on fire if the target is grounded, inflicting damage to additional foes that step in the area.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Ranged, DoT(Fire), Location AoE, DoT(Fire)",
  "icon": "assaultweapons_dot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.15,
    "range": 40,
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
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
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
  ]
};
