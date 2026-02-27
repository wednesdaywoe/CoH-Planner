/**
 * Shadow Punch
 * Melee, DMG(Smash/Negative), Foe -To Hit
 *
 * Source: brute_melee/dark_melee/shadow_punch.json
 */

import type { Power } from '@/types';

export const ShadowPunch: Power = {
  "name": "Shadow Punch",
  "internalName": "Shadow_Punch",
  "available": 0,
  "description": "You wrap your fists with Negative Energy channeled from the Netherworlds, then perform a quick punch that deals minor damage. Shadow Punches cloud the target's vision, lowering his chance to hit for a short time.",
  "shortHelp": "Melee, DMG(Smash/Negative), Foe -To Hit",
  "icon": "shadowfighting_shadowpunch.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 0.83
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
      "scale": 0.34,
      "table": "Melee_Damage"
    },
    {
      "type": "Negative",
      "scale": 0.5,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.378,
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
