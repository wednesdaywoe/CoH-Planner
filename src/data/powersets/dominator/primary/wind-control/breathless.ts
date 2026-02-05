/**
 * Breathless
 * Ranged (Targeted AoE), Variable DMG(Lethal), Immobilize (Foe), -DMG(Foe, All), +EndCost(Foe, PvP), Consumes Pressure
 *
 * Source: dominator_control/wind_control/breathless.json
 */

import type { Power } from '@/types';

export const Breathless: Power = {
  "name": "Breathless",
  "internalName": "Breathless",
  "available": 1,
  "description": "You release all available Pressure to create a localized high pressure sphere at a location of your choosing. This high pressure crushes foes continually while they remain within the sphere, causing lethal damage over time. Affected foes will be immobilized and suffer from a reduced attack speed. In normal combat, affected foes will also suffer reduced damage potential, while in PvP, affected foes will suffer from increased endurance cost of their powers. The damage done increases in proportion to the amount of Pressure released when using this power. Also, Breathless can reduce the damage potential of all targets, in PvE or PvP, if used at the lowest levels of Pressure accumulation.Damage: Variable.Recharge: Moderate.",
  "shortHelp": "Ranged (Targeted AoE), Variable DMG(Lethal), Immobilize (Foe), -DMG(Foe, All), +EndCost(Foe, PvP), Consumes Pressure",
  "icon": "windcontrol_breathless.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 0.9,
    "range": 80,
    "radius": 30,
    "recharge": 8,
    "endurance": 19.5,
    "castTime": 2.07,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Dominator Archetype Sets",
    "Immobilize",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Lethal",
    "scale": 0.3,
    "table": "Ranged_Damage"
  },
  "effects": {
    "immobilize": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Immobilize"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Dam"
    },
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
