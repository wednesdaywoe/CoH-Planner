/**
 * Hail of Bullets
 * PBAoE, DMG(Lethal/Special), Self +Def(Melee, Ranged, AoE), Foe Knockdown/Special
 *
 * Source: blaster_ranged/dual_pistols/hail_of_bullets.json
 */

import type { Power } from '@/types';

export const HailofBullets: Power = {
  "name": "Hail of Bullets",
  "internalName": "Hail_of_Bullets",
  "available": 25,
  "description": "You fire a hail of bullets at all enemies around you dealing Extreme lethal damage. Enemies that are struck have a chance to be knocked down. Having Standard Rounds will dramatically increase this chance to knockdown your foes. If you hit at least one target you will gain a moderate melee, ranged and AoE Defense bonus for a brief period.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from a guaranteed knockdown effect to:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "PBAoE, DMG(Lethal/Special), Self +Def(Melee, Ranged, AoE), Foe Knockdown/Special",
  "icon": "dualpistols_hailofbullets.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1.4,
    "radius": 25,
    "recharge": 105,
    "endurance": 20.8,
    "castTime": 2.47,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Recharge",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Blaster Archetype Sets",
    "Knockback",
    "Melee AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.3178,
      "table": "Ranged_Damage",
      "duration": 2.3,
      "tickRate": 0.2
    },
    {
      "type": "Lethal",
      "scale": 0.1362,
      "table": "Ranged_Damage",
      "duration": 2.3,
      "tickRate": 0.2
    },
    {
      "type": "Fire",
      "scale": 0.1362,
      "table": "Ranged_Damage",
      "duration": 2.3,
      "tickRate": 0.2
    },
    {
      "type": "Fire",
      "scale": 0.2,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    },
    {
      "type": "Cold",
      "scale": 0.1362,
      "table": "Ranged_Damage",
      "duration": 2.3,
      "tickRate": 0.2
    },
    {
      "type": "Toxic",
      "scale": 0.1362,
      "table": "Ranged_Damage",
      "duration": 2.3,
      "tickRate": 0.2
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.4,
      "table": "Ranged_Ones"
    },
    "movement": {
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
      },
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.2,
      "table": "Ranged_Slow"
    },
    "damageDebuff": {
      "scale": 2,
      "table": "Ranged_Debuff_Dam"
    },
    "defenseBuff": {
      "ranged": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "melee": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      },
      "aoe": {
        "scale": 1.5,
        "table": "Ranged_Buff_Def"
      }
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
