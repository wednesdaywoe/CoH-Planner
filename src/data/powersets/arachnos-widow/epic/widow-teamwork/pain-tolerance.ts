/**
 * Pain Tolerance
 * Auto: Self Res (All DMG but Psi), +MaxHealth
 *
 * Source: arachnos-widow/widow-teamwork
 */

import type { Power } from '@/types';

export const PainTolerance: Power = {
  "name": "Pain Tolerance",
  "available": 0,
  "description": "Night Widows who possess Pain Tolerance are resistant to most damage types, and gain additional hit points. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self Res (All DMG but Psi), +MaxHealth",
  "icon": "widowteamwork_paintolerance.png",
  "powerType": "Auto",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Resistance",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "stats": {
    "accuracy": 1
  },
  "targetType": "Self"
};
