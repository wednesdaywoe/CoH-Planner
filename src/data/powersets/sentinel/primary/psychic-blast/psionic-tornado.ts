/**
 * Psionic Tornado
 * Ranged (Targeted AoE), Moderate DoT(Psionic), Foe Knockback
 *
 * Source: sentinel_ranged/psychic_blast/psionic_tornado.json
 */

import type { Power } from '@/types';

export const PsionicTornado: Power = {
  "name": "Psionic Tornado",
  "internalName": "Psionic_Tornado",
  "available": 17,
  "description": "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed.Damage: Light.Recharge: Slow.",
  "shortHelp": "Ranged (Targeted AoE), Moderate DoT(Psionic), Foe Knockback",
  "icon": "psychicblast_psionictornado.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 50,
    "radius": 20,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.178,
    "table": "Ranged_Damage",
    "duration": 4.1,
    "tickRate": 1
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    }
  }
};
