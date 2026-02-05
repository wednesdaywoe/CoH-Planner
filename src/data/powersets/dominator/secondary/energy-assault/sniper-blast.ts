/**
 * Sniper Blast
 * Sniper, Extreme DMG(Energy/Smash), Foe Knockback
 *
 * Source: dominator_assault/energy_assault/sniper_blast.json
 */

import type { Power } from '@/types';

export const SniperBlast: Power = {
  "name": "Sniper Blast",
  "internalName": "Sniper_Blast",
  "available": 27,
  "description": "A focused blast that can travel great distances with high Accuracy. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage. If used against a Disoriented foe, there is a small chance to enter Energy Focus mode.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Energy/Smash), Foe Knockback",
  "icon": "energyassault_sniperblaster.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 150,
    "recharge": 20,
    "endurance": 18.512,
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
    "Knockback",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
