/**
 * Unchain Essence
 * Ranged (Targeted AoE Special), Superior DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const UnchainEssence: Power = {
  "name": "Unchain Essence",
  "available": 21,
  "description": "The Warshade can release the energy of a defeated foe and cause a massive Negative Energy explosion that can devastate any remaining foes. This power can only be activated by targeting a defeated foe.  Damage: Superior. Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE Special), Superior DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD",
  "icon": "umbralblast_unchainessence.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 240,
    "endurance": 26,
    "castTime": 3.17,
    "radius": 20,
    "maxTargets": 16
  },
  "targetType": "Foe (Dead)"
};
