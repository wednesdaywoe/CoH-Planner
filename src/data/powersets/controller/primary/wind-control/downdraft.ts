/**
 * Downdraft
 * Ranged, Hold(Foe), -Movement(Foe), -Rech(Foe), -Fly(Foe), Pressure Builder (Self)
 *
 * Source: controller_control/wind_control/downdraft.json
 */

import type { Power } from '@/types';

export const Downdraft: Power = {
  "name": "Downdraft",
  "internalName": "Downdraft",
  "available": 0,
  "description": "You gather air above your target before forcefully pressurizing it into a downward flowing vortex. The force of the downdraft prevents your target from moving, effectively holding them in place and preventing flight. The force of the downdraft leaves the target winded, reducing their movement and attack speeds for a short time while they recover. This power builds Pressure.Damage: High.Recharge: Moderate.",
  "shortHelp": "Ranged, Hold(Foe), -Movement(Foe), -Rech(Foe), -Fly(Foe), Pressure Builder (Self)",
  "icon": "windcontrol_downdraft.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Holds",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1,
      "table": "Ranged_InherentDamage"
    }
  ],
  "effects": {
    "hold": {
      "mag": 3,
      "scale": 12,
      "table": "Ranged_Immobilize"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "slow": {
      "fly": {
        "scale": 2,
        "table": "Ranged_Ones"
      }
    },
    "knockup": {
      "scale": 100,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 100,
      "table": "Ranged_Ones"
    }
  },
  "requires": "char>accesslevel >= 0"
};
