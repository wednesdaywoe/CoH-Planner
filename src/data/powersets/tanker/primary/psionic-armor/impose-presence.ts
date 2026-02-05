/**
 * Impose Presence
 * Toggle: Self +DEF(Melee, Ranged), +To Hit, Foe -Recharge
 *
 * Source: tanker_defense/psionic_armor/impose_presence.json
 */

import type { Power } from '@/types';

export const ImposePresence: Power = {
  "name": "Impose Presence",
  "internalName": "Impose_Presence",
  "available": 9,
  "description": "Impose your presence on nearby enemies, slowing their attack rate down and increasing your defense and chance to hit.",
  "shortHelp": "Toggle: Self +DEF(Melee, Ranged), +To Hit, Foe -Recharge",
  "icon": "psionicarmor_imposepresence.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 12,
    "recharge": 10,
    "endurance": 0.208,
    "castTime": 0.73,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Defense Sets",
    "Threat Duration",
    "To Hit Buff"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 0.2,
      "table": "Melee_Buff_ToHit"
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Melee_Slow"
    },
    "defenseBuff": {
      "ranged": {
        "scale": 0.075,
        "table": "Melee_Buff_Def"
      },
      "melee": {
        "scale": 0.075,
        "table": "Melee_Buff_Def"
      }
    }
  }
};
