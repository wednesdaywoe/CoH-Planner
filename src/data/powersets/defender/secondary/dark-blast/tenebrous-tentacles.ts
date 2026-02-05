/**
 * Tenebrous Tentacles
 * Ranged (Cone), DMG(Negative), Foe Immobilize, -To Hit
 *
 * Source: defender_ranged/dark_blast/tenebrous_tentacles.json
 */

import type { Power } from '@/types';

export const TenebrousTentacles: Power = {
  "name": "Tenebrous Tentacles",
  "internalName": "Tenebrous_Tentacles",
  "available": 15,
  "description": "You can create a cone shaped rift to the Netherworld that allows its native creatures to slip their oily Tentacles into our reality. These creatures will snare all foes within range, Immobilizing them while the Tentacles drain their life and reduce their chance to hit.",
  "shortHelp": "Ranged (Cone), DMG(Negative), Foe Immobilize, -To Hit",
  "icon": "darkcast_tenebroustentacles.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 40,
    "arc": 0.6981,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67,
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
    "Defender Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Negative",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 7.1,
      "tickRate": 1
    },
    {
      "type": "Negative",
      "scale": 0.135,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
