/**
 * Spectral Wounds
 * Ranged, DMG(Psionic/Special), +Special
 *
 * Source: controller_control/illusion_control/spectral_wounds.json
 */

import type { Power } from '@/types';

export const SpectralWounds: Power = {
  "name": "Spectral Wounds",
  "internalName": "Spectral_Wounds",
  "available": 0,
  "description": "Spectral Wounds convinces the target that they have taken severe damage. The illusion is so convincing that the victim can fall from the Spectral Wounds. However, the damage is not real, and if the victim survives long enough, the illusion will fade and some of the wounds will heal.",
  "shortHelp": "Ranged, DMG(Psionic/Special), +Special",
  "icon": "illusions_spectralwounds.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.07
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
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Psionic",
      "scale": 1.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Special",
      "scale": -0.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Psionic",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0,
        "table": "Ranged_Ones"
      }
    }
  }
};
