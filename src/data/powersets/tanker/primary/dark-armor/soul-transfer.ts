/**
 * Soul Transfer
 * Self Rez, +Absorb, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, -ToHit, -Endurance), +Special, Foe Disorient
 *
 * Source: tanker_defense/dark_armor/soul_transfer.json
 */

import type { Power } from '@/types';

export const SoulTransfer: Power = {
  "name": "Soul Transfer",
  "internalName": "Soul_Transfer",
  "available": 25,
  "description": "You transfer the souls of nearby enemies into yourself, stunning them while making you able to absorb some damage. This will also make you resistant to control effects, -ToHit debuffs and endurance drain for a short time. You can use this power while concious or after defeat. If used while concious and are defeated soon after, you will automatically bounce back into the fight. If used after defeat, Soul Transfer will also inflict damage as you suck the life force of all foes around you and bring yourself back from the brink of death. This form of the power is much more likely to stun foes.Notes: This power recharges in 10 seconds if no foes are hit. Otherwise, it recharges in 300 seconds.",
  "shortHelp": "Self Rez, +Absorb, +Res(Disorient, Sleep, Hold, Immobilize, Knockback, -ToHit, -Endurance), +Special, Foe Disorient",
  "icon": "darkarmor_soultransfer.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 25,
    "recharge": 10,
    "endurance": 10.4,
    "castTime": 1.17,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Stun",
    "Recharge",
    "Healing",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Healing",
    "Endurance Modification",
    "Healing",
    "Melee AoE Damage",
    "Stuns",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "absorb": {
      "scale": 2.2,
      "table": "Melee_HealSelf"
    },
    "durations": {
      "absorb": 30,
      "fear": 30,
      "hold": 30,
      "immobilize": 30,
      "stun": 30,
      "sleep": 30,
      "knockback": 30,
      "debuffResistance": 30
    },
    "fear": {
      "mag": 1,
      "scale": 25,
      "table": "Melee_Res_Boolean"
    },
    "effectDuration": 30,
    "hold": {
      "mag": 1,
      "scale": 25,
      "table": "Melee_Res_Boolean"
    },
    "immobilize": {
      "mag": 1,
      "scale": 25,
      "table": "Melee_Res_Boolean"
    },
    "stun": {
      "mag": 3,
      "scale": 10,
      "table": "Melee_Stun"
    },
    "sleep": {
      "mag": 1,
      "scale": 25,
      "table": "Melee_Res_Boolean"
    },
    "knockback": {
      "scale": 1.25,
      "table": "Melee_Res_Boolean"
    },
    "debuffResistance": {
      "endurance": {
        "scale": 0.11,
        "table": "Melee_Res_Boolean"
      },
      "tohit": {
        "scale": 0.11,
        "table": "Melee_Res_Boolean"
      }
    },
    "buffDuration": 30
  }
};
