/**
 * Upgrade Equipment
 * Ranged, Upgrade Thug Henchman
 *
 * Source: mastermind_summon/thugs/upgrade_equipment.json
 */

import type { Power } from '@/types';

export const UpgradeEquipment: Power = {
  "name": "Upgrade Equipment",
  "internalName": "Upgrade_Equipment",
  "available": 25,
  "description": "Permanently Upgrade the most advanced ammo, weapons and training to all of your Thug Henchman. The Upgraded Thug will gain new powers, weapons and abilities. The powers gained are unique and dependent upon the type of Thug Henchman that is Upgraded.This power only works on your Thug Henchmen and you can only Upgrade the Equipment of your Thug Henchmen once with this power.",
  "shortHelp": "Ranged, Upgrade Thug Henchman",
  "icon": "thugs_upgradeequipment.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6
};
