/**
 * Enchant Demon
 * Ranged, Enchant Demon Henchman
 *
 * Source: mastermind_summon/demon_summoning/enchant_demon.json
 */

import type { Power } from '@/types';

export const EnchantDemon: Power = {
  "name": "Enchant Demon",
  "internalName": "Enchant_Demon",
  "available": 5,
  "description": "Enchant Demon will permanently bestow new powers and abilities to all of your Demon Henchman. The powers gained are unique and dependent upon the type of Demon Henchman that is Enchanted.Enchant Demon only works on your Demon Henchmen and you can only Enchant your Demon Henchmen once with this power.",
  "shortHelp": "Ranged, Enchant Demon Henchman",
  "icon": "demonsummoning_enchantdemon.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Resistance",
    "EnduranceReduction",
    "Range"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6
};
