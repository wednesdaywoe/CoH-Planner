/**
 * Clear Skies
 * Self (Auto), +ToHit, +Rech, +Rec, -EndCost
 *
 * Source: controller_control/wind_control/clear_skies.json
 */

import type { Power } from '@/types';

export const ClearSkies: Power = {
  "name": "Clear Skies",
  "internalName": "Clear_Skies",
  "available": 0,
  "description": "When training yourself in the creation of a Vortex, you also learn how to create the Clear Skies effect. If you use Vacuum on your own Vortex, you will gain a boost to your chance to hit foes, your attack speed and your recovery. Additionally, the endurance cost of all your powers will be reduced. While the strength of the Clear Skies effect cannot be stacked and cannot be increased, the duration of the effect can be extended from the minimum duration of 30 seconds. The more Pressure you consume when you execute Vacuum, the greater the duration of the Clear Skies bonuses, up to a maximum of 60 seconds. When the bonuses of Clear Skies end, you will be under the Clouded Skies effect, which prevents another Clear Skies buff from applying, for several minutes. Clear Skies is granted automatically when both Vacuum and Vortex have been trained.",
  "shortHelp": "Self (Auto), +ToHit, +Rech, +Rec, -EndCost",
  "icon": "windcontrol_clearskies.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [],
  "maxSlots": 6,
  "effects": {
    "tohitBuff": {
      "scale": 2.5,
      "table": "Ranged_Buff_ToHit"
    },
    "rechargeBuff": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "enduranceDiscount": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    },
    "recoveryBuff": {
      "scale": 0.25,
      "table": "Ranged_Ones"
    }
  },
  "requires": "Controller_Control.Wind_Control.Vacuum && Controller_Control.Wind_Control.Vortex && (char>accesslevel >= 0)"
};
