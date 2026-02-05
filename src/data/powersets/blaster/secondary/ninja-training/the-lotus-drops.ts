/**
 * The Lotus Drops
 * PBAoE Melee, Moderate DMG(Lethal), Foe -Def
 *
 * Source: blaster_support/ninja_training/the_lotus_drops.json
 */

import type { Power } from '@/types';

export const TheLotusDrops: Power = {
  "name": "The Lotus Drops",
  "internalName": "The_Lotus_Drops",
  "available": 15,
  "description": "You perform The Lotus Drops maneuver, attacking all foes in melee range. This attack wounds your opponents, causing them to take moderate damage over time and reduces their Defense.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Moderate DMG(Lethal), Foe -Def",
  "icon": "ninjatools_katanaaoe.png",
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
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
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
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
