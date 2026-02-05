/**
 * Empty Clips
 * Ranged (Cone), DMG(Lethal/Special), Foe -Defense, Knockdown/Special
 *
 * Source: defender_ranged/dual_pistols/empty_clips.json
 */

import type { Power } from '@/types';

export const EmptyClips: Power = {
  "name": "Empty Clips",
  "internalName": "Empty_Clips",
  "available": 3,
  "description": "You empty the clips of both your pistols in an arc of suppression fire. This attack can blast multiple foes in the affected cone area, and has a small chance of knocking some foes down. Affected targets will have their defense reduced slightly as well if Standard Ammo is equipped.Changing your ammo type with the 'Swap Ammo' power will change your secondary damage from lethal to cold, fire or toxic.Additionally, changing your ammunition type will also change the secondary effect of this attack from Knockdown to:*A minor attack speed and movement speed debuff if 'Cryo Ammo' is loaded.*A minor damage over time effect if 'Incendiary Ammo' is loaded.*A -damage effect if 'Chemical Ammo' is loaded.",
  "shortHelp": "Ranged (Cone), DMG(Lethal/Special), Foe -Defense, Knockdown/Special",
  "icon": "dualpistols_emptyclips.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1.1,
    "range": 40,
    "radius": 40,
    "arc": 0.5236,
    "recharge": 10,
    "endurance": 10.192,
    "castTime": 1.67,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.182,
      "table": "Ranged_Damage",
      "duration": 1.6,
      "tickRate": 0.5
    },
    {
      "type": "Fire",
      "scale": 0.078,
      "table": "Ranged_Damage",
      "duration": 1.6,
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
      "scale": 0.078,
      "table": "Ranged_Damage",
      "duration": 1.6,
      "tickRate": 0.5
    },
    {
      "type": "Toxic",
      "scale": 0.078,
      "table": "Ranged_Damage",
      "duration": 1.6,
      "tickRate": 0.5
    },
    {
      "type": "Lethal",
      "scale": 0.078,
      "table": "Ranged_Damage",
      "duration": 1.6,
      "tickRate": 0.5
    }
  ],
  "effects": {
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    },
    "knockback": {
      "scale": 0.4,
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
