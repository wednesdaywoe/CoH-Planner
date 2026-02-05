/**
 * Reconstruction
 * Self Heal, Res(Toxic)
 *
 * Source: sentinel_defense/regeneration/reconstruction.json
 */

import type { Power } from '@/types';

export const Reconstruction: Power = {
  "name": "Reconstruction",
  "internalName": "Reconstruction",
  "available": 0,
  "description": "Through perfect control of your body, you can concentrate for a few moments and heal yourself. The effects of Reconstruction also leaves you resistant to Toxic damage for a while.",
  "shortHelp": "Self Heal, Res(Toxic)",
  "icon": "regeneration_reconstruction.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    }
  }
};
