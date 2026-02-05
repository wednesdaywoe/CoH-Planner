/**
 * Whirling Hands
 * PBAoE Melee, DMG(Smash/Energy)
 *
 * Source: brute_melee/energy_melee/whirling_hands.json
 */

import type { Power } from '@/types';

export const WhirlingHands: Power = {
  "name": "Whirling Hands",
  "internalName": "Whirling_Hands",
  "available": 7,
  "description": "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be Disoriented as well.",
  "shortHelp": "PBAoE Melee, DMG(Smash/Energy)",
  "icon": "powerpunch_flurry.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 14,
    "endurance": 13,
    "castTime": 2.5,
    "maxTargets": 10
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
    "Melee AoE Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.4964,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 0.6855,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.5318,
      "table": "Melee_Damage"
    }
  ]
};
