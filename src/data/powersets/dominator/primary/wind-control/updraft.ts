/**
 * Updraft
 * Ranged, Light DMG(Smashing), Knockup(Foe), -Fly(Foe), Pressure Builder (Self)
 *
 * Source: dominator_control/wind_control/updraft.json
 */

import type { Power } from '@/types';

export const Updraft: Power = {
  "name": "Updraft",
  "internalName": "Updraft",
  "available": 0,
  "description": "You gather air at the feet of your target before forcefully pressurizing it into an upward flowing vortex. The force of the updraft pulls your target into the sky. When the updraft dissipates, your target falls to the ground and suffers moderate smashing damage. The affected target is also unable to fly for a short time. This power builds Pressure.Damage: Light.Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Smashing), Knockup(Foe), -Fly(Foe), Pressure Builder (Self)",
  "icon": "windcontrol_updraft.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.2,
    "range": 80,
    "recharge": 4,
    "endurance": 6.5,
    "castTime": 1.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockup": {
      "scale": 6,
      "table": "Ranged_Knockback"
    },
    "slow": {
      "fly": {
        "scale": 1.5,
        "table": "Ranged_Ones"
      }
    }
  },
  "requires": "char>accesslevel >= 0"
};
