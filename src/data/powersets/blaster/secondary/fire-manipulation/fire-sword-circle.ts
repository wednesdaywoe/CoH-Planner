/**
 * Fire Sword Circle
 * PBAoE Melee, DMG(Fire/Lethal)
 *
 * Source: blaster_support/fire_manipulation/fire_sword_circle.json
 */

import type { Power } from '@/types';

export const FireSwordCircle: Power = {
  "name": "Fire Sword Circle",
  "internalName": "Fire_Sword_Circle",
  "available": 9,
  "description": "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash and burn your enemies, dealing minor damage and setting them ablaze.",
  "shortHelp": "PBAoE Melee, DMG(Fire/Lethal)",
  "icon": "firemanipulation_fireswordcircle.png",
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
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.755,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.755,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2.1,
      "tickRate": 0.75
    }
  ],
  "effects": {
    "damageBuff": {
      "scale": 0.07,
      "table": "Melee_Ones"
    }
  }
};
