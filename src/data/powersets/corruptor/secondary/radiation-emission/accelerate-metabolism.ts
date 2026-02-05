/**
 * Accelerate Metabolism
 * PBAoE, Ally +SPD, +Recharge, +Recovery, +DMG(All) +Res(Effects)
 *
 * Source: corruptor_buff/radiation_emission/accelerate_metabolism.json
 */

import type { Power } from '@/types';

export const AccelerateMetabolism: Power = {
  "name": "Accelerate Metabolism",
  "internalName": "Accelerate_Metabolism",
  "available": 3,
  "description": "Activating this power emits radiation that increases the running speed, attack speed, Endurance recovery, and damage potential of all nearby allies. Affected allies' metabolisms are increased so much that they become resistant to effects such as Sleep, Hold, Disorient, Immobilization and Endurance Drain.Recharge: Very Long.",
  "shortHelp": "PBAoE, Ally +SPD, +Recharge, +Recovery, +DMG(All) +Res(Effects)",
  "icon": "radiationpoisoning_acceleratemetabolism.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 422,
    "endurance": 15.6,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Running",
    "Running & Sprints",
    "Universal Travel"
  ],
  "maxSlots": 6,
  "effects": {
    "damageBuff": {
      "scale": 2,
      "table": "Ranged_Buff_Dmg"
    },
    "hold": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 120,
    "immobilize": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "sleep": {
      "mag": 1,
      "scale": 5,
      "table": "Ranged_Res_Boolean"
    },
    "rechargeBuff": {
      "scale": 0.3,
      "table": "Ranged_Ones"
    },
    "enduranceGain": {
      "scale": 1.5,
      "table": "Ranged_Res_Boolean"
    },
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Ranged_Ones"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Ones"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Ones"
      }
    }
  }
};
