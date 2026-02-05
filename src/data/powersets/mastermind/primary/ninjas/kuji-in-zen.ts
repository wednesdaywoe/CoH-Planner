/**
 * Kuji-In Zen
 * Ranged, Enlighten Ninja Henchman
 *
 * Source: mastermind_summon/ninjas/kuji_in_zen.json
 */

import type { Power } from '@/types';

export const KujiInZen: Power = {
  "name": "Kuji-In Zen",
  "internalName": "Kuji_In_Zen",
  "available": 25,
  "description": "Kuji-In Zen will permanently bestow the most advanced techniques and powers to all of your Ninja Henchman. The Enlightened Ninja will gain new abilities, powers, and weapons. The powers gained are unique and dependent upon the type of Ninja Henchman that is Enlightened. Your Ninja Henchman also gain 3% more Critical Hit chance and the ability to heal themselves periodically with Kuji-In Sha. This power only works on your Ninja Henchmen and you can only Enlighten your Ninja Henchmen once with this power.",
  "shortHelp": "Ranged, Enlighten Ninja Henchman",
  "icon": "ninjas_upgradeequipment.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 10,
    "endurance": 11.375,
    "castTime": 2.37,
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
