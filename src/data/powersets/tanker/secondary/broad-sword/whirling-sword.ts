/**
 * Whirling Sword
 * PBAoE Melee, DMG(Lethal), Foe -Def
 *
 * Source: tanker_melee/broad_sword/whirling_sword.json
 */

import type { Power } from '@/types';

export const WhirlingSword: Power = {
  "name": "Whirling Sword",
  "internalName": "Whirling_Sword",
  "available": 23,
  "description": "You perform a Whirling Sword maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take minor damage over time and reduces their defense.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Lethal), Foe -Def",
  "icon": "sword_whirlingsword.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.67,
    "maxTargets": 10
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
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.4218,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.45,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.045,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
