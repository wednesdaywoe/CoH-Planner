/**
 * Executioner's Shot
 * Ranged, DMG(Lethal/Special), Foe -Defense, Knockback/Special
 *
 * Source: sentinel_ranged/dual_pistols/executioners_shot.json
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
    "range": 60,
    "recharge": 10,
    "endurance": 10.192,
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
    "Defense Debuff",
    "Knockback",
    "Ranged Damage",
    "Sentinel Archetype Sets",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.372,
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
      "type": "Lethal",
      "scale": 0.588,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1.25,
      "table": "Ranged_Debuff_Def"
    },
    "durations": {
      "defenseDebuff": 8
    },
    "knockback": {
      "scale": 1,
      "table": "Ranged_Knockback"
    },
    "buffDuration": 8
  }
};
