/**
 * Sniper Blast
 * Sniper, DMG(Energy/Smash), Foe Knockback, Self +Range
 *
 * Source: blaster_ranged/energy_blast/sniper_blast.json
 */

import type { Power } from '@/types';

export const SniperBlast: Power = {
  "name": "Sniper Blast",
  "internalName": "Sniper_Blast",
  "available": 7,
  "description": "A focused blast that can travel great distances with high Accuracy. This is a sniper attack, and is best fired from a distance, as it can be interrupted. Sniper Blast may knock targets backwards. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
  "shortHelp": "Sniper, DMG(Energy/Smash), Foe Knockback, Self +Range",
  "icon": "powerblast_sniperblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 12,
    "endurance": 14.352,
    "castTime": 1.33
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
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
