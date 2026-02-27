/**
 * Train Beasts
 * Ranged, Train Beast Henchmen
 *
 * Source: mastermind_summon/beast_mastery/train_beasts.json
 */

import type { Power } from '@/types';

export const TrainBeasts: Power = {
  "name": "Train Beasts",
  "internalName": "Train_Beasts",
  "available": 5,
  "description": "Train your Beast Henchmen to more effectively attack your foes. This power permanently bestows new powers and abilities to all of your Beast Henchmen. The powers gained are unique and dependent upon the type of Beast Henchman.This power only works on your Beast Henchmen and you can only Train your Beast Henchmen once with this power.",
  "shortHelp": "Ranged, Train Beast Henchmen",
  "icon": "beastmastery_trainbeasts.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 30,
    "recharge": 0.5,
    "endurance": 11.375,
    "castTime": 1.67,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
  ],
  "maxSlots": 6
};
