/**
 * Targeting Drone
 * Toggle: Self +To Hit, +Damage, +Perception, Res(DeBuff To Hit)
 *
 * Source: blaster_support/gadgets/targeting_drone.json
 */

import type { Power } from '@/types';

export const TargetingDrone: Power = {
  "name": "Targeting Drone",
  "internalName": "Targeting_Drone",
  "available": 9,
  "description": "When this device is activated, the small Targeting Drone hovers around your head and emits targeting laser sights. The lasers can dramatically improve your chance to hit, slightly increase the damage you deal, and increase your perception, allowing you to better see stealthy foes. If not engaged in combat, this power will give a large damage buff to your opening attack. Targeting Drone also grants you resistance to powers that debuff your chance to hit.Recharge: Moderate.",
  "shortHelp": "Toggle: Self +To Hit, +Damage, +Perception, Res(DeBuff To Hit)",
  "icon": "gadgets_targetingdrone.png",
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
    "damageBuff": {
      "scale": 4.8,
      "table": "Melee_Buff_Dmg"
    },
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
