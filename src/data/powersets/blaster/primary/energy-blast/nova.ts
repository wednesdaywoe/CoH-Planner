/**
 * Nova
 * PBAoE, DMG(Energy), Foe Knockback
 *
 * Source: blaster_ranged/energy_blast/nova.json
 */

import type { Power } from '@/types';

export const Nova: Power = {
  "name": "Nova",
  "internalName": "Nova",
  "available": 25,
  "description": "You can explode in a tremendous blast of energy, sending nearby foes flying. The Nova deals extreme Energy and Smashing damage to all nearby foes.",
  "shortHelp": "PBAoE, DMG(Energy), Foe Knockback",
  "icon": "powerblast_novablast.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 25,
    "recharge": 145,
    "endurance": 27.716,
    "castTime": 3,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 3,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 10,
      "table": "Ranged_Knockback"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
