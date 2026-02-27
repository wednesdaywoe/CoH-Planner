/**
 * Slice
 * Melee (Cone), DMG(Lethal), Foe -DEF, -Res
 *
 * Source: tanker_melee/broad_sword/slice.json
 */

import type { Power } from '@/types';

export const Slice: Power = {
  "name": "Slice",
  "internalName": "Slice",
  "available": 3,
  "description": "You Slice your sword in a wide arc, attacking all enemies in front of you. Slice does less damage than Hack but can hit multiple foes and reduce their defense.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee (Cone), DMG(Lethal), Foe -DEF, -Res",
  "icon": "sword_slice.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.05,
    "range": 7,
    "radius": 7,
    "arc": 2.2689,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.83,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.2346,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.558,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Melee_Debuff_Def"
    },
    "resistanceDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Res_Dmg"
    }
  }
};
