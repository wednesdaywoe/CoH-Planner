/**
 * Fire Sword Circle
 * PBAoE Melee, DMG(Fire), -Defense
 *
 * Source: brute_melee/fiery_melee/fire_sword_circle.json
 */

import type { Power } from '@/types';

export const FireSwordCircle: Power = {
  "name": "Fire Sword Circle",
  "internalName": "Fire_Sword_Circle",
  "available": 21,
  "description": "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash burn and cut through the defenses of your enemies, dealing moderate damage and setting them ablaze.",
  "shortHelp": "PBAoE Melee, DMG(Fire), -Defense",
  "icon": "fieryfray_fireswordcircle.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
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
    "Brute Archetype Sets",
    "Defense Debuff",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Fire",
      "scale": 1.424,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 0.5,
      "table": "Melee_Debuff_Def"
    }
  }
};
