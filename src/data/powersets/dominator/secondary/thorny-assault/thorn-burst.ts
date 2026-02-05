/**
 * Thorn Burst
 * PBAoE Melee, Light DMG(Lethal), DoT(Toxic) -DEF
 *
 * Source: dominator_assault/thorny_assault/thorn_burst.json
 */

import type { Power } from '@/types';

export const ThornBurst: Power = {
  "name": "Thorn Burst",
  "internalName": "Thorn_Burst",
  "available": 19,
  "description": "You can explode dozens of Thorns in all directions around you. These Thorns only travel a short distance, but they can deal moderate damage and poison any target close to you. Toxic damage from the thorns can reduce the Defense of affected foes.Damage: Light.Recharge: Slow.",
  "shortHelp": "PBAoE Melee, Light DMG(Lethal), DoT(Toxic) -DEF",
  "icon": "thornyassault_thornburst.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 15,
    "recharge": 17,
    "endurance": 16.016,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.95,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 3,
      "table": "Melee_Debuff_Def"
    }
  }
};
