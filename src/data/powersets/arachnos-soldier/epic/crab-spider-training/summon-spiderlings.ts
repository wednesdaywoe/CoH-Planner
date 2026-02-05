/**
 * Summon Spiderlings
 * Summon Spiderlings: Ranged Moderate DMG(Lethal)
 *
 * Source: arachnos-soldier/crab-spider-training
 */

import type { Power } from '@/types';

export const SummonSpiderlings: Power = {
  "name": "Summon Spiderlings",
  "available": 27,
  "description": "As a Crab Spider you have access to a small squadron of Arachnobot Spiderlings. Three Spiderlings that are two levels less than you will show up when summoned.",
  "shortHelp": "Summon Spiderlings: Ranged Moderate DMG(Lethal)",
  "icon": "crabspidertraining_summonspiderlings.png",
  "powerType": "Click",
  "effectArea": "Location",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 600,
    "endurance": 26,
    "castTime": 2.03
  },
  "targetType": "Location"
};
