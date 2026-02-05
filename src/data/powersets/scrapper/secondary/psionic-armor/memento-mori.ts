/**
 * Memento Mori
 * Self Rez, +Max HP, Special
 *
 * Source: scrapper_defense/psionic_armor/memento_mori.json
 */

import type { Power } from '@/types';

export const MementoMori: Power = {
  "name": "Memento Mori",
  "internalName": "Memento_Mori",
  "available": 29,
  "description": "Terrify your foes projecting images of their own impending demise into their minds. Memento Mori inflicts fear on targets while healing you even if you have been defeated. Each affected foe will increase your maximum hit points and heal you. Using this power while conscious will give you one opportunity to get back up should you be defeated while its effects are active.Notes: This power recharges in 10 seconds if no foes are hit. Otherwise, it recharges in 300 seconds.",
  "shortHelp": "Self Rez, +Max HP, Special",
  "icon": "psionicarmor_mementomori.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "radius": 25,
    "recharge": 300,
    "endurance": 18.2,
    "castTime": 1.33,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing",
    "Fear"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Fear",
    "Healing"
  ],
  "maxSlots": 6
};
