/**
 * Tremor
 * PBAoE, DMG(Smash), Knockback
 *
 * Source: tanker_melee/stone_melee/tremor.json
 */

import type { Power } from '@/types';

export const Tremor: Power = {
  "name": "Tremor",
  "internalName": "Tremor",
  "available": 23,
  "description": "You can cause a localized earthquake immediately around you. This will deal moderate damage to every foe in melee range, while knocking them back.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE, DMG(Smash), Knockback",
  "icon": "stonemelee_tremor.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.53,
    "maxTargets": 10
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
    "Knockback",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1.04,
    "table": "Melee_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
