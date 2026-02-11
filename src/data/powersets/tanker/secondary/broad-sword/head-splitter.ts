/**
 * Head Splitter
 * Melee, DMG(Lethal), Foe Knockback, -DEF
 *
 * Source: tanker_melee/broad_sword/head_splitter.json
 */

import type { Power } from '@/types';

export const HeadSplitter: Power = {
  "name": "Head Splitter",
  "internalName": "Head_Splitter",
  "available": 29,
  "description": "You perform a devastating Head Splitter attack that deals a massive amount of damage and can even knock a foe down to the ground and reduce its Defense. The power of this attack can actually extend a short distance through multiple foes.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee, DMG(Lethal), Foe Knockback, -DEF",
  "icon": "sword_headsplitter.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 10,
    "radius": 10,
    "arc": 1.5708,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.33,
    "maxTargets": 3
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
    "Melee AoE Damage",
    "Tanker Archetype Sets",
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
