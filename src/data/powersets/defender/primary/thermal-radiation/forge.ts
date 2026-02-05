/**
 * Forge
 * Ally +DMG, +To Hit
 *
 * Source: defender_buff/thermal_radiation/forge.json
 */

import type { Power } from '@/types';

export const Forge: Power = {
  "name": "Forge",
  "internalName": "Forge",
  "available": 17,
  "description": "Forge a single ally target into a killing machine. Forge immensely enhances a single ally's Damage and chance to hit.",
  "shortHelp": "Ally +DMG, +To Hit",
  "icon": "thermalradiation_forge.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 2.27
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Ranged_Buff_ToHit"
    },
    "damageBuff": {
      "scale": 4,
      "table": "Ranged_Buff_Dmg"
    }
  }
};
