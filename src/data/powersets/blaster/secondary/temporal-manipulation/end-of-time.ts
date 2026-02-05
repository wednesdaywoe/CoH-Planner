/**
 * End of Time
 * PBAoE, DMG(Cold/Energy), Foe -Regen
 *
 * Source: blaster_support/time_manipulation/end_of_time.json
 */

import type { Power } from '@/types';

export const EndofTime: Power = {
  "name": "End of Time",
  "internalName": "End_of_Time",
  "available": 15,
  "description": "You open a gate in time that can suck in enemies and send them into a distant unknown future. The affected enemies will be quickly returned to the present time, but not before being temporarily exposed to radiation and the bitter cold of an empty void, reducing their regeneration rate. Targets affected by the Delayed effect will suffer bonus damage.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "PBAoE, DMG(Cold/Energy), Foe -Regen",
  "icon": "timemanipulation_endoftime.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 10,
    "recharge": 17,
    "endurance": 16.016,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Cold",
      "scale": 0.924,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.308,
      "table": "Melee_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.308,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "regenDebuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    },
    "damageBuff": {
      "scale": 0.054,
      "table": "Melee_Ones"
    }
  }
};
