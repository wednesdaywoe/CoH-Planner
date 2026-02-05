/**
 * Flash Freeze
 * Ranged (Targeted AoE), DMG(Cold), Foe Deep Sleep
 *
 * Source: dominator_control/ice_control/flash_freeze.json
 */

import type { Power } from '@/types';

export const FlashFreeze: Power = {
  "name": "Flash Freeze",
  "internalName": "Flash_Freeze",
  "available": 17,
  "description": "You can Flash Freeze a large patch of ground beneath a targeted foe, instantly forming dozens of deadly ice shards that do Cold damage to all enemies in the area. The victims are left trapped within the icicles, but can break free if disturbed. Only targets near the ground can be affected.Notes: Although this power is Auto Hit, it requires a To Hit check to apply Deep Sleep. If The Hit check is missed, and the target is not an AV, the weaker form of Sleep will be applied.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Cold), Foe Deep Sleep",
  "icon": "iceformation_flashfreeze.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "radius": 25,
    "recharge": 45,
    "endurance": 15.6,
    "castTime": 2.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Sleep",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Ranged AoE Damage",
    "Sleep",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Cold",
    "scale": 0.2,
    "table": "Ranged_Damage"
  }
};
