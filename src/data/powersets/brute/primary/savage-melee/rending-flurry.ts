/**
 * Rending Flurry
 * PBAoE, DMG(Lethal), Foe DoT (Lethal), -Blood Frenzy
 *
 * Source: brute_melee/savage_melee/rending_flurry.json
 */

import type { Power } from '@/types';

export const RendingFlurry: Power = {
  "name": "Rending Flurry",
  "internalName": "Rending_Flurry",
  "available": 17,
  "description": "You wildly slash at nearby foes to deal moderate lethal damage and cause minor lethal damage over time. This power consumes all Blood Frenzy and will deal additional damage per stack of Blood Frenzy consumed. If you have 5 stacks of Blood Frenzy while activating this power, its radius is greatly increased, but causes you to become Exhausted for a short time. While exhausted you cannot gain Blood Frenzy.",
  "shortHelp": "PBAoE, DMG(Lethal), Foe DoT (Lethal), -Blood Frenzy",
  "icon": "savagemelee_rendingflurry.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 14,
    "endurance": 13.52,
    "castTime": 2.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
