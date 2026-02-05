/**
 * Dehydrate
 * Ranged, DMG(Cold/Smash), Foe -Speed, -Defense, DoT(Cold), Self +Heal Over Time, +/- Tidal Power
 *
 * Source: defender_ranged/water_blast/dehydrate.json
 */

import type { Power } from '@/types';

export const Dehydrate: Power = {
  "name": "Dehydrate",
  "internalName": "Dehydrate",
  "available": 19,
  "description": "You rapidly dehydrate your target, causing Cold and Smashing damage, reducing their movement speed and defense as well as causing a measure of Cold damage over time. You are then healed over time for a moderate amount of health. Dehydrate grants 1 stack of Tidal Power if you have 2 or less. Dehydrate will consume all stacks of Tidal Power if you have 3, but the power's heal over time effect is increased by 50%.",
  "shortHelp": "Ranged, DMG(Cold/Smash), Foe -Speed, -Defense, DoT(Cold), Self +Heal Over Time, +/- Tidal Power",
  "icon": "waterblast_dehydrate.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 8,
    "endurance": 8.528,
    "castTime": 1.87
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Healing",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Accurate Healing",
    "Defender Archetype Sets",
    "Defense Debuff",
    "Healing",
    "Ranged Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Smashing",
      "scale": 0.25,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.75,
      "table": "Ranged_Damage"
    },
    {
      "type": "Cold",
      "scale": 0.1488,
      "table": "Ranged_Damage",
      "duration": 4.1,
      "tickRate": 1
    },
    {
      "type": "Heal",
      "scale": 0.275,
      "table": "Ranged_HealSelf",
      "duration": 3.1,
      "tickRate": 1
    },
    {
      "type": "Heal",
      "scale": 0.4125,
      "table": "Ranged_HealSelf",
      "duration": 3.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "movement": {
      "jumpHeight": {
        "scale": 0.2,
        "table": "Ranged_Slow"
      },
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
      }
    },
    "defenseDebuff": {
      "scale": 1,
      "table": "Ranged_Debuff_Def"
    }
  }
};
