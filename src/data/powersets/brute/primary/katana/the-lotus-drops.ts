/**
 * The Lotus Drops
 * PBAoE Melee, Moderate DMG(Lethal), Foe -Def
 *
 * Source: brute_melee/katana/whirling_sword.json
 */

import type { Power } from '@/types';

export const TheLotusDrops: Power = {
  "name": "The Lotus Drops",
  "internalName": "Whirling_Sword",
  "available": 17,
  "description": "You perform The Lotus Drops maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take moderate damage over time and reduces their Defense.",
  "shortHelp": "PBAoE Melee, Moderate DMG(Lethal), Foe -Def",
  "icon": "katana_whirlingsword.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.05,
    "radius": 8,
    "recharge": 14,
    "endurance": 13,
    "castTime": 1.83,
    "maxTargets": 10
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
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
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
      "type": "Lethal",
      "scale": 0.12,
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
      "scale": 0.054,
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
