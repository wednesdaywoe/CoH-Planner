/**
 * Night Fall
 * Ranged (Cone), DMG(Negative), Foe -To Hit
 *
 * Source: defender_ranged/dark_blast/night_fall.json
 */

import type { Power } from '@/types';

export const NightFall: Power = {
  "name": "Night Fall",
  "internalName": "Night_Fall",
  "available": 19,
  "description": "Unleashes a cone shaped burst of particles from the Netherworld. All targets within the modest range of this power take Negative Energy damage and have a reduced chance to hit.",
  "shortHelp": "Ranged (Cone), DMG(Negative), Foe -To Hit",
  "icon": "darkcast_nightfall.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 60,
    "arc": 0.3491,
    "recharge": 10,
    "endurance": 13.104,
    "castTime": 2,
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
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Negative",
    "scale": 0.11,
    "table": "Ranged_Damage",
    "duration": 2.8,
    "tickRate": 0.3
  },
  "effects": {
    "tohitDebuff": {
      "scale": 0.75,
      "table": "Ranged_Debuff_ToHit"
    }
  }
};
