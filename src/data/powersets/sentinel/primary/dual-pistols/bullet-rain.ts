/**
 * Bullet Rain
 * Ranged (Targeted AoE), DMG(Lethal/Special), Knockback/Special
 *
 * Source: sentinel_ranged/dual_pistols/bullet_rain.json
 */

import type { Power } from '@/types';

export const BulletRain: Power = {
  "name": "Bullet Rain",
  "internalName": "Bullet_Rain",
  "available": 11,
  "description": "You fire your pistols faster than the human eye can follow, causing your bullet trajectory to arc, dealing moderate Lethal damage and possibly knocking your foes back.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockback to:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "Ranged (Targeted AoE), DMG(Lethal/Special), Knockback/Special",
  "icon": "dualpistols_explosiveclip.png",
  "powerType": "Click",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.1,
    "range": 40,
    "radius": 15,
    "recharge": 18,
    "endurance": 16.848,
    "castTime": 1.67,
    "maxTargets": 10
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
    "Knockback",
    "Ranged AoE Damage",
    "Sentinel Archetype Sets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.233,
      "table": "Ranged_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.113,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    },
    {
      "type": "Lethal",
      "scale": 0.1,
      "table": "Ranged_Damage",
      "duration": 1.1,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "knockback": {
      "scale": 2,
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
    }
  }
};
