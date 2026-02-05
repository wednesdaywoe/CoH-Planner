/**
 * Increase Density
 * Ranged, Ally Special
 *
 * Source: controller_buff/kinetics/increase_density.json
 */

import type { Power } from '@/types';

export const IncreaseDensity: Power = {
  "name": "Increase Density",
  "internalName": "Increase_Density",
  "available": 15,
  "description": "Increases an ally's mass, freeing them from any Disorient, Immobilization, or Hold effects and leaving them resistant to such effects for a while. Increase Density also protects the target from Knockback, Repel and enemy Teleportation, as well as Smashing and Energy damage. Because the target grows more dense, their movement speed is Slowed. Although the Damage Resistance and slowing effect will not stack with multiple applications, the rest of the effects of Increase Density will. You cannot use this power on yourself.Recharge: Very Fast.",
  "shortHelp": "Ranged, Ally Special",
  "icon": "kineticboost_increasedensity.png",
  "powerType": "Click",
  "targetType": "Ally (Alive)",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 30,
    "recharge": 3,
    "endurance": 5.2,
    "castTime": 2.07,
    "maxTargets": 255
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "smashing": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2.5,
        "table": "Ranged_Res_Dmg"
      }
    },
    "hold": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "effectDuration": 60,
    "immobilize": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "stun": {
      "mag": 1,
      "scale": 30,
      "table": "Ranged_Res_Boolean"
    },
    "knockup": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "knockback": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "repel": {
      "scale": 8,
      "table": "Ranged_Ones"
    },
    "teleport": {
      "scale": 1,
      "table": "Ranged_Ones"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.1,
        "table": "Ranged_Slow"
      }
    }
  }
};
