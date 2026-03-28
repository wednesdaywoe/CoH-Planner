/**
 * Radiant Aura
 * PBAoE, Ally +Heal
 *
 * Source: controller_buff/radiation_emission/radiation_emission.json
 */

import type { Power } from '@/types';

export const RadiantAura: Power = {
  "name": "Radiant Aura",
  "internalName": "Radiation_Emission",
  "available": 0,
  "description": "You can use Radiant Aura to heal some of your wounds, and the wounds of your group. This power has a small radius, so your allies need to be near you if they wish to be affected.Recharge: Moderate.",
  "shortHelp": "PBAoE, Ally +Heal",
  "icon": "radiationpoisoning_radiationemission.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 8,
    "endurance": 13,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
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
