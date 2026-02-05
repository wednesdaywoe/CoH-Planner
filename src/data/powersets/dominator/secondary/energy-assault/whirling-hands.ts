/**
 * Whirling Hands
 * PBAoE Melee, Light DMG(Smash/Energy), Special
 *
 * Source: dominator_assault/energy_assault/whirling_hands.json
 */

import type { Power } from '@/types';

export const WhirlingHands: Power = {
  "name": "Whirling Hands",
  "internalName": "Whirling_Hands",
  "available": 19,
  "description": "By focusing your energy into the muscles in your arms, you can launch a dizzying flurry of attacks against every foe in melee range. Some foes may be hit hard enough to be Disoriented as well. This power will recharge instantly if used while in Energy Focus mode.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Smash/Energy), Special",
  "icon": "energyassault_whirlinghands.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
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
    "Dominator Archetype Sets",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.4601,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.6901,
      "table": "Melee_Damage"
    }
  ]
};
