/**
 * Burn
 * Location (PBAoE), DoT (Fire), Self Res(Immobilize)
 *
 * Source: blaster_support/fire_manipulation/burn.json
 */

import type { Power } from '@/types';

export const Burn: Power = {
  "name": "Burn",
  "internalName": "Burn",
  "available": 27,
  "description": "You can ignite the ground beneath you, freeing yourself from Immobilization effects. Foes that enter the flames you leave behind will take damage. You must be near the ground to activate this power.Damage: Moderate.Recharge: Slow.",
  "shortHelp": "Location (PBAoE), DoT (Fire), Self Res(Immobilize)",
  "icon": "firemanipulation_burn.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 25,
    "endurance": 5.2,
    "castTime": 2.03,
    "maxTargets": 5
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
  "damage": {
    "type": "Fire",
    "scale": 1.44,
    "table": "Melee_Damage"
  }
};
