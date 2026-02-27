/**
 * Fire Sword Circle
 * PBAoE Melee, DMG(Fire), -Defense
 *
 * Source: tanker_melee/fiery_melee/fire_sword_circle.json
 */

import type { Power } from '@/types';

export const FireSwordCircle: Power = {
  "name": "Fire Sword Circle",
  "internalName": "Fire_Sword_Circle",
  "available": 23,
  "description": "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash burn and cut through the defenses of your enemies, dealing moderate damage and setting them ablaze.Notes: Thanks to gauntlet, this power can hit up to 6 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "PBAoE Melee, DMG(Fire), -Defense",
  "icon": "fieryfray_fireswordcircle.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.67,
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
    "Defense Debuff",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
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
