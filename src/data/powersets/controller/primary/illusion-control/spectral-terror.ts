/**
 * Spectral Terror
 * Summon Terror: Ranged Fear, -ToHit
 *
 * Source: controller_control/illusion_control/spectral_terror.json
 */

import type { Power } from '@/types';

export const SpectralTerror: Power = {
  "name": "Spectral Terror",
  "internalName": "Spectral_Terror",
  "available": 21,
  "description": "You can create an illusion of unspeakable Terror. The manifestation is so horrible that it caused most foes to tremble helplessly in terror. The Spectral Terror may also Terrify individual foes, causing them to run away in panic.",
  "shortHelp": "Summon Terror: Ranged Fear, -ToHit",
  "icon": "illusions_spectralterror.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 45,
    "endurance": 16.64,
    "castTime": 3.2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Controller Archetype Sets",
    "Fear",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Terror",
      "duration": 45
    }
  }
};
