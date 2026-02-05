/**
 * Oil Slick Arrow
 * Ranged (Location AoE), Knockdown, -Speed, -DEF, +Special
 *
 * Source: controller_buff/trick_arrow/oil_slick_arrow.json
 */

import type { Power } from '@/types';

export const OilSlickArrow: Power = {
  "name": "Oil Slick Arrow",
  "internalName": "Oil_Slick_Arrow",
  "available": 27,
  "description": "On impact, this arrow creates an oil slick that Slows foes in the area and may cause them to slip and fall. The oil slick is very flammable and may burst into flames if fire is used near it.Recharge: Long.",
  "shortHelp": "Ranged (Location AoE), Knockdown, -Speed, -DEF, +Special",
  "icon": "trickarrow_knockdown.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 180,
    "endurance": 15.6,
    "castTime": 1.16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage"
  ],
  "allowedSetCategories": [
    "Defense Debuff",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_OilSlickOil",
      "duration": 30
    }
  }
};
