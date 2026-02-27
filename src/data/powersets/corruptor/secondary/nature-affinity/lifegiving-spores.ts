/**
 * Lifegiving Spores
 * Toggle (Location AoE), PBAoE +Minor Heal Over Time, +Endurance
 *
 * Source: corruptor_buff/nature_affinity/lifegiving_spores.json
 */

import type { Power } from '@/types';

export const LifegivingSpores: Power = {
  "name": "Lifegiving Spores",
  "internalName": "Lifegiving_Spores",
  "available": 15,
  "description": "When activating this power you cause all allies at a selected location to recover a small amount of health and endurance every few seconds as long as they remain within the Lifegiving Spores.Recharge: Fast.",
  "shortHelp": "Toggle (Location AoE), PBAoE +Minor Heal Over Time, +Endurance",
  "icon": "natureaffinity_lifegivingspores.png",
  "powerType": "Toggle",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 4,
    "endurance": 0.26,
    "castTime": 2.33
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "LIfegiving Spores",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Pets.Lifegiving_Spores.Lifegiving_Spores"
      ]
    }
  }
};
