/**
 * Total Focus
 * Melee, DMG(Smash/Energy), Foe Disorient, +Energy Focus
 *
 * Source: scrapper_melee/energy_melee/total_focus.json
 */

import type { Power } from '@/types';

export const TotalFocus: Power = {
  "name": "Total Focus",
  "internalName": "Total_Focus",
  "available": 21,
  "description": "Total Focus is complete mastery over Energy Melee. This melee attack is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. This power will enter Energy Focus mode. Total Focus Criticals do not result in double damage, instead it grants double Energy Focus.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe Disorient, +Energy Focus",
  "icon": "powerpunch_totalfocus.png",
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
    "Melee Damage",
    "Scrapper Archetype Sets",
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
    },
    {
      "type": "Fire",
      "scale": 1.602,
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
