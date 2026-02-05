/**
 * Dual Wield
 * Ranged, DMG(Lethal/Special), Foe Knockback/Special
 *
 * Source: blaster_ranged/dual_pistols/dual_wield.json
 */

import type { Power } from '@/types';

export const DualWield: Power = {
  "name": "Dual Wield",
  "internalName": "Dual_Wield",
  "available": 0,
  "description": "Dual Wield fires both pistols in rapid succession at its desired target. This power is slower than Pistols, but deals more damage, and the target may get knocked back by the force of the impact.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "Ranged, DMG(Lethal/Special), Foe Knockback/Special",
  "icon": "dualpistols_dualwield.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 80,
    "recharge": 6,
    "endurance": 6.864,
    "castTime": 1.67
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
    "Blaster Archetype Sets",
    "Knockback",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.924,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.396,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.113,
      "table": "Ranged_Damage",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.396,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.396,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.396,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.75,
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
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
