/**
 * Quick Strike
 * Melee, DMG(Smash/Energy), Foe -DMG, Knockdown
 *
 * Source: scrapper_melee/kinetic_attack/quick_strike.json
 */

import type { Power } from '@/types';

export const QuickStrike: Power = {
  "name": "Quick Strike",
  "internalName": "Quick_Strike",
  "available": 0,
  "description": "A quick attack that sometimes knock foes down. Fast, but low damage.",
  "shortHelp": "Melee, DMG(Smash/Energy), Foe -DMG, Knockdown",
  "icon": "kineticattack_quickstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.63,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.21,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.7,
      "table": "Melee_Ones"
    },
    "damageDebuff": {
      "scale": 0.75,
      "table": "Melee_Debuff_Dam"
    }
  }
};
