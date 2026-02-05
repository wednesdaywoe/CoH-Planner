/**
 * Burst
 * Ranged, DMG(Lethal), Foe -DEF
 *
 * Source: blaster_ranged/assault_rifle/burst.json
 */

import type { Power } from '@/types';

export const Burst: Power = {
  "name": "Burst",
  "internalName": "Burst",
  "available": 0,
  "description": "Quickly fires a Burst of rounds at a single target at very long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense.",
  "shortHelp": "Ranged, DMG(Lethal), Foe -DEF",
  "icon": "assaultweapons_arburst.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.05,
    "range": 90,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.27,
    "table": "Ranged_Damage",
    "duration": 0.91,
    "tickRate": 0.3
  },
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
