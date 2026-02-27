/**
 * Explosive Blast
 * Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback
 *
 * Source: sentinel_ranged/energy_blast/explosive_blast.json
 */

import type { Power } from '@/types';

export const ExplosiveBlast: Power = {
  "name": "Explosive Blast",
  "internalName": "Explosive_Blast",
  "available": 17,
  "description": "You hurl a blast of charged energy that violently explodes on impact, damaging all foes near the target. Explosive Blast may knock targets backwards.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback",
  "icon": "powerblast_explosion.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 40,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Energy",
      "scale": 0.4,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    }
  }
};
