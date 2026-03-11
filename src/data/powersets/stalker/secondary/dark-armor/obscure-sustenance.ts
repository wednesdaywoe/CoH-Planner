/**
 * Obscure Sustenance
 * Self Heal, +Regen, Res(-ToHit, -Regeneration), +Recovery(Special)
 *
 * Source: stalker_defense/dark_armor/obscure_sustenance.json
 */

import type { Power } from '@/types';

export const ObscureSustenance: Power = {
  "name": "Obscure Sustenance",
  "internalName": "Obscure_Sustenance",
  "available": 19,
  "description": "You can tap the dark essence of the Netherworld increase your regeneration and recovery rate, as well as making you resistance to -ToHit and -Regeneration debuffs.This power is mutually exclusive from Dark Regeneration.",
  "shortHelp": "Self Heal, +Regen, Res(-ToHit, -Regeneration), +Recovery(Special)",
  "icon": "darkarmor_darkregeneration.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 2,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 1.93
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Heal",
    "scale": 2.5,
    "table": "Melee_HealSelf"
  },
  "effects": {
    "regenBuff": {
      "scale": 4.4399999999999995,
      "table": "Melee_Ones"
    },
    "durations": {
      "regenBuff": 60,
      "recoveryBuff": 30,
      "debuffResistance": 60
    },
    "recoveryBuff": {
      "scale": 1.08,
      "table": "Melee_Ones"
    },
    "debuffResistance": {
      "tohit": {
        "scale": 0.75,
        "table": "Melee_Res_Boolean"
      },
      "regeneration": {
        "scale": 0.75,
        "table": "Melee_Res_Boolean"
      }
    },
    "buffDuration": 60
  },
  "requires": "!Stalker_Defense.Dark_Armor.Dark_Regeneration"
};
