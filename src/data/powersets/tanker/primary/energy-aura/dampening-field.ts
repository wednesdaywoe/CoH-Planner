/**
 * Dampening Field
 * Auto: Self +Res (Smashing, Lethal, Energy, Endurance Drain)
 *
 * Source: tanker_defense/energy_aura/dampening_field.json
 */

import type { Power } from '@/types';

export const DampeningField: Power = {
  "name": "Dampening Field",
  "internalName": "Dampening_Field",
  "available": 0,
  "description": "Your body resonates a mild Dampening Field that absorbs kinetic energy from physical weapons as well as Energy damage. This auto power permanently reduces all incoming Smashing, Lethal and Energy damage as well as providing a minor amount of resistance to Endurance Drain effects. This power is always on and costs no Endurance.",
  "shortHelp": "Auto: Self +Res (Smashing, Lethal, Energy, Endurance Drain)",
  "icon": "energyaura_powershield.png",
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
      "smashing": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "lethal": {
        "scale": 1.25,
        "table": "Melee_Res_Dmg"
      },
      "energy": {
        "scale": 1,
        "table": "Melee_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 0.25,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.25,
      "table": "Melee_Ones"
    }
  }
};
