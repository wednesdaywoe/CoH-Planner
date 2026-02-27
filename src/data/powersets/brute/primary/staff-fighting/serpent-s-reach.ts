/**
 * Serpent's Reach
 * Ranged, DMG(Smash), Foe Knockdown
 *
 * Source: brute_melee/staff_fighting/serpents_reach.json
 */

import type { Power } from '@/types';

export const SerpentsReach: Power = {
  "name": "Serpent's Reach",
  "internalName": "Serpents_Reach",
  "available": 17,
  "description": "You fully extend your staff and release a burst of energy to lash out at a distant target and deal Smashing damage with a good chance to knock your target down. While a form is active, this power will build one level of Perfection.",
  "shortHelp": "Ranged, DMG(Smash), Foe Knockdown",
  "icon": "stafffighting_serpentsreach.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "recharge": 9,
    "endurance": 9.36,
    "castTime": 1.77
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
    "Brute Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.8,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.81,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
