/**
 * Masterful Throw
 * Sniper, Extreme DMG(Lethal), Foe -To Hit
 *
 * Source: dominator_assault/martial_assault/masterful_throw.json
 */

import type { Power } from '@/types';

export const MasterfulThrow: Power = {
  "name": "Masterful Throw",
  "internalName": "Masterful_Throw",
  "available": 27,
  "description": "You take careful aim and let loose an extremely accurate, extremely forceful blade. This is a sniper attack, and is best fired from a distance, as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Sniper, Extreme DMG(Lethal), Foe -To Hit",
  "icon": "martialassault_masterfulthrow.png",
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
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Ranged Damage",
    "Sniper Attacks",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6
};
