/**
 * Kinetic Dampening
 * Auto: Self +Res (Energy, Negative, Toxic, Lethal, Smashing, Slow)
 *
 * Source: sentinel_defense/energy_aura/kinetic_dampening.json
 */

import type { Power } from '@/types';

export const KineticDampening: Power = {
  "name": "Kinetic Dampening",
  "internalName": "Kinetic_Dampening",
  "available": 0,
  "description": "Your ability to channel energy makes you naturally resistant to Energy, Negative Energy, Lethal, Smashing and Toxic damage. Additionally, the user gains a moderate level of resistance to slow effects. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Energy, Negative, Toxic, Lethal, Smashing, Slow)",
  "icon": "energyaura_protection.png",
  "powerType": "Auto",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1
  },
  "allowedEnhancements": [
    "Resistance"
  ],
  "allowedSetCategories": [
    "Resist Damage"
  ],
  "maxSlots": 6,
  "effects": {
    "resistance": {
      "energy": {
        "scale": 1.5,
        "table": "Melee_Res_Dmg"
      },
      "negative": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "toxic": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "smashing": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Ones"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Ones"
      }
    },
    "rechargeBuff": {
      "scale": 0.2,
      "table": "Melee_Ones"
    }
  }
};
