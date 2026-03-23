/**
 * World of Confusion
 * Toggle: PBAoE, Minor DoT(Psionic), Foe Confuse
 *
 * Source: blaster_support/mental_manipulation/world_of_confusion.json
 */

import type { Power } from '@/types';

export const WorldofConfusion: Power = {
  "name": "World of Confusion",
  "internalName": "World_of_Confusion",
  "available": 3,
  "description": "This toggle power allows you to cause psionic damage and cause confusion within a group of foes, creating chaos. The chance of confusing an enemy is lower than then chance of damaging them, and it may take multiple hits to affect stronger opponents. All affected foes within the area will turn and attack each other, ignoring all heroes. You will not receive any Experience Points for foes defeated by Confused enemies.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Psionic), Foe Confuse",
  "icon": "mentalcontrol_worldofconfusion.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 10,
    "endurance": 0.52,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Confuse",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Confuse",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.12,
    "table": "Ranged_Damage",
    "tickRate": 2
  },
  "effects": {
    "confuse": {
      "mag": 2,
      "scale": 1.5,
      "table": "Ranged_Ones"
    }
  }
};
