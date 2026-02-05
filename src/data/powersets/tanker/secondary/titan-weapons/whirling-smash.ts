/**
 * Whirling Smash
 * PBAoE Melee, DMG(Smashing), Knockdown, Requires Momentum
 *
 * Source: tanker_melee/titan_weapons/whirling_slice.json
 */

import type { Power } from '@/types';

export const WhirlingSmash: Power = {
  "name": "Whirling Smash",
  "internalName": "Whirling_Slice",
  "available": 27,
  "description": "You perform a powerful Whirling Smash that deals Moderate Smashing damage, and can knock an opponent down.Notes: Whirling Smash requires Momentum in order to be activated.Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Smashing), Knockdown, Requires Momentum",
  "icon": "titanweapons_whirlingslice.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 14,
    "endurance": 10.4644,
    "castTime": 1,
    "maxTargets": 10
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
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.04,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.6727,
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
