/**
 * Echo Chamber
 * Ranged, DMG(Energy), Foe Hold
 *
 * Source: blaster_support/sonic_manipulation/echo_chamber.json
 */

import type { Power } from '@/types';

export const EchoChamber: Power = {
  "name": "Echo Chamber",
  "internalName": "Echo_Chamber",
  "available": 3,
  "description": "Encases the target in a field of sonic waves, dealing energy damage and holding them in place.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged, DMG(Energy), Foe Hold",
  "icon": "sonicmanipulation_echochamber.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 16,
    "endurance": 11.388,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Energy",
    "scale": 1,
    "table": "Ranged_Damage",
    "tickRate": 1
  },
  "effects": {
    "hold": {
      "mag": 2,
      "scale": 10,
      "table": "Ranged_Immobilize"
    }
  }
};
