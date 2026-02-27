/**
 * Follow Through
 * Melee, DMG(Smashing), Knockdown, Stun, Requires Momentum
 *
 * Source: tanker_melee/titan_weapons/follow_through.json
 */

import type { Power } from '@/types';

export const FollowThrough: Power = {
  "name": "Follow Through",
  "internalName": "Follow_Through",
  "available": 15,
  "description": "You Follow Through with a massive attack dealing Superior Smashing damage, knocking your opponent down and possibly stunning them.Notes: Follow Through requires Momentum in order to be activated.",
  "shortHelp": "Melee, DMG(Smashing), Knockdown, Stun, Requires Momentum",
  "icon": "titanweapons_followthrough.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 9,
    "recharge": 10,
    "endurance": 7.8733,
    "castTime": 1.1
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Stuns",
    "Tanker Archetype Sets",
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
      "scale": 0.882,
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
