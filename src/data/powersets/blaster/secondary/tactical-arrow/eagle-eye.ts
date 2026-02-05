/**
 * Eagle Eye
 * Toggle: Self +ACC, +Perception, +Res(DeBuff ToHit), +Regeneration, +Recovery
 *
 * Source: blaster_support/tactical_arrow/eagle_eye.json
 */

import type { Power } from '@/types';

export const EagleEye: Power = {
  "name": "Eagle Eye",
  "internalName": "Eagle_Eye",
  "available": 19,
  "description": "You have developed an incredible eyesight. Your accuracy is dramatically improved and your perception increased allowing you to better see distant and stealthy foes. You have also become resistant to powers that debuff your accuracy or chance to hit. In addition to being more accurate, your training also allows you to regenerate health and recovery endurance at an accelerated rate while this power is active. However, only half of this regeneration bonus is enhanceable.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +ACC, +Perception, +Res(DeBuff ToHit), +Regeneration, +Recovery",
  "icon": "tacticalarrow_eagleeye.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2,
      "table": "Melee_Res_Boolean"
    },
    "perceptionBuff": {
      "scale": 0.6,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 1.125,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.5,
      "table": "Melee_Ones"
    }
  }
};
