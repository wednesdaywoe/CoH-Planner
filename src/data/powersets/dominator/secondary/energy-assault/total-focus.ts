/**
 * Total Focus
 * Melee, Extreme DMG(Energy/Smash), Foe Disorient, +Energy Focus
 *
 * Source: dominator_assault/energy_assault/total_focus.json
 */

import type { Power } from '@/types';

export const TotalFocus: Power = {
  "name": "Total Focus",
  "internalName": "Total_Focus",
  "available": 23,
  "description": "Total Focus is complete mastery over Energy Melee. This melee attack is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. This power will enter Energy Focus mode.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Energy/Smash), Foe Disorient, +Energy Focus",
  "icon": "energyassault_totalfocus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 22,
    "endurance": 20.176,
    "castTime": 2.53
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
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.552,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.328,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    }
  }
};
