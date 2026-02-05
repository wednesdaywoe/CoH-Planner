/**
 * Soothing Wave
 * Ranged (Facing Cone), Foe -DMG, Team Heal
 *
 * Source: defender_buff/marine_affinity/soothing_wave.json
 */

import type { Power } from '@/types';

export const SoothingWave: Power = {
  "name": "Soothing Wave",
  "internalName": "Soothing_Wave",
  "available": 0,
  "description": "Send forth a calming wave of water, washing over friend and foe alike. Allies will be healed by this power, while enemies will have their offensive power watered down.",
  "shortHelp": "Ranged (Facing Cone), Foe -DMG, Team Heal",
  "icon": "marineaffinity_soothingwave.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 45,
    "radius": 45,
    "arc": 1.5708,
    "recharge": 10,
    "endurance": 13.52,
    "castTime": 2,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 1,
    "table": "Ranged_Heal"
  }
};
