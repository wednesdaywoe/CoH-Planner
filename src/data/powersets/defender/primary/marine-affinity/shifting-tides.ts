/**
 * Shifting Tides
 * Toggle: Ranged (Targeted AoE), Team +DMG, +ToHit, +Recharge, Special Damage
 *
 * Source: defender_buff/marine_affinity/shifting_tides.json
 */

import type { Power } from '@/types';

export const ShiftingTides: Power = {
  "name": "Shifting Tides",
  "internalName": "Shifting_Tides",
  "available": 17,
  "description": "Select either a friend or foe to create a field of shifting tides around them.When attacked, foes within the shifting tides will provide you and your allies a stacking Rising Tide buff that increases ToHit, Damage, and Recharge. Enemies may also take bonus damage, with the odds increasing per stack.",
  "shortHelp": "Toggle: Ranged (Targeted AoE), Team +DMG, +ToHit, +Recharge, Special Damage",
  "icon": "marineaffinity_shiftingtides.png",
  "powerType": "Toggle",
  "targetType": "Any",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 25,
    "recharge": 15,
    "endurance": 0.078,
    "castTime": 1.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "ToHit"
  ],
  "allowedSetCategories": [
    "Defender Archetype Sets",
    "Ranged AoE Damage",
    "To Hit Buff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.5,
    "table": "Ranged_Damage"
  },
  "effects": {
    "damageBuff": {
      "scale": 0.24,
      "table": "Ranged_Buff_Dmg"
    },
    "tohitBuff": {
      "scale": 0.08,
      "table": "Ranged_Buff_ToHit"
    },
    "rechargeBuff": {
      "scale": 0.02,
      "table": "Melee_Ones"
    }
  }
};
