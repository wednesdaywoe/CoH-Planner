/**
 * Dark Extraction
 * Summon Essence: Ranged Moderate DMG (Negative)
 *
 * Source: warshade_offensive/umbral_blast/dark_extraction.json
 */

import type { Power } from '@/types';

export const DarkExtraction: Power = {
  "name": "Dark Extraction",
  "available": 23,
  "description": "Defeated foes are ripe for the picking. A Warshade can extract the essence from a defeated villain and infuse it with Nictus energy. The extracted energy is an echo of the target's life force, and although it is not sentient, the infused Nictus energy does give it a rudimentary spark of life. Eventually, the extracted entity will fade away into nothingness.  Recharge: Long.",
  "shortHelp": "Summon Essence: Ranged Moderate DMG (Negative)",
  "icon": "umbralblast_darkextraction.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 240,
    "endurance": 26,
    "castTime": 3.2
  },
  "targetType": "Foe (Dead)",
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Warshade_Extraction",
      "copyBoosts": true
    }
  }
};
