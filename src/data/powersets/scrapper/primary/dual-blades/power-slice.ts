/**
 * Power Slice
 * Melee, DMG(Lethal)
 *
 * Source: scrapper_melee/dual_blades/moderate_opening.json
 */

import type { Power } from '@/types';

export const PowerSlice: Power = {
  "name": "Power Slice",
  "internalName": "Moderate_Opening",
  "available": 0,
  "description": "You perform a deadly Strike with your blades. This is a basic attack that deals a moderate amount of lethal damage. This power is needed for the Sweep combination attack.Sweep: One Thousand Cuts > Power Slice > Typhoon's Edge.",
  "shortHelp": "Melee, DMG(Lethal)",
  "icon": "dualblades_moderateopening.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 1.4
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
      "scale": 0.3867,
      "table": "Melee_Damage",
      "duration": 1,
      "tickRate": 0.4
    },
    {
      "type": "Lethal",
      "scale": 1.16,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 1.16,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.174,
      "table": "Melee_Damage",
      "duration": 1,
      "tickRate": 0.4
    }
  ],
  "requires": "!Scrapper_Defense.Shield_Defense"
};
