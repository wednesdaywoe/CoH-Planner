/**
 * Follow Through
 * Melee, DMG(Smashing), Knockdown, Stun, Requires Momentum
 *
 * Source: brute_melee/titan_weapons/follow_through.json
 */

import type { Power } from '@/types';

export const FollowThrough: Power = {
  "name": "Follow Through",
  "internalName": "Follow_Through",
  "available": 7,
  "description": "You Follow Through with a massive attack dealing Superior Smashing damage, knocking your opponent down and possibly stunning them.Notes: Follow Through requires Momentum in order to be activated.",
  "shortHelp": "Melee, DMG(Smashing), Knockdown, Stun, Requires Momentum",
  "icon": "titanweapons_followthrough.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 9,
    "recharge": 10,
    "endurance": 10.4978,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.96,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.9702,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 3,
      "scale": 4,
      "table": "Melee_Stun"
    }
  }
};
