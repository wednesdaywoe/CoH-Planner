/**
 * Heavy Blow
 * Melee, DMG(Smash), Foe Knockdown, Combo Builder
 *
 * Source: scrapper_melee/brawling/heavy_blow.json
 */

import type { Power } from '@/types';

export const HeavyBlow: Power = {
  "name": "Heavy Blow",
  "internalName": "Heavy_Blow",
  "available": 0,
  "description": "You strike your foe with a powerful punch dealing Moderate Smashing damage. Heavy Blow has a fair chance to knock the target off its feet. Heavy Blow is a Combo Builder and adds 1 Combo Level.",
  "shortHelp": "Melee, DMG(Smash), Foe Knockdown, Combo Builder",
  "icon": "brawling_heavyblow.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "recharge": 5,
    "endurance": 6.032,
    "castTime": 1.07
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Scrapper Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 1.16,
      "table": "Melee_Damage"
    },
    {
      "type": "Smashing",
      "scale": 1.16,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Smashing",
      "scale": 1.16,
      "table": "Melee_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.522,
      "table": "Melee_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    }
  }
};
