/**
 * Mental Blast
 * Ranged, DMG(Psionic), Target -Recharge
 *
 * Source: defender_ranged/psychic_blast/mental_blast.json
 */

import type { Power } from '@/types';

export const MentalBlast: Power = {
  "name": "Mental Blast",
  "internalName": "Mental_Blast",
  "available": 0,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.",
  "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_mentalblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.32,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
