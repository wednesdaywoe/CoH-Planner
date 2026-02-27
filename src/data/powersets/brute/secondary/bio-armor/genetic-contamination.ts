/**
 * Genetic Contamination
 * Toggle: PBAoE, Minor DoT(Toxic), -Damage(All)
 *
 * Source: brute_defense/bio_organic_armor/genetic_contamination.json
 */

import type { Power } from '@/types';

export const GeneticContamination: Power = {
  "name": "Genetic Contamination",
  "internalName": "Genetic_Contamination",
  "available": 27,
  "description": "You're capable of breaking down the genetic material of your foes with a powerful toxin that is produced by your Bio Armor. Nearby foes affected by this poison will suffer toxic damage over time as well as dealing reduced damage. While Defensive Adaptation is active this power's damage debuff is increased in effectiveness.Damage: Minor.Recharge: Fast.",
  "shortHelp": "Toggle: PBAoE, Minor DoT(Toxic), -Damage(All)",
  "icon": "bioorganicarmor_geneticcontamination.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 8,
    "recharge": 4,
    "endurance": 1.04,
    "castTime": 1.07,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Taunt",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Brute Archetype Sets",
    "Melee AoE Damage",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Toxic",
    "scale": 0.15,
    "table": "Melee_Damage"
  },
  "effects": {
    "damageDebuff": {
      "scale": 1.995,
      "table": "Melee_Debuff_Dam"
    }
  }
};
