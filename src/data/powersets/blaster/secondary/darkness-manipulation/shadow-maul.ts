/**
 * Shadow Maul
 * Melee (Cone), Superior DoT(Smash/Negative), Foe -To Hit
 *
 * Source: blaster_support/darkness_manipulation/shadow_maul.json
 */

import type { Power } from '@/types';

export const ShadowMaul: Power = {
  "name": "Shadow Maul",
  "internalName": "Shadow_Maul",
  "available": 9,
  "description": "You wrap your entire arms with Negative Energy channeled from the Netherworlds, then perform a series of blows that deal a lot of damage over a short period of time to multiple targets in front of you. These blows cloud your target's vision, lowering his chance to hit for a short time.",
  "shortHelp": "Melee (Cone), Superior DoT(Smash/Negative), Foe -To Hit",
  "icon": "darknessmanipulation_shadowmaul.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 0.7854,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 3.07,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.325,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.625
    },
    {
      "type": "Negative",
      "scale": 0.325,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 0.625
    }
  ],
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Melee_DeBuff_ToHit"
    },
    "damageBuff": {
      "scale": 0.163,
      "table": "Melee_Ones"
    }
  }
};
