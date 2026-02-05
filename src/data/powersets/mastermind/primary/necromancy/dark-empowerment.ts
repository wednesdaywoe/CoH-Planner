/**
 * Dark Empowerment
 * Ranged, Empower Undead Henchman
 *
 * Source: mastermind_summon/necromancy/dark_empowerment.json
 */

import type { Power } from '@/types';

export const DarkEmpowerment: Power = {
  "name": "Dark Empowerment",
  "internalName": "Dark_Empowerment",
  "available": 25,
  "description": "Dark Empowerment will permanently bestow the most powerful and darkest new powers and abilities to all of your Undead Henchman. The Empowered Undead will gain new abilities and powers. The powers gained are unique and dependent upon the type of Undead Henchman that is Empowered, but all Henchmen will gain additional Hit Points, and the power to steal life force from enemies they attack!Dark Empowerment only works on your Undead Henchmen and you can only Empower your Undead Henchmen once with this power.",
  "shortHelp": "Ranged, Empower Undead Henchman",
  "icon": "necromancy_darkempowerment.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 10,
    "endurance": 11.375,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6
};
