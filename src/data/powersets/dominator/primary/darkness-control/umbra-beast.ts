/**
 * Umbra Beast
 * Summon Umbra Beast
 *
 * Source: dominator_control/darkness_control/umbra_beast.json
 */

import type { Power } from '@/types';

export const UmbraBeast: Power = {
  "name": "Umbra Beast",
  "internalName": "Umbra_Beast",
  "available": 25,
  "description": "You conjure up one of the most fearsome creatures of the Netherworld, the Umbra Beast. This creature will fight beside its summoner using its brutal claw, bite and darkness attacks.Recharge: Long.",
  "shortHelp": "Summon Umbra Beast",
  "icon": "darknesscontrol_umbrabeast.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "recharge": 240,
    "endurance": 26,
    "castTime": 2.33
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Immobilize",
    "Fear",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Fear",
    "Immobilize",
    "Pet Damage",
    "Recharge Intensive Pets",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Umbra_Beast"
    }
  }
};
