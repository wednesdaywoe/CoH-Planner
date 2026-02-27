/**
 * Thunderous Blast
 * Ranged (Targeted AoE), DMG(Energy), Foe -End, -Recovery
 *
 * Source: blaster_ranged/electrical_blast/thunderous_blast.json
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
    "range": 60,
    "radius": 25,
    "recharge": 170,
    "endurance": 27.7316,
    "castTime": 2.93,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Endurance Modification",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 3,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "recoveryDebuff": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 6.93,
      "table": "Ranged_EndDrain"
    }
  }
};
