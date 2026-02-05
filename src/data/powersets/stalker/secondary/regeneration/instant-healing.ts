/**
 * Instant Healing
 * Click: Self +Regeneration
 *
 * Source: stalker_defense/regeneration/instant_healing.json
 */

import type { Power } from '@/types';

export const InstantHealing: Power = {
  "name": "Instant Healing",
  "internalName": "Instant_Healing",
  "available": 23,
  "description": "When you activate this power, you can regenerate your health at an astounding rate. This boost to your Regeneration Rate lasts about a minute and takes a long time to recharge once used.This power is mutually exclusive from Reactive Regeneration.",
  "shortHelp": "Click: Self +Regeneration",
  "icon": "regeneration_instanthealing.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 650,
    "endurance": 10.4,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "regenBuff": {
      "scale": 2,
      "table": "Melee_Ones"
    }
  },
  "requires": "!Stalker_Defense.Regeneration.Instant_Regeneration"
};
