/**
 * Nova
 * PBAoE, DMG(Energy), Foe Knockback
 *
 * Source: sentinel_ranged/energy_blast/nova.json
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
    "radius": 20,
    "recharge": 90,
    "endurance": 15.6,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.928,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 2.253,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 10,
      "table": "Ranged_Knockback"
    }
  }
};
