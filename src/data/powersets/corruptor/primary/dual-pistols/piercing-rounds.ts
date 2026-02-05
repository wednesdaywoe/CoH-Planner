/**
 * Piercing Rounds
 * Narrow Ranged (Cone), DMG(Lethal/Special), Foes -Res(All)/Special
 *
 * Source: corruptor_ranged/dual_pistols/piercing_rounds.json
 */

import type { Power } from '@/types';

export const PiercingRounds: Power = {
  "name": "Piercing Rounds",
  "internalName": "Piercing_Rounds",
  "available": 21,
  "description": "You fire your pistols with deadly precision in a very narrow cone, piercing up to three enemies. Piercing Rounds deals Superior lethal damage and reduces targets' Damage Resistance for a short time.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic, and a secondary effect will be included in this attack:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.Damage: High.Recharge: Slow.",
  "shortHelp": "Narrow Ranged (Cone), DMG(Lethal/Special), Foes -Res(All)/Special",
  "icon": "dualpistols_piercingrounds.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "radius": 80,
    "arc": 0.0873,
    "recharge": 15,
    "endurance": 14.352,
    "castTime": 2.5,
    "maxTargets": 3
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Corruptor Archetype Sets",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.61,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 2.3,
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Fire",
      "scale": 0.69,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.169,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.69,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.69,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.69,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "resistanceDebuff": {
      "smashing": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "lethal": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "fire": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "cold": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "energy": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "negative": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "psionic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      },
      "toxic": {
        "scale": 2,
        "table": "Ranged_Res_Dmg"
      }
    },
    "movement": {
      "runSpeed": {
        "scale": 0.15,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.15,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.15,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.15,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.15,
      "table": "Ranged_Slow"
    },
    "damageDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
