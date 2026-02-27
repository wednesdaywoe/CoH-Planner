/**
 * Executioner's Shot
 * Ranged, DMG(Lethal/Special), Foe -Defense, Knockback/Special
 *
 * Source: blaster_ranged/dual_pistols/executioners_shot.json
 */

import type { Power } from '@/types';

export const ExecutionersShot: Power = {
  "name": "Executioner's Shot",
  "internalName": "Executioners_Shot",
  "available": 17,
  "description": "Executioner's Shot is a deadly ranged attack. Foes struck by this attack will suffer lethal damage and will likely be knocked back by the impact of this attack. Targets struck by Executioner's Shot while no special ammunition is equipped will have their defenses reduced for a short time.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "Ranged, DMG(Lethal/Special), Foe -Defense, Knockback/Special",
  "icon": "dualpistols_executionersshot.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.25,
    "range": 80,
    "recharge": 10,
    "endurance": 10.4,
    "castTime": 1.67
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.484,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.636,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.169,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.636,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.636,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.636,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
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
    },
    "defenseDebuff": {
      "scale": 1.25,
      "table": "Ranged_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
