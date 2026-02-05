/**
 * Abyssal Empowerment
 * Ranged, Empower Demon Henchman
 *
 * Source: mastermind_summon/demon_summoning/abyssal_empowerment.json
 */

import type { Power } from '@/types';

export const AbyssalEmpowerment: Power = {
  "name": "Abyssal Empowerment",
  "internalName": "Abyssal_Empowerment",
  "available": 25,
  "description": "Abyssal Empowerment will permanently unseal the most powerful powers in your Demon Henchmen's infernal repertoire. The Empowered Demons will gain new abilities and powers. The powers gained are unique and dependent upon the type of Demon Henchman that is Empowered.Abyssal Empowerment only works on your Demon Henchmen and you can only Empower your Demon Henchmen once with this power.Recharge: Moderate.",
  "shortHelp": "Ranged, Empower Demon Henchman",
  "icon": "demonsummoning_abyssalempowerment.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "recharge": 10,
    "endurance": 11.375,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "maxSlots": 6
};
