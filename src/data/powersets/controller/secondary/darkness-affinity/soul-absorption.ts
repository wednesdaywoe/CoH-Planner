/**
 * Soul Absorption
 * PBAoE Team +Regen, +Recovery, Foe -To Hit
 *
 * Source: controller_buff/darkness_affinity/soul_absorption.json
 */

import type { Power } from '@/types';

export const SoulAbsorption: Power = {
  "name": "Soul Absorption",
  "internalName": "Soul_Absorption",
  "available": 23,
  "description": "You drain the essence of both nearby conscious and defeated foes to cause you and your allies to regenerate and recovery much more quickly. The more defeated foes affected, the more powerful the regeneration and recovery effect will be.",
  "shortHelp": "PBAoE Team +Regen, +Recovery, Foe -To Hit",
  "icon": "darknessaffinity_soulabsorption.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "radius": 20,
    "recharge": 160,
    "castTime": 3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Endurance Modification",
    "Healing",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_SoulAbsorptionBuff",
      "duration": 1
    },
    "tohitDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
