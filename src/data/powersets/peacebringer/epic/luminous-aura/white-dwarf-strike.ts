/**
 * White Dwarf Strike
 * Melee, Light DMG(Smash/Energy), Foe -DEF, Knockback
 *
 * Source: peacebringer_defensive/luminous_aura/white_dwarf_strike.json
 */

import type { Power } from '@/types';

export const WhiteDwarfStrike: Power = {
  "name": "White Dwarf Strike",
  "available": 19,
  "description": "The White Dwarf Strike is a moderate melee attack that releases Kheldian light on impact, which can Knock Down foes, and reduce a target's Defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Very Fast.",
  "shortHelp": "Melee, Light DMG(Smash/Energy), Foe -DEF, Knockback",
  "icon": "luminousaura_whitedwarfstrike.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "EnduranceReduction",
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
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 3,
    "endurance": 4.368,
    "castTime": 1.2
  },
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf",
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.34,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Energy",
      "scale": 0.5,
      "table": "Melee_InherentDamage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Melee_Debuff_Def"
    }
  }
};
