/**
 * Consume
 * PBAoE DMG(Fire), Self +End
 *
 * Source: dominator_assault/fiery_assault/consume.json
 */

import type { Power } from '@/types';

export const Consume: Power = {
  "name": "Consume",
  "internalName": "Consume",
  "available": 23,
  "description": "You can drain body heat from all nearby foes in order to replenish your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage.Damage: Minor.Recharge: Long.",
  "shortHelp": "PBAoE DMG(Fire), Self +End",
  "icon": "fireassault_consume.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 20,
    "recharge": 180,
    "endurance": 0.52,
    "castTime": 2.03,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Fire",
    "scale": 0.4,
    "table": "Melee_Damage"
  },
  "effects": {
    "enduranceGain": {
      "scale": 20,
      "table": "Melee_Ones"
    },
    "recoveryBuff": {
      "scale": 0.05,
      "table": "Melee_Ones"
    }
  }
};
