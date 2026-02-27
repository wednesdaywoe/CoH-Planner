/**
 * Smite
 * Melee, DMG(Smash/Negative), Foe -To Hit
 *
 * Source: brute_melee/dark_melee/smite.json
 */

import type { Power } from '@/types';

export const Smite: Power = {
  "name": "Smite",
  "internalName": "Smite",
  "available": 0,
  "description": "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a Smite that deals more damage than Shadow Punch, but has a longer recharge time. Smite clouds the target's vision, lowering their chance to hit for a short time.",
  "shortHelp": "Melee, DMG(Smash/Negative), Foe -To Hit",
  "icon": "shadowfighting_smite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 0.97
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Brute Archetype Sets",
    "Melee Damage",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.32,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.594,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
