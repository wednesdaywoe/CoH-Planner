/**
 * Serpent's Reach
 * Ranged, DMG(Smash), Foe Knockdown
 *
 * Source: stalker_melee/staff_fighting/serpents_reach.json
 */

import type { Power } from '@/types';

export const SerpentsReach: Power = {
  "name": "Serpent's Reach",
  "internalName": "Serpents_Reach",
  "available": 21,
  "description": "You fully extend your staff and release a burst of energy to lash out at a distant target and deal Smashing damage with a good chance to knock your target down. This power builds one level of Perfection of Body.Notes: Serpent's Reach is unaffected by Range changes.",
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
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Stalker Archetype Sets",
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
      "type": "Smashing",
      "scale": 1.8,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 1.8,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
