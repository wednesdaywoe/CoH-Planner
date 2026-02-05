/**
 * Temporal Mending
 * PBAoE, Ally +Heal, Heal Over Time, +Res(Slow, Regen Debuff)
 *
 * Source: mastermind_buff/time_manipulation/temporal_mending.json
 */

import type { Power } from '@/types';

export const TemporalMending: Power = {
  "name": "Temporal Mending",
  "internalName": "Temporal_Mending",
  "available": 0,
  "description": "You mend the wounds of yourself and nearby allies by placing your bodies in a past or future state where they are far less injured. Temporal Mending will immediately heal its targets and continue to heal them for an equal amount over the next 6 seconds. Additionally, affected allies will gain some resistance to slow effects and regeneration debuffs. Allies affected by the Accelerated effect will receive additional healing from this power.Recharge: Slow.",
  "shortHelp": "PBAoE, Ally +Heal, Heal Over Time, +Res(Slow, Regen Debuff)",
  "icon": "timemanipulation_temporalmending.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 18,
    "endurance": 16.25,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 1.125,
      "table": "Ranged_Heal"
    },
    {
      "type": "Heal",
      "scale": 0.3,
      "table": "Ranged_Heal",
      "duration": 6,
      "tickRate": 1.5
    },
    {
      "type": "Heal",
      "scale": 0.75,
      "table": "Ranged_Heal"
    },
    {
      "type": "Heal",
      "scale": 0.2,
      "table": "Ranged_Heal",
      "duration": 6,
      "tickRate": 1.5
    }
  ],
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Ones"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Ones"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Ones"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Ranged_Ones"
    },
    "regenBuff": {
      "scale": 1,
      "table": "Ranged_Res_Boolean"
    }
  }
};
