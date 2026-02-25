/**
 * Enchant Undead
 * Ranged, Enchant Undead Henchman
 *
 * Source: mastermind_summon/necromancy/enchant_undead.json
 */

import type { Power } from '@/types';

export const EnchantUndead: Power = {
  "name": "Enchant Undead",
  "internalName": "Enchant_Undead",
  "available": 5,
  "description": "Enchant Undead will permanently bestow new powers and abilities to all of your Undead Henchman. The powers gained are unique and dependent upon the type of Undead Henchman that is Enchanted, but all henchmen will gain Resistances to most forms of crowd control and a variety of damage types.Enchant Undead only works on your Undead Henchmen and you can only Enchant your Undead Henchmen once with this power.",
  "shortHelp": "Ranged, Enchant Undead Henchman",
  "icon": "necromancy_enchantundead.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6
};
