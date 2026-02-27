/**
 * Thorn Barrage
 * Ranged, Extreme DMG(Lethal), DoT(Toxic) -DEF
 *
 * Source: dominator_assault/thorny_assault/thorn_barrage.json
 */

import type { Power } from '@/types';

export const ThornBarrage: Power = {
  "name": "Thorn Barrage",
  "internalName": "Thorn_Barrage",
  "available": 29,
  "description": "A devastating attack, Thorn Barrage unleashes your Thorns at high velocity causing severe damage at range. The impact of this attack can knock most foes on their back. Thorn poison deals additional Toxic damage and can reduce your foes Defense.Damage: Extreme.Recharge: Slow.",
  "shortHelp": "Ranged, Extreme DMG(Lethal), DoT(Toxic) -DEF",
  "icon": "thornyassault_thornbarrage.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 18,
    "endurance": 15.5765,
    "castTime": 2
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Knockback",
    "Ranged Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.81,
      "table": "Ranged_Damage",
      "duration": 1.75,
      "tickRate": 0.5
    },
    {
      "type": "Toxic",
      "scale": 0.1529,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    },
    "defenseDebuff": {
      "scale": 3,
      "table": "Ranged_Debuff_Def"
    }
  }
};
