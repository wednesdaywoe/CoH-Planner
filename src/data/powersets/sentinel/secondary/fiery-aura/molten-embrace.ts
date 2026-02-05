/**
 * Molten Embrace
 * Toggle: +Dmg, +Special
 *
 * Source: sentinel_defense/fiery_aura/molten_embrace.json
 */

import type { Power } from '@/types';

export const MoltenEmbrace: Power = {
  "name": "Molten Embrace",
  "internalName": "Molten_Embrace",
  "available": 0,
  "description": "Molten Embrace superheats your attacks, increasing the damage they inflict. In addition, all your attacks will have a chance to inflict fire damage over time.Recharge: Moderate.",
  "shortHelp": "Toggle: +Dmg, +Special",
  "icon": "flamingshield_fieryembrace.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 0.73
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 1,
      "table": "Melee_Buff_Dmg"
    }
  }
};
