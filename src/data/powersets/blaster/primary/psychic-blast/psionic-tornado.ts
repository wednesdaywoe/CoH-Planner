/**
 * Psionic Tornado
 * Ranged (Targeted AoE), Dmg(Psionic), Foe Knockback
 *
 * Source: blaster_ranged/psychic_blast/psionic_tornado.json
 */

import type { Power } from '@/types';

export const PsionicTornado: Power = {
  "name": "Psionic Tornado",
  "internalName": "Psionic_Tornado",
  "available": 17,
  "description": "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed.",
  "shortHelp": "Ranged (Targeted AoE), Dmg(Psionic), Foe Knockback",
  "icon": "psychicblast_psionictornado.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "range": 100,
    "radius": 15,
    "recharge": 20,
    "endurance": 18.512,
    "castTime": 1.83,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 1.1,
    "table": "Ranged_Damage"
  },
  "effects": {
    "rechargeDebuff": {
      "scale": 0.3,
      "table": "Ranged_Slow"
    },
    "knockup": {
      "scale": 1.4,
      "table": "Ranged_Ones"
    }
  }
};
