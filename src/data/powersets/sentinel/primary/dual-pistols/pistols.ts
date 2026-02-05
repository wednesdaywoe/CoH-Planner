/**
 * Pistols
 * Ranged, DMG(Lethal/Special), Foe -Defense
 *
 * Source: sentinel_ranged/dual_pistols/pistols.json
 */

import type { Power } from '@/types';

export const Pistols: Power = {
  "name": "Pistols",
  "internalName": "Pistols",
  "available": 0,
  "description": "Quickly fires a round from one of your heavy automatic pistols. Damage is average, but the fire rate is very fast. If standard ammo is used, Pistols will also reduce the target's Defense.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from -Defense to:*A -minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A -minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage debuff effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "Ranged, DMG(Lethal/Special), Foe -Defense",
  "icon": "dualpistols_pistols.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1.1,
    "range": 60,
    "recharge": 4,
    "endurance": 5.2,
    "castTime": 1
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.7,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.075,
      "table": "Ranged_Damage",
      "duration": 2.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.3,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.3,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "movement": {
      "runSpeed": {
        "scale": 0.12,
        "table": "Ranged_Slow"
      },
      "flySpeed": {
        "scale": 0.12,
        "table": "Ranged_Slow"
      },
      "jumpSpeed": {
        "scale": 0.12,
        "table": "Ranged_Slow"
      },
      "jumpHeight": {
        "scale": 0.12,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.12,
      "table": "Ranged_Slow"
    },
    "damageDebuff": {
      "scale": 0.8,
      "table": "Ranged_Debuff_Dam"
    }
  }
};
