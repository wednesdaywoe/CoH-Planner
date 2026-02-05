/**
 * Strike
 * Melee, DMG(Lethal)
 *
 * Source: stalker_melee/claws/strike.json
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
    "recharge": 3.2,
    "endurance": 4.16,
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 1.08,
    "table": "Melee_Damage"
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
