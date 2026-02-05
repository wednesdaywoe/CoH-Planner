/**
 * Nimble Slash
 * Melee, Light DMG(Lethal)
 *
 * Source: stalker_melee/dual_blades/light_opening.json
 */

import type { Power } from '@/types';

export const NimbleSlash: Power = {
  "name": "Nimble Slash",
  "internalName": "Light_Opening",
  "available": 0,
  "description": "A quick swipe with your blades. Does minor lethal damage, but has a quick recharge rate. This attack is needed for the Attack Vitals combination attack.Attack Vitals: Power Slice > Nimble Slash > Vengeful Slice.",
  "shortHelp": "Melee, Light DMG(Lethal)",
  "icon": "dualblades_lightopening.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.03
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
    "scale": 0.42,
    "table": "Melee_Damage",
    "duration": 0.5,
    "tickRate": 0.33
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
