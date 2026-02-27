/**
 * Train Ninjas
 * Ranged, Train Ninja Henchman
 *
 * Source: mastermind_summon/ninjas/train_ninjas.json
 */

import type { Power } from '@/types';

export const TrainNinjas: Power = {
  "name": "Train Ninjas",
  "internalName": "Train_Ninjas",
  "available": 5,
  "description": "Train your Ninja Henchmen with more advanced techniques and weaponry. This power permanently bestows new powers and abilities to all of your Ninja Henchman. The powers gained are unique and dependent upon the type of Ninja Henchman. Your Ninja Henchman will also become more evasive against all forms of positional attacks and gain 3% more Critical Hit chance. This power only works on your Ninja Henchmen and you can only Train your Ninja Henchmen once with this power.",
  "shortHelp": "Ranged, Train Ninja Henchman",
  "icon": "ninjas_trainninjas.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 2.37,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6
};
