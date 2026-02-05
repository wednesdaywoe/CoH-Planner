/**
 * Oil Slick Arrow
 * Ranged (Location AoE), Foe Knockdown, -SPD, -Jump, +Special
 *
 * Source: blaster_support/tactical_arrow/gymnastics.json
 */

import type { Power } from '@/types';

export const OilSlickArrow: Power = {
  "name": "Oil Slick Arrow",
  "internalName": "Gymnastics",
  "available": 29,
  "description": "On impact, this arrow creates an oil slick that Slows foes in the area and may cause them to slip and fall. The oil slick is very flammable and may burst into flames if fire is used near it.Recharge: Long.",
  "shortHelp": "Ranged (Location AoE), Foe Knockdown, -SPD, -Jump, +Special",
  "icon": "tacticalarrow_knockdown.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 1.16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_OilSlickOil_Blaster",
      "duration": 30
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
