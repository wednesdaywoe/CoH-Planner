/**
 * Equip Thugs
 * Ranged, Equip Thug Henchman
 *
 * Source: mastermind_summon/thugs/equip_thugs.json
 */

import type { Power } from '@/types';

export const EquipThugs: Power = {
  "name": "Equip Thugs",
  "internalName": "Equip_Thugs",
  "available": 5,
  "description": "Equip your Thug Henchmen with better ammo, weapons and training. This power permanently bestows new weapons and abilities to all of your Thug Henchman. The powers gained are unique and dependent upon the type of Thug Henchman.This power only works on your Thug Henchmen and you can only Equip your Thug Henchmen once with this power.",
  "shortHelp": "Ranged, Equip Thug Henchman",
  "icon": "thugs_equipthugs.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 1.3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6
};
