/**
 * Equip Mercenary
 * Ranged, Equip Mercenary Henchman
 *
 * Source: mastermind_summon/mercenaries/equip_mercenary.json
 */

import type { Power } from '@/types';

export const EquipMercenary: Power = {
  "name": "Equip Mercenary",
  "internalName": "Equip_Mercenary",
  "available": 5,
  "description": "Equip your Mercenary Henchmen with more advanced munitions and weaponry. This power permanently bestows new weapons and abilities to all Mercenary Henchman. The powers gained are unique and dependent upon the type of Mercenary Henchman.Your Mercenary Henchmen will also become more resistant to damage. This power only works on your Mercenary Henchmen and you can only Equip your Mercenary Henchmen once with this power.",
  "shortHelp": "Ranged, Equip Mercenary Henchman",
  "icon": "paramilitary_equipsoldier.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 6,
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
    "Resist Damage"
  ],
  "maxSlots": 6
};
