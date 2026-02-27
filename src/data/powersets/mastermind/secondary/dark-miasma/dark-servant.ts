/**
 * Dark Servant
 * Summon Dark Servant: Ranged Debuff Special
 *
 * Source: mastermind_buff/dark_miasma/dark_servant.json
 */

import type { Power } from '@/types';

export const DarkServant: Power = {
  "name": "Dark Servant",
  "internalName": "Dark_Servant",
  "available": 29,
  "description": "Summons a Dark Servant to your aid. The Dark Servant possesses an assortment of dark powers to weaken your foes. The summoned entity is not a willing servant, and it is only your power that binds it in this realm. The Dark Servant can be buffed and healed.",
  "shortHelp": "Summon Dark Servant: Ranged Debuff Special",
  "icon": "darkmiasma_darkservant.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 60,
    "recharge": 500,
    "endurance": 32.5,
    "castTime": 3.17
  },
  "allowedEnhancements": [
    "Hold",
    "EnduranceReduction",
    "Recharge",
    "Immobilize",
    "Healing",
    "ToHit Debuff",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Accurate To-Hit Debuff",
    "Healing",
    "Holds",
    "Immobilize",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_V_DarkServant",
      "duration": 240
    }
  }
};
