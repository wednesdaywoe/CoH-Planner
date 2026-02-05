/**
 * Total Focus
 * Melee, Extreme DMG(Energy/Smash), Foe Disorient
 *
 * Source: blaster_support/energy_manipulation/total_focus.json
 */

import type { Power } from '@/types';

export const TotalFocus: Power = {
  "name": "Total Focus",
  "internalName": "Total_Focus",
  "available": 29,
  "description": "Total Focus is complete mastery over Energy Melee. This is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Melee, Extreme DMG(Energy/Smash), Foe Disorient",
  "icon": "energymanipulation_totalfocus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
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
    "Blaster Archetype Sets",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.56,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Immobilize"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
