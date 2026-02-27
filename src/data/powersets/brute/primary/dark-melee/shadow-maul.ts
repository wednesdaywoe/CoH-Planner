/**
 * Shadow Maul
 * Melee (Cone), DoT(Smash/Negative), Foe -To Hit
 *
 * Source: brute_melee/dark_melee/shadow_maul.json
 */

import type { Power } from '@/types';

export const ShadowMaul: Power = {
  "name": "Shadow Maul",
  "internalName": "Shadow_Maul",
  "available": 1,
  "description": "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering his chance to hit for a short time.",
  "shortHelp": "Melee (Cone), DoT(Smash/Negative), Foe -To Hit",
  "icon": "shadowfighting_shadowmaul.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 2.0944,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 2.37,
    "maxTargets": 5
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
    "Melee AoE Damage",
    "Threat Duration",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.2023,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.625
    },
    {
      "type": "Negative",
      "scale": 0.2023,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.625
    },
    {
      "type": "Fire",
      "scale": 0.1821,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.625
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    }
  }
};
