/**
 * Fallout
 * Post-Defeat: PBAoE, Extreme DMG(Energy), Foe -To Hit, -DEF, -DMG, -Res(All)
 *
 * Source: controller_buff/radiation_emission/fallout.json
 */

import type { Power } from '@/types';

export const Fallout: Power = {
  "name": "Fallout",
  "internalName": "Fallout",
  "available": 27,
  "description": "After an ally falls in battle, you can activate this power to extract the energy from their body to deal a massive amount of Energy damage to any nearby foes. All affected foes are extremely weakened by the Fallout, and their chance to hit, Defense, Damage and Damage Resistance is severely reduced.Damage: Extreme.Recharge: Very Long.",
  "shortHelp": "Post-Defeat: PBAoE, Extreme DMG(Energy), Foe -To Hit, -DEF, -DMG, -Res(All)",
  "icon": "radiationpoisoning_fallout.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 300,
    "endurance": 20.8,
    "castTime": 3.2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate To-Hit Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Fallout",
      "duration": 1
    }
  }
};
