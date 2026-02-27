/**
 * Dark Nova Emanation
 * Ranged (Cone), Light DMG(Negative), Foe -Recharge, -SPD, Knockback
 *
 * Source: warshade_offensive/umbral_blast/dark_nova_emanation.json
 */

import type { Power } from '@/types';

export const DarkNovaEmanation: Power = {
  "name": "Dark Nova Emanation",
  "available": 3,
  "description": "Sends bolts of Nictus dark energy to multiple targets at once within a cone area in front of the caster. Deals moderate negative energy damage to each affected foe and reduces their attack rate and movement speed. This power is only available while in Dark Nova Form.  Damage: Light. Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Light DMG(Negative), Foe -Recharge, -SPD, Knockback",
  "icon": "umbralblast_graviticemanation.png",
  "powerType": "Click",
  "effectArea": "Cone",
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
    "range": 60,
    "recharge": 12,
    "endurance": 11.856,
    "castTime": 1.5,
    "radius": 60,
    "arc": 0.7854,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "requires": "Dark Nova",
  "damage": {
    "type": "Negative",
    "scale": 0.99,
    "table": "Ranged_InherentDamage"
  },
  "effects": {
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
