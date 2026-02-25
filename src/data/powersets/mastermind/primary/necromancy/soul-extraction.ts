/**
 * Soul Extraction
 * Summon Ghost (Special)
 *
 * Source: mastermind_summon/necromancy/soul_extraction.json
 */

import type { Power } from '@/types';

export const SoulExtraction: Power = {
  "name": "Soul Extraction",
  "internalName": "Soul_Extraction",
  "available": 17,
  "description": "You can extract the souls from your Undead Henchmen and summon their spectral essence to do your bidding. The power of each soul is dependent upon the type of undead Henchman you extract it from, however it will always be one level lower than you. Unlike your other Henchman, these extracted Souls are only loosely bound to your control and will quickly move on to the next world. These Souls cannot gain new powers with Enchanted Undead or Dark Empowerment. If a Soul's original body is defeated then the Soul will also be defeated. If you activate Soul Extraction again while a Soul is active, it will simply be replaced.",
  "shortHelp": "Summon Ghost (Special)",
  "icon": "necromancy_soulextraction.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 80,
    "recharge": 150,
    "endurance": 15,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Accurate To-Hit Debuff",
    "Healing",
    "Holds",
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
