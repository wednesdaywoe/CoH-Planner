/**
 * Ripper
 * Melee (Cone), DMG(Lethal), DoT(Toxic), Knockback, -SPD, -Recharge
 *
 * Source: stalker_melee/spines/ripper.json
 */

import type { Power } from '@/types';

export const Ripper: Power = {
  "name": "Ripper",
  "internalName": "Ripper",
  "available": 21,
  "description": "You can unleash a spectacular slashing maneuver that attacks all foes in a wide arc in front of you. Ripper deals massive lethal damage and poisons multiple targets. It can even knock foes down. Spine poison Slows affected targets and deals additional Toxic damage. If executed while hidden, all affected targets have a chance to be hit with a Critical Hit for extra damage.",
  "shortHelp": "Melee (Cone), DMG(Lethal), DoT(Toxic), Knockback, -SPD, -Recharge",
  "icon": "quills_bonesword.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 11,
    "endurance": 11.024,
    "castTime": 2.33,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Melee AoE Damage",
    "Slow Movement",
    "Stalker Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.7,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.2,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "rechargeDebuff": {
      "scale": 0.1,
      "table": "Melee_Slow"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Melee_Slow"
      }
    }
  }
};
