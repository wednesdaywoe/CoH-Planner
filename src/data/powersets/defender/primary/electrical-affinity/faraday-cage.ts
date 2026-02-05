/**
 * Faraday Cage
 * Location (PBAoE), Team +Res(All DMG but Toxic, Status, Knockback, -Rech, -Rec, -End)
 *
 * Source: defender_buff/shock_therapy/faraday_cage.json
 */

import type { Power } from '@/types';

export const FaradayCage: Power = {
  "name": "Faraday Cage",
  "internalName": "Faraday_Cage",
  "available": 7,
  "description": "Create a large energy barrier at your location which provides all allies within resistance to all damage except Toxic. They are also protected from status effects, knockbacks, endurance drain, recovery debuffs and recharge debuffs. Casting this power again will move the energy barrier to your location. Standing inside your own Faraday Cage will grant you a stack of Static every 5 seconds.Recharge: Moderate.",
  "shortHelp": "Location (PBAoE), Team +Res(All DMG but Toxic, Status, Knockback, -Rech, -Rec, -End)",
  "icon": "shocktherapy_faradaycage.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 25,
    "recharge": 10,
    "endurance": 13,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Faraday Cage",
      "powers": [
        "Redirects.Shock_Therapy.FaradayCage",
        "Redirects.Shock_Therapy.FaradayCageFx",
        "Redirects.Shock_Therapy.FaradayStatic"
      ],
      "duration": 240
    }
  }
};
