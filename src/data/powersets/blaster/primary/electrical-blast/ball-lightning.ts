/**
 * Ball Lightning
 * Ranged (Targeted AoE), DoT(Energy), Foe -End
 *
 * Source: blaster_ranged/electrical_blast/ball_lightning.json
 */

import type { Power } from '@/types';

export const BallLightning: Power = {
  "name": "Ball Lightning",
  "internalName": "Ball_Lightning",
  "available": 1,
  "description": "Hurls a highly charged ball of lightning that explodes on contact. Ball Lightning deals good damage in an area of effect, and drains some Endurance from each target it hits.",
  "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe -End",
  "icon": "electricalbolt_balllightning.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.07,
    "maxTargets": 16
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
    "Endurance Modification",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.9,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.045,
      "table": "Ranged_Damage",
      "duration": 2.2,
      "tickRate": 0.6
    }
  ],
  "effects": {
    "enduranceDrain": {
      "scale": 0.07,
      "table": "Ranged_EndDrain"
    }
  }
};
