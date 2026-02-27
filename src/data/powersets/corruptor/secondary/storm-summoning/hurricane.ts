/**
 * Hurricane
 * Toggle: PBAoE, Foe -Range, -To Hit, Repel, Knockback
 *
 * Source: corruptor_buff/storm_summoning/hurricane.json
 */

import type { Power } from '@/types';

export const Hurricane: Power = {
  "name": "Hurricane",
  "internalName": "Hurricane",
  "available": 19,
  "description": "You can summon a Hurricane. The wind and rain from this massive storm reduces the range and chance to hit of nearby foes. The massive winds of this storm continuously force foes away from you.Recharge: Moderate.",
  "shortHelp": "Toggle: PBAoE, Foe -Range, -To Hit, Repel, Knockback",
  "icon": "stormsummoning_hurricane.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 10,
    "endurance": 0.1625,
    "castTime": 2.03,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "ToHit Debuff"
  ],
  "allowedSetCategories": [
    "Knockback",
    "To Hit Debuff"
  ],
  "maxSlots": 6,
  "effects": {
    "rangeBuff": {
      "scale": 0.6,
      "table": "Ranged_Ones"
    },
    "tohitDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_ToHit"
    },
    "repel": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 4,
      "table": "Ranged_Knockback"
    }
  }
};
