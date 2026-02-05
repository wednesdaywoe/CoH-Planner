/**
 * Head Splitter
 * Melee, DMG(Lethal), Foe Knockback, -DEF
 *
 * Source: brute_melee/broad_sword/head_splitter.json
 */

import type { Power } from '@/types';

export const HeadSplitter: Power = {
  "name": "Head Splitter",
  "internalName": "Head_Splitter",
  "available": 25,
  "description": "You perform a devastating Head Splitter attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce its Defense. The power of this attack can actually extend a short distance through multiple foes.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockback, -DEF",
  "icon": "sword_headsplitter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 10,
    "radius": 10,
    "arc": 0.3491,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.33,
    "maxTargets": 5
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
    "Knockback",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 2.6,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 1.17,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
