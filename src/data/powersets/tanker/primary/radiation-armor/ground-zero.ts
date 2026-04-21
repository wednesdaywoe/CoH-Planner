/**
 * Ground Zero
 * PBAoE, Foe DMG(Energy), DoT (Toxic), -DEF(All), Ally +HP, +Heal over time
 *
 * Source: tanker_defense/radiation_armor/ground_zero.json
 */

import type { Power } from '@/types';

export const GroundZero: Power = {
  "name": "Ground Zero",
  "internalName": "Ground_Zero",
  "available": 21,
  "description": "You release a mixture of radiation into the area. Nearby foes will be barraged with harmful radiation and will suffer Moderate Energy damage immediately, followed by moderate toxic damage over time. Affected foes will also have their defense reduced. Nearby allies will be healed for a moderate amount and will recover health over time. This power can affect a total of 30 targets. This includes both friends and foes. Ground Zero has no effect on the caster, only nearby allies and enemies.",
  "shortHelp": "PBAoE, Foe DMG(Energy), DoT (Toxic), -DEF(All), Ally +HP, +Heal over time",
  "icon": "radiationarmor_groundzero.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.2,
    "radius": 15,
    "recharge": 90,
    "endurance": 13,
    "castTime": 3,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Healing",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Healing",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Heal",
      "scale": 1,
      "table": "Melee_HealSelf"
    },
    {
      "type": "Heal",
      "scale": 0.05,
      "table": "Melee_HealSelf",
      "duration": 9.1,
      "tickRate": 1
    },
    {
      "type": "Energy",
      "scale": 1,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 9.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 2,
      "table": "Melee_Debuff_Def"
    },
    "durations": {
      "defenseDebuff": 10
    },
    "buffDuration": 10
  }
};
