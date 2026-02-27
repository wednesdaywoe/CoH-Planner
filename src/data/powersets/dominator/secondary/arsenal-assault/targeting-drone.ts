/**
 * Targeting Drone
 * Toggle: Self +To Hit, +Perception, Res(DeBuff To Hit)
 *
 * Source: dominator_assault/arsenal_assault/targeting_drone.json
 */

import type { Power } from '@/types';

export const TargetingDrone: Power = {
  "name": "Targeting Drone",
  "internalName": "Targeting_Drone",
  "available": 23,
  "description": "When this device is activated, the small Targeting Drone hovers around your head and emits targeting laser sights. The lasers can dramatically improve your chance to hit, and increase your perception, allowing you to better see stealthy foes. Targeting Drone also grants you resistance to powers that debuff your chance to hit.",
  "shortHelp": "Toggle: Self +To Hit, +Perception, Res(DeBuff To Hit)",
  "icon": "assaultweapons_targetingdrone.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 10,
    "endurance": 0.156,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "ToHit"
  ],
  "allowedSetCategories": [
    "To Hit Buff"
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
    }
  }
};
