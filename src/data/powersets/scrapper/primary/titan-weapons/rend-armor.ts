/**
 * Rend Armor
 * Melee, DMG(Smashing), Foe -Def(All), -Res(All)
 *
 * Source: scrapper_melee/titan_weapons/shatter_armor.json
 */

import type { Power } from '@/types';

export const RendArmor: Power = {
  "name": "Rend Armor",
  "internalName": "Shatter_Armor",
  "available": 17,
  "description": "You batter your enemy with your mighty weapon dealing Extreme Smashing damage and reducing their resistance to damage as well as their defense to all types of attacks for a short time.",
  "shortHelp": "Melee, DMG(Smashing), Foe -Def(All), -Res(All)",
  "icon": "titanweapons_shatterarmor.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 9,
    "recharge": 16,
    "endurance": 15.6395,
    "castTime": 2.3
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
