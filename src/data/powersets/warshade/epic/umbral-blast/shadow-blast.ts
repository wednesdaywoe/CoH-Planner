/**
 * Shadow Blast
 * Ranged, Moderate DMG(Negative), Foe Knockback, -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/shadow_blast.json
 */

import type { Power } from '@/types';

export const ShadowBlast: Power = {
  "name": "Shadow Blast",
  "available": 5,
  "description": "A much more powerful, yet slower version of Shadow Bolt. Shadow Blast sends focused negative Nictus energy at a foe. This attack can knock down foes and will leave the target's attack rate and movement speed slowed.  Damage: Moderate. Recharge: Moderate.",
  "shortHelp": "Ranged, Moderate DMG(Negative), Foe Knockback, -Recharge, -SPD",
  "icon": "umbralblast_shadowblast.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
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
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.67
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Negative",
    "scale": 1.64,
    "table": "Ranged_Damage"
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
    },
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    }
  }
};
