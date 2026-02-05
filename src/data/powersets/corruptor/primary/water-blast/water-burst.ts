/**
 * Water Burst
 * Ranged (Targeted AoE), DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self -Tidal Power
 *
 * Source: corruptor_ranged/water_blast/water_burst.json
 */

import type { Power } from '@/types';

export const WaterBurst: Power = {
  "name": "Water Burst",
  "internalName": "Water_Burst",
  "available": 1,
  "description": "You cause water to violently explode from beneath your target's feet blasting all foes nearby with freezing cold water. Affected targets will suffer Cold and Smashing damage, have their movement speed reduced and may be knocked down by the force of the blast. Water Burst consumes all Tidal Power. It will deal additional cold damage and have a greater chance to knockdown for each stack of Tidal Power. If you have 3 stacks of Tidal Power Water Burst will have a 100% chance to knock the targets into the air.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Cold/Smash), Foe -Speed, Knockdown, +Wet, Self -Tidal Power",
  "icon": "waterblast_waterburst.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "radius": 15,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 1.73,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.225,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.675,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.9,
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Cold",
      "scale": 0.045,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.108,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.225,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Ranged_Ones"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.3,
        "table": "Ranged_Slow"
      }
    }
  }
};
