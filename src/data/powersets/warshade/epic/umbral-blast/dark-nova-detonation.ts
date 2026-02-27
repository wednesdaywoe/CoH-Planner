/**
 * Dark Nova Detonation
 * Ranged (Targeted AoE), Light DMG(Negative), Foe Knockback, -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/dark_nova_detonation.json
 */

import type { Power } from '@/types';

export const DarkNovaDetonation: Power = {
  "name": "Dark Nova Detonation",
  "available": 3,
  "description": "You hurl a blast of Dark Matter that violently explodes on impact, damaging all foes near the target. All affected targets' attack and movement speed are slowed. Some foes may be knocked down. This power is only available while in Dark Nova Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Light DMG(Negative), Foe Knockback, -Recharge, -SPD",
  "icon": "umbralblast_darkmatterdetonation.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 16,
    "endurance": 15.184,
    "castTime": 2.5,
    "radius": 15,
    "maxTargets": 16
  },
  "targetType": "Foe (Alive)",
  "requires": "Dark Nova",
  "damage": {
    "type": "Negative",
    "scale": 0.9,
    "table": "Ranged_InherentDamage"
  },
  "effects": {
    "knockback": {
      "scale": 2,
      "table": "Ranged_Knockback"
    },
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "runSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    }
  }
};
