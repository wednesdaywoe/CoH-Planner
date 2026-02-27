/**
 * Dark Nova Bolt
 * Ranged, Minor DMG(Negative), Foe -Recharge, -SPD
 *
 * Source: warshade_offensive/umbral_blast/dark_nova_bolt.json
 */

import type { Power } from '@/types';

export const DarkNovaBolt: Power = {
  "name": "Dark Nova Bolt",
  "available": 3,
  "description": "A very quick, but low damage attack that lowers your target's attack and movement speed. This power is only available while in Dark Nova Form.  Damage: Minor. Recharge: Very Fast.",
  "shortHelp": "Ranged, Minor DMG(Negative), Foe -Recharge, -SPD",
  "icon": "umbralblast_shadowbolt.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "maxSlots": 6,
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Kheldian Archetype Sets",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "stats": {
    "accuracy": 1,
    "range": 100,
    "recharge": 1.5,
    "endurance": 3.12,
    "castTime": 1.5
  },
  "targetType": "Foe (Alive)",
  "requires": "Dark Nova",
  "damage": {
    "type": "Negative",
    "scale": 0.6,
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
