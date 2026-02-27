/**
 * Upthrust
 * Targeted AoE, DMG(Smash), -Fly, -Defense, Chance to Knockback
 *
 * Source: blaster_ranged/seismic_blast/upthrust.json
 */

import type { Power } from '@/types';

export const Upthrust: Power = {
  "name": "Upthrust",
  "internalName": "Upthrust",
  "available": 11,
  "description": "You channel seismic energy into the earth, causing a micro-fault to erupt under your target. This causes a shard of rock to thrust upward out of the ground, dealing smashing damage and lowering their defense. Affected foes will become heavy, limiting their ability to jump and fly for a short time. The force of the eruption can knockback enemies.Upthrust grants two stacks of Seismic Pressure.",
  "shortHelp": "Targeted AoE, DMG(Smash), -Fly, -Defense, Chance to Knockback",
  "icon": "seismicblast_upthrust.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.2,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Smashing",
    "scale": 0.8985,
    "table": "Ranged_Damage"
  },
  "effects": {
    "defenseDebuff": {
      "scale": 0.7,
      "table": "Ranged_Debuff_Def"
    },
    "slow": {
      "fly": {
        "scale": 1.6,
        "table": "Ranged_Ones"
      }
    },
    "movement": {
      "jumpSpeed": {
        "scale": 1,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 1,
        "table": "Ranged_Slow"
      }
    },
    "knockback": {
      "scale": 0.33,
      "table": "Ranged_Ones"
    }
  }
};
