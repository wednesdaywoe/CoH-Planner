/**
 * Mental Blast
 * Ranged, Light DMG(Psionic), Target -Recharge
 *
 * Source: sentinel_ranged/psychic_blast/mental_blast.json
 */

import type { Power } from '@/types';

export const MentalBlast: Power = {
  "name": "Mental Blast",
  "internalName": "Mental_Blast",
  "available": 0,
  "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Psionic), Target -Recharge",
  "icon": "psychicblast_mentalblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 75,
    "recharge": 4,
    "endurance": 5.2,
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
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
