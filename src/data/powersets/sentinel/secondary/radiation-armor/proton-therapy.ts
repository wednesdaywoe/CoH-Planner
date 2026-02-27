/**
 * Proton Therapy
 * Self Heal, Endurance over time, Res(Toxic, -Regen)
 *
 * Source: sentinel_defense/radiation_armor/proton_therapy.json
 */

import type { Power } from '@/types';

export const ProtonTherapy: Power = {
  "name": "Proton Therapy",
  "internalName": "Proton_Therapy",
  "available": 15,
  "description": "You concentrate your energies to harness the healing powers of radiation to mend your wounds. The effects of Proton Therapy also leaves you resistant to Toxic damage and regeneration debuffs for a while, in addition to giving you some endurance over time.Recharge: Slow.",
  "shortHelp": "Self Heal, Endurance over time, Res(Toxic, -Regen)",
  "icon": "radiationarmor_protontherapy.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 50,
    "endurance": 10.4,
    "castTime": 1.03
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "resistance": {
      "toxic": {
        "scale": 2,
        "table": "Melee_Res_Dmg"
      }
    },
    "enduranceGain": {
      "scale": 5,
      "table": "Melee_Ones"
    },
    "regenBuff": {
      "scale": 0.75,
      "table": "Melee_Res_Boolean"
    }
  }
};
