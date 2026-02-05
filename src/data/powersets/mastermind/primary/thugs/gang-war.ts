/**
 * Gang War
 * Summon Posse
 *
 * Source: mastermind_summon/thugs/gang_war.json
 */

import type { Power } from '@/types';

export const GangWar: Power = {
  "name": "Gang War",
  "internalName": "Gang_War",
  "available": 17,
  "description": "Calls a gang of 10 or so Thug Posse to come to your aid for a brief while. Posse are not like your true Henchman. They cannot be given direct commands, nor will they appear in your pet window. You must select an enemy target to attack first before calling these Thugs. Posse are many, but they are very weak, and are only equipped with the most basic weapons. Although they will follow you, they are not as loyal as your Henchmen, and they will only stick around for a few minutes before taking off.Recharge: Very Long.",
  "shortHelp": "Summon Posse",
  "icon": "thugs_targetedsummonmob.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 600,
    "endurance": 13,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Mastermind Archetype Sets",
    "Pet Damage",
    "Recharge Intensive Pets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Thug_Pose_09"
    }
  }
};
