/**
 * Zapp
 * Sniper, Extreme DMG(Energy), Foe -End
 *
 * Source: dominator_assault/electricity_manipulation/lightning_clap.json
 */

import type { Power } from '@/types';

export const Zapp: Power = {
  "name": "Zapp",
  "internalName": "Lightning_Clap",
  "available": 19,
  "description": "A focused electrical blast that can travel great distances with high Accuracy. Zapp drains Endurance, some of which may transfer back to you. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Energy), Foe -End",
  "icon": "electricalassault_zapp.png",
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
    "EnduranceModification",
    "Interrupt",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Ranged Damage",
    "Sniper Attacks",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
