/**
 * Mental Blast
 * Ranged, DMG(Psionic), Target -Recharge
 *
 * Source: blaster_ranged/psychic_blast/mental_blast.json
 */

import type { Power } from '@/types';

export const MentalBlast: Power = {
  "name": "Mental Blast",
  "internalName": "Mental_Blast",
  "available": 0,
  "description": "This basic attack does high Psionic damage, and can slightly reduce a target's attack speed.",
  "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_mentalblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 8,
    "endurance": 8.528,
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
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.64,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
