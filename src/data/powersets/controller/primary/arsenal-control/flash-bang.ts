/**
 * Flash Bang
 * Ranged (Targeted AoE), DMG(Energy), Disorient, -To Hit
 *
 * Source: controller_control/arsenal_control/flash_bang.json
 */

import type { Power } from '@/types';

export const FlashBang: Power = {
  "name": "Flash Bang",
  "internalName": "Flash_Bang",
  "available": 17,
  "description": "The Flash Bang Grenade is ideal to disorient a group of enemies. Even enemies that are not disoriented will have their chance to hit reduced.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Disorient, -To Hit",
  "icon": "arsenalcontrol_flashbang.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.85,
    "range": 70,
    "radius": 25,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.87,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Controller Archetype Sets",
    "Ranged AoE Damage",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 0.25,
    "table": "Ranged_Damage"
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.5,
      "table": "Ranged_Debuff_ToHit"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
    }
  }
};
