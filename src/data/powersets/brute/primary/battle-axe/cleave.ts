/**
 * Cleave
 * Ranged, DMG(Lethal), Foe Knockdown
 *
 * Source: brute_melee/battle_axe/cleave.json
 */

import type { Power } from '@/types';

export const Cleave: Power = {
  "name": "Cleave",
  "internalName": "Cleave",
  "available": 25,
  "description": "This is an attempt to split your opponent in two with one fell swoop of your Battle Axe. It is an extremely devastating attack that deals massive damage and can knock foes to the ground. The power of this attack can actually extend a short distance through multiple foes.Notes: Cleave is unaffected by Range and Radius changes.",
  "shortHelp": "Ranged, DMG(Lethal), Foe Knockdown",
  "icon": "battleaxe_cleaveplayer.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "range": 40,
    "radius": 3,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.33,
    "maxTargets": 5
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
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 2.76,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
