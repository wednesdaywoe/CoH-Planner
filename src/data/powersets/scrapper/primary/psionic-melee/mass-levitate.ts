/**
 * Mass Levitate
 * PBAoE, DMG(Smash), Foe Knock Up, +Insight
 *
 * Source: scrapper_melee/psionic_melee/mass_levitate.json
 */

import type { Power } from '@/types';

export const MassLevitate: Power = {
  "name": "Mass Levitate",
  "internalName": "Mass_Levitate",
  "available": 25,
  "description": "You build up a large amount of telekinetic energy and release it causing nearby foes to be flung into the air. Affected foes will suffer high Smashing damage. If the caster has Insight when this power is used Mass Levitate will also cause a moderate amount of Psionic damage over time.",
  "shortHelp": "PBAoE, DMG(Smash), Foe Knock Up, +Insight",
  "icon": "psionicmelee_masslevitate.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 10,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 2.5,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.42,
      "table": "Melee_Damage"
    },
    {
      "type": "Psionic",
      "scale": 0.142,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Smashing",
      "scale": 1.42,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 1.42,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.639,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockup": {
      "scale": 2,
      "table": "Melee_Knockback"
    }
  }
};
