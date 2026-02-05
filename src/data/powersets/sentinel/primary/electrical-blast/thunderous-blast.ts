/**
 * Thunderous Blast
 * Ranged (Targeted AoE), DMG(Energy), Foe -End, -Recovery
 *
 * Source: sentinel_ranged/electrical_blast/thunderous_blast.json
 */

import type { Power } from '@/types';

export const ThunderousBlast: Power = {
  "name": "Thunderous Blast",
  "internalName": "Thunderous_Blast",
  "available": 25,
  "description": "You hurl a tremendously powerful bolt of lightning at a target, devastating all nearby foes. Thunderous Blast deals extreme Energy and Smashing damage and drains a lot of Endurance from nearby foes.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Energy), Foe -End, -Recovery",
  "icon": "electricalbolt_thunderouseblast.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "range": 40,
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 2.93,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 2.253,
    "table": "Ranged_Damage"
  },
  "effects": {
    "enduranceDrain": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    }
  }
};
