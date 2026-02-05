/**
 * Vortex
 * Summon Vortex
 *
 * Source: controller_control/wind_control/vortex.json
 */

import type { Power } from '@/types';

export const Vortex: Power = {
  "name": "Vortex",
  "internalName": "Vortex",
  "available": 25,
  "description": "You can create a true Vortex cloud to assist you in battle. This Vortex will build Pressure along with you as you use your powers. This will allow its attacks to have a chance, proportional to current pressure, for critical damage. However, at higher pressures, the Vortex will be unable to use some of its powers. The Manipulation of Pressure on this pet through the use of Vacuum upon it will grant you the Clear Skies buff. Both this power and Vacuum are required to automatically unlock Clear Skies.Recharge: Long.",
  "shortHelp": "Summon Vortex",
  "icon": "windcontrol_vortex.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 240,
    "endurance": 20.8,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Slow Movement",
    "Stuns",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_WindControl_Vortex_Controller"
    }
  },
  "requires": "char>accesslevel >= 0"
};
