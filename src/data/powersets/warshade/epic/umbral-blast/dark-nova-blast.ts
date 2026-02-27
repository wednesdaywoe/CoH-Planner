/**
 * Dark Nova Blast
 * Ranged, Light DMG(Negative), Foe Knockback, -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/dark_nova_blast.json
 */

import type { Power } from '@/types';

export const DarkNovaBlast: Power = {
  "name": "Dark Nova Blast",
  "available": 3,
  "description": "A much more powerful, yet slower version of Dark Nova Bolt. Dark Nova Blast sends focused negative Nictus energy at a foe. This attack can knock down foes and will leave the targets' attack and movement speed slowed. This power is only available while in Dark Nova Form.  Damage: Light. Recharge: Fast.",
  "shortHelp": "Ranged, Light DMG(Negative), Foe Knockback, -Recharge, -SPD",
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
    "range": 100,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Dark Nova",
  "damage": {
    "type": "Negative",
    "scale": 1,
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
    },
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    }
  }
};
