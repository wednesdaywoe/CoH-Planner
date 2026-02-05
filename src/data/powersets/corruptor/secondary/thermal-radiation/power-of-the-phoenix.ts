/**
 * Power of the Phoenix
 * Ally Rez, Special
 *
 * Source: corruptor_buff/thermal_radiation/power_of_the_phoenix.json
 */

import type { Power } from '@/types';

export const PowerofthePhoenix: Power = {
  "name": "Power of the Phoenix",
  "internalName": "Power_of_the_Phoenix",
  "available": 15,
  "description": "Revives a fallen ally. The fiery resurrection blasts nearby foes with an explosion and knocks them down and Disorients them. Your ally will revive with most of their Hit Points and Endurance. He will also be invulnerable for a brief time, as well as protected from XPDebt for 90 seconds.",
  "shortHelp": "Ally Rez, Special",
  "icon": "thermalradiation_phoenix.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 15,
    "recharge": 300,
    "endurance": 49.4,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Healing",
    "Damage"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Endurance Modification",
    "Healing",
    "Ranged AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 7,
    "table": "Ranged_HealSelf",
    "duration": 0.5,
    "tickRate": 1
  },
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Phoenix",
      "duration": 5
    },
    "untouchable": {
      "scale": 10,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 70,
      "table": "Ranged_Ones"
    }
  }
};
