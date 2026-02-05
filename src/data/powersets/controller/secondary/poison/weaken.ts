/**
 * Weaken
 * Ranged (Targeted AoE) Foe -DMG -To Hit, -Special
 *
 * Source: controller_buff/poison/weaken.json
 */

import type { Power } from '@/types';

export const Weaken: Power = {
  "name": "Weaken",
  "internalName": "Weaken",
  "available": 3,
  "description": "You poison a single foe with a venom that significantly Weakens their strength and and that of nearby foes. The affected primary target's chance to hit and Damage output is severely reduced Additionally, the affected targets secondary power effects are all weakened. The targets power effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all weakened. Secondary foes struck by this power will have a lesser effect placed on them while the primary target receives the full effectiveness of the power.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE) Foe -DMG -To Hit, -Special",
  "icon": "poison_weakenaoe.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 8,
    "recharge": 16,
    "endurance": 10.4,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "damageDebuff": {
      "scale": 1.5,
      "table": "Ranged_Debuff_Dam"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
