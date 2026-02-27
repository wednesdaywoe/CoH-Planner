/**
 * Power of the Depths
 * PBAoE, Team +MaxHP, +MaxEnd, +Regen, +Range
 *
 * Source: defender_buff/marine_affinity/call_depths.json
 */

import type { Power } from '@/types';

export const PoweroftheDepths: Power = {
  "name": "Power of the Depths",
  "internalName": "Call_Depths",
  "available": 25,
  "description": "Becoming a conduit of the ocean itself, you acclimate your allies to the incredible forces of the deep! This boosts the maximum hit points, maximum endurance, regeneration, and attack range of all nearby allies. Some of these effects will decay over time to a lower value.If Power of the Depths is activated inside a Tide Pool, the marine life present will be thrown into a brief frenzy! While frenzied, the Tide Pool has a chance to knock over enemies and the damage buff and debuff is stronger.",
  "shortHelp": "PBAoE, Team +MaxHP, +MaxEnd, +Regen, +Range",
  "icon": "marineaffinity_powerofthedepths.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 240,
    "endurance": 26,
    "castTime": 3,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "maxHPBuff": {
      "scale": 2,
      "table": "Ranged_Heal"
    },
    "maxEndBuff": {
      "scale": 10,
      "table": "Ranged_Ones"
    },
    "regenBuff": {
      "scale": 2,
      "table": "Ranged_Ones"
    },
    "rangeBuff": {
      "scale": 0.375,
      "table": "Melee_Stun"
    }
  }
};
