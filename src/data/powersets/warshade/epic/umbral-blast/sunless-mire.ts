/**
 * Sunless Mire
 * PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +To Hit
 *
 * Source: warshade/umbral-blast
 */

import type { Power } from '@/types';

export const SunlessMire: Power = {
  "name": "Sunless Mire",
  "available": 9,
  "description": "Sunless Mire can drain the essence of all nearby foes, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and chance to hit.  Damage: Light. Recharge: Long.",
  "shortHelp": "PBAoE, Light DMG(Negative), Foe -Recharge, -SPD; Self +DMG, +To Hit",
  "icon": "umbralblast_sunlessmire.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "ToHit",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Melee AoE Damage",
    "Slow Movement",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "recharge": 120,
    "endurance": 15.6,
    "castTime": 2.37,
    "radius": 15,
    "maxTargets": 10
  },
  "targetType": "Self"
};
