/**
 * White Dwarf Smite
 * Melee, Light DMG(Energy/Smash), Foe -DEF, -Fly, Disorient
 *
 * Source: peacebringer_defensive/luminous_aura/white_dwarf_smite.json
 */

import type { Power } from '@/types';

export const WhiteDwarfSmite: Power = {
  "name": "White Dwarf Smite",
  "available": 19,
  "description": "White Dwarf Smite is powerful melee attack that can often Disorient or Knock Down opponents. White Dwarf Smite can also bring down fliers, and reduce their defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Melee, Light DMG(Energy/Smash), Foe -DEF, -Fly, Disorient",
  "icon": "luminousaura_whitedwarfsmite.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
    "Stun",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Kheldian Archetype Sets",
    "Knockback",
    "Melee Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1.2,
    "range": 7,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.32,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 1,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "stun": {
      "mag": 2,
      "scale": 6,
      "table": "Melee_Stun"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Melee_Ones"
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
