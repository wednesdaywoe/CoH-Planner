/**
 * Proton Sweep
 * Melee Cone, DoT(Energy/Toxic), Foe -Def, Special
 *
 * Source: tanker_melee/radiation_melee/proton_sweep.json
 */

import type { Power } from '@/types';

export const ProtonSweep: Power = {
  "name": "Proton Sweep",
  "internalName": "Proton_Sweep",
  "available": 3,
  "description": "You release a cloud of deadly radioactive particles in front of you inflicting Moderate Energy and Toxic damage over a short time as well as reducing the targets' defense. Affected enemies have a moderate chance to be affected by the Contaminated effect. Hitting Contaminated foes with single target Radiation Melee powers cause a small burst of damage to foes near the target.Notes: Thanks to gauntlet, this power can hit up to 5 targets above its cap at 1/3rd effectiveness.",
  "shortHelp": "Melee Cone, DoT(Energy/Toxic), Foe -Def, Special",
  "icon": "radiationmelee_protonsweep.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.309,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Tanker Archetype Sets",
    "Threat Duration",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Energy",
      "scale": 0.0894,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Toxic",
      "scale": 0.2681,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Fire",
      "scale": 0.1609,
      "table": "Melee_Damage",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.2,
      "table": "Melee_Debuff_Def"
    }
  }
};
