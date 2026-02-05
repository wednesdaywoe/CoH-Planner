/**
 * Strike
 * Melee, DMG(Lethal)
 *
 * Source: tanker_melee/claws/strike.json
 */

import type { Power } from '@/types';

export const Strike: Power = {
  "name": "Strike",
  "internalName": "Strike",
  "available": 0,
  "description": "You perform a deadly Strike with your claws. This is a basic attack that deals a moderate amount of lethal damage.",
  "shortHelp": "Melee, DMG(Lethal)",
  "icon": "claws_clawsstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 4.8,
    "endurance": 5.4912,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Melee Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.24,
      "table": "Melee_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.558,
      "table": "Melee_Damage"
    }
  ],
  "requires": "!Tanker_Defense.Shield_Defense && !Tanker_Defense.Stone_Armor"
};
