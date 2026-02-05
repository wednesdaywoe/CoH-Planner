/**
 * Chrono Shift
 * PBAoE, Team +Recharge, Heal, +End, Moderate Healing over Time, +Recovery
 *
 * Source: corruptor_buff/time_manipulation/chrono_shift.json
 */

import type { Power } from '@/types';

export const ChronoShift: Power = {
  "name": "Chrono Shift",
  "internalName": "Chrono_Shift",
  "available": 29,
  "description": "You cause nearby allies to act more quickly by allowing them to slip through the time stream seamlessly. When Chrono Shift is activated, you and nearby allies will immediately recover a portion of your health and endurance. Chrono Shift will greatly increase the Recharge Speed of nearby allies for the duration of the power, additionally for a short while the flow of time will constantly undo a portion of your allies' wounds causing them to periodically recover health and recover endurance. An ally affected by Temporal Selection will recover additional health from Chrono Shift.Recharge: Very Long.",
  "shortHelp": "PBAoE, Team +Recharge, Heal, +End, Moderate Healing over Time, +Recovery",
  "icon": "timemanipulation_chronoshift.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 360,
    "endurance": 20.8,
    "castTime": 2.03,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 1.2,
      "table": "Ranged_Heal"
    },
    {
      "type": "Heal",
      "scale": 0.2,
      "table": "Ranged_Heal",
      "duration": 30,
      "tickRate": 3
    },
    {
      "type": "Heal",
      "scale": 1.8,
      "table": "Ranged_Heal"
    },
    {
      "type": "Heal",
      "scale": 0.3,
      "table": "Ranged_Heal",
      "duration": 30,
      "tickRate": 3
    }
  ],
  "effects": {
    "enduranceGain": {
      "scale": 0.15,
      "table": "Ranged_Ones"
    },
    "recoveryBuff": {
      "scale": 0.3,
      "table": "Ranged_Ones"
    },
    "rechargeBuff": {
      "scale": 0.5,
      "table": "Ranged_Ones"
    }
  }
};
