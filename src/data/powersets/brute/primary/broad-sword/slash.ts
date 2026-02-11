/**
 * Slash
 * Melee, DMG(Lethal), Foe -DEF
 *
 * Source: brute_melee/broad_sword/slash.json
 */

import type { Power } from '@/types';

export const Slash: Power = {
  "name": "Slash",
  "internalName": "Slash",
  "available": 0,
  "description": "You perform a quick Slash that can reduce a target's Defense, making him easier to hit. This attack causes moderate damage, but has a quick recharge time.",
  "shortHelp": "Melee, DMG(Lethal), Foe -DEF",
  "icon": "sword_slash.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.1
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
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.45,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
