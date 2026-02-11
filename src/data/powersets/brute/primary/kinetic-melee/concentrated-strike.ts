/**
 * Concentrated Strike
 * Melee, DMG(Energy/Smash), Foe Disorient
 *
 * Source: brute_melee/kinetic_attack/total_focus.json
 */

import type { Power } from '@/types';

export const ConcentratedStrike: Power = {
  "name": "Concentrated Strike",
  "internalName": "Total_Focus",
  "available": 25,
  "description": "Concentrated Strike is a slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Concentrated Strike, its recharge time is very long.",
  "shortHelp": "Melee, DMG(Energy/Smash), Foe Disorient",
  "icon": "kineticattack_totalfocus.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.67
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
    "Melee Damage",
    "Stuns",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 2.56,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 1,
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
    },
    "damageDebuff": {
      "scale": 0.7,
      "table": "Melee_Debuff_Dam"
    }
  }
};
