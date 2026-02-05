/**
 * Bash
 * Melee, DMG(Smash), Minor Disorient
 *
 * Source: scrapper_melee/war_mace/bash.json
 */

import type { Power } from '@/types';

export const Bash: Power = {
  "name": "Bash",
  "internalName": "Bash",
  "available": 0,
  "description": "You perform a Bashing attack with your mace that deals moderate damage, and can sometimes Disorient your opponent.",
  "shortHelp": "Melee, DMG(Smash), Minor Disorient",
  "icon": "mace_bash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.33
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
      "type": "Fire",
      "scale": 0.45,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "stun": {
      "mag": 2,
      "scale": 5,
      "table": "Melee_Stun"
    }
  }
};
