/**
 * Fling Thorns
 * Ranged (Cone), Light DMG(Lethal), DoT(Toxic) -DEF
 *
 * Source: dominator_assault/thorny_assault/fling_thorns.json
 */

import type { Power } from '@/types';

export const FlingThorns: Power = {
  "name": "Fling Thorns",
  "internalName": "Fling_Thorns",
  "available": 3,
  "description": "You can throw dozens of Thorns in a wide cone in front of you, impaling foes caught within the area. These Thorns deals moderate damage, and poisons any targets it hits. Thorn poison deals additional Toxic damage and can reduce your foes' Defense.Damage: Light.Recharge: Moderate.",
  "shortHelp": "Ranged (Cone), Light DMG(Lethal), DoT(Toxic) -DEF",
  "icon": "thornyassault_flingthorns.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 30,
    "radius": 30,
    "arc": 1.5708,
    "recharge": 10,
    "endurance": 11.1754,
    "castTime": 1.63,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.7747,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.086,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Def"
    }
  }
};
