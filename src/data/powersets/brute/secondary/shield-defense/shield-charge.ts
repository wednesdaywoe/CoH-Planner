/**
 * Shield Charge
 * PBAoE Superior DMG(Smashing), Foe Knockdown; Self Teleport
 *
 * Source: brute_defense/shield_defense/shield_charge.json
 */

import type { Power } from '@/types';

export const ShieldCharge: Power = {
  "name": "Shield Charge",
  "internalName": "Shield_Charge",
  "available": 27,
  "description": "You can throw all of your might behind your shield and charge through ranks of foes in the blink of an eye. Using this power allows you to teleport to a selected area to deal significant smashing damage to all foes near the location you teleport to, most foes that are struck by your Shield Charge will be knocked down.Damage: Superior.Recharge: Long.",
  "shortHelp": "PBAoE Superior DMG(Smashing), Foe Knockdown; Self Teleport",
  "icon": "shielddefense_shieldcharge.png",
  "powerType": "Click",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 90,
    "endurance": 13.52,
    "castTime": 1.5
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "teleport": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Shield_Charge_Brute",
      "duration": 4
    }
  }
};
