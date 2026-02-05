/**
 * Power Slice
 * Melee, Light DMG(Lethal)
 *
 * Source: stalker_melee/dual_blades/moderate_opening.json
 */

import type { Power } from '@/types';

export const PowerSlice: Power = {
  "name": "Power Slice",
  "internalName": "Moderate_Opening",
  "available": 0,
  "description": "You perform a deadly Strike with your blades. This is a basic attack that deals a moderate amount of lethal damage. This power begins the Attack Vitals combination attack and is needed for the Weaken combination attack.Attack Vitals: Power Slice > Nimble Slash > Vengeful Slice.Weaken: Sweeping Strike > Power Slice > One Thousand Cuts.",
  "shortHelp": "Melee, Light DMG(Lethal)",
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
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.3867,
    "table": "Melee_Damage",
    "duration": 1,
    "tickRate": 0.4
  },
  "requires": "!Stalker_Defense.Shield_Defense"
};
