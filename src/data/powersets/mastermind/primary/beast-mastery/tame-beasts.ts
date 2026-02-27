/**
 * Tame Beasts
 * Ranged, Upgrade Beast Henchmen
 *
 * Source: mastermind_summon/beast_mastery/tame_beasts.json
 */

import type { Power } from '@/types';

export const TameBeasts: Power = {
  "name": "Tame Beasts",
  "internalName": "Tame_Beasts",
  "available": 25,
  "description": "Tame Beasts will permanently teach the most deadly and ferocious powers to all of your Beast Henchmen. The Tamed Beasts will gain new abilities and powers. The powers gained are unique and dependent upon the type of Beast Henchman that is Tamed.Tame Beasts only works on your Beast Henchmen and you can only Tame your Beast Henchmen once with this power.",
  "shortHelp": "Ranged, Upgrade Beast Henchmen",
  "icon": "beastmastery_tamebeasts.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 1.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Range",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing",
    "Resist Damage"
  ],
  "maxSlots": 6
};
