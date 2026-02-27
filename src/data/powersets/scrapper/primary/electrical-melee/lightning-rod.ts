/**
 * Lightning Rod
 * PBAoE, Foe Knockback; Self Teleport;
 *
 * Source: scrapper_melee/electrical_melee/lightning_rod.json
 */

import type { Power } from '@/types';

export const LightningRod: Power = {
  "name": "Lightning Rod",
  "internalName": "Lightning_Rod",
  "available": 25,
  "description": "You can polarize your body and become a living Lightning Rod. This power calls forth a massive lightning bolt from the sky to strike you. You can then ride this bolt and instantly Teleport a short distance. You rematerialize in a massive bolt of electricity, dealing massive damage and knocking down all nearby foes. Damage from the lightning bolt is superior.",
  "shortHelp": "PBAoE, Foe Knockback; Self Teleport;",
  "icon": "electricmelee_pbaoeteleport.png",
  "powerType": "Click",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 90,
    "endurance": 13.52,
    "castTime": 2.57
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
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
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
      "entity": "Pets_Embraced_Lightning_Rod_Scrapper",
      "duration": 4
    }
  }
};
