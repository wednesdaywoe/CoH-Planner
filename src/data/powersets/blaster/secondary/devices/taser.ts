/**
 * Taser
 * Melee, High DMG(Energy), Foe Disorient
 *
 * Source: blaster_support/gadgets/taser.json
 */

import type { Power } from '@/types';

export const Taser: Power = {
  "name": "Taser",
  "internalName": "Taser",
  "available": 3,
  "description": "The High Voltage Taser is an overcharged stun-gun, releasing a high-voltage, high-amperage electrical charge that can Disorient most opponents with major tissue damage. The Taser has a very short range.Damage: High.Recharge: Moderate.",
  "shortHelp": "Melee, High DMG(Energy), Foe Disorient",
  "icon": "gadgets_taser.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 20,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Ranged Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1.96,
    "table": "Melee_Damage"
  },
  "effects": {
    "stun": {
      "mag": 3,
      "scale": 5,
      "table": "Melee_Stun"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
