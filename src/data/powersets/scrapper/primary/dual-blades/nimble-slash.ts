/**
 * Nimble Slash
 * Melee, DMG(Lethal)
 *
 * Source: scrapper_melee/dual_blades/light_opening.json
 */

import type { Power } from '@/types';

export const NimbleSlash: Power = {
  "name": "Nimble Slash",
  "internalName": "Light_Opening",
  "available": 0,
  "description": "A quick swipe with your blades. Does minor lethal damage, but has a quick recharge rate. This attack begins both the Empower and Weaken combination attacks.Empower: Nimble Slash > Ablating Strike > Blinding Feint.Weaken: Nimble Slash > Ablating Strike > Typhoon's Edge.",
  "shortHelp": "Melee, DMG(Lethal)",
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
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.42,
      "table": "Melee_Damage",
      "duration": 0.5,
      "tickRate": 0.33
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 0.84,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.189,
      "table": "Melee_Damage",
      "duration": 0.5,
      "tickRate": 0.33
    }
  ],
  "requires": "!Scrapper_Defense.Shield_Defense"
};
