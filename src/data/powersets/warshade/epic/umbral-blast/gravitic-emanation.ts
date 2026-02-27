/**
 * Gravitic Emanation
 * Ranged (Cone), Minor DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/gravitic_emanation.json
 */

import type { Power } from '@/types';

export const GraviticEmanation: Power = {
  "name": "Gravitic Emanation",
  "available": 19,
  "description": "Gravitic Emanation sends bolts of dark Nictus energy to multiple targets within a cone area in front of the caster. Gravitic Emanation deals only minor Negative Energy damage to each affected foe, but knocks them back, leaving them Disoriented and with reduced attack rate and movement speed.  Damage: Minor. Recharge: Slow.",
  "shortHelp": "Ranged (Cone), Minor DMG(Negative), Foe Disorient, Knockback, -Recharge, -SPD",
  "icon": "umbralblast_graviticemanation.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Stun",
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
    "Stuns",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 40,
    "recharge": 45,
    "endurance": 14.352,
    "castTime": 1,
    "radius": 40,
    "arc": 0.7854,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Negative",
    "scale": 0.4,
    "table": "Ranged_Damage"
  },
  "effects": {
    "knockback": {
      "scale": 5,
      "table": "Ranged_Knockback"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Ranged_Stun"
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
