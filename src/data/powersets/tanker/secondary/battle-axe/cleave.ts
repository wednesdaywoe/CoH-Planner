/**
 * Cleave
 * Ranged, DMG(Lethal), Foe Knockdown
 *
 * Source: tanker_melee/battle_axe/cleave.json
 */

import type { Power } from '@/types';

export const Cleave: Power = {
  "name": "Cleave",
  "internalName": "Cleave",
  "available": 29,
  "description": "This is an attempt to split your opponent in two with one fell swoop of your Battle Axe. It is an extremely devastating attack that deals massive damage and can knock foes to the ground. The power of this attack can actually extend a short distance through multiple foes.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
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
    "EnduranceReduction",
    "Recharge",
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
    "scale": 2.7601,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
