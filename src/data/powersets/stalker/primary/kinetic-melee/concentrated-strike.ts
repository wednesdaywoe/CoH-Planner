/**
 * Concentrated Strike
 * Melee, DMG(Energy/Smash), Foe Disorient, +Special
 *
 * Source: stalker_melee/kinetic_attack/total_focus.json
 */

import type { Power } from '@/types';

export const ConcentratedStrike: Power = {
  "name": "Concentrated Strike",
  "internalName": "Total_Focus",
  "available": 25,
  "description": "Concentrated Strike is a slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Concentrated Strike, its recharge time is very long. Concentrated Strike Criticals do not result in extra damage, instead they instantly recharge the Build Up power.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Disorient, +Special",
  "icon": "kineticattack_totalfocus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.83
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
    "Stalker Archetype Sets",
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
    "damageDebuff": {
      "scale": 0.75,
      "table": "Melee_Debuff_Dam"
    }
  }
};
