/**
 * Dark Obliteration
 * Ranged (Targeted AoE), DMG(Negative), Foe -ACC
 *
 * Source: sentinel_ranged/dark_blast/dark_obliteration.json
 */

import type { Power } from '@/types';

export const DarkObliteration: Power = {
  "name": "Dark Obliteration",
  "internalName": "Dark_Obliteration",
  "available": 11,
  "description": "You hurl a large blast of negative energy that violently explodes on impact, exposing the dark power of the Netherworld to all foes near the target. Dark Obliteration can reduce the Accuracy of all affected targets.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Negative), Foe -ACC",
  "icon": "darkcast_darkobliteration.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.9,
    "table": "Melee_Damage"
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
