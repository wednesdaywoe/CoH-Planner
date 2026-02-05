/**
 * Power Blast
 * Ranged, DMG(Energy/Smash), Foe Knockback
 *
 * Source: blaster_ranged/energy_blast/power_blast.json
 */

import type { Power } from '@/types';

export const PowerBlast: Power = {
  "name": "Power Blast",
  "internalName": "Power_Blast",
  "available": 0,
  "description": "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock them back.",
  "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
  "icon": "powerblast_powerblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.64,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 1,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
