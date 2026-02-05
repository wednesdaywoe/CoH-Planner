/**
 * Disembowel
 * Melee, DMG(Lethal), Knockup, Foe -DEF
 *
 * Source: tanker_melee/broad_sword/disembowel.json
 */

import type { Power } from '@/types';

export const Disembowel: Power = {
  "name": "Disembowel",
  "internalName": "Disembowel",
  "available": 27,
  "description": "You perform a powerful Disemboweling maneuver that deals a great amount of damage, and can knock a target up into the air. This attack can reduce a target's Defense, making him easier to hit.",
  "shortHelp": "Melee, DMG(Lethal), Knockup, Foe -DEF",
  "icon": "sword_disembowel.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.8
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
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
    "knockup": {
      "scale": 2,
      "table": "Melee_Knockback"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
