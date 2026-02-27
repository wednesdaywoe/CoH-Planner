/**
 * Reaction Time
 * Toggle (PBAoE), Self Absorb over Time, +Recovery, Foe –Rech, - Move, Special
 *
 * Source: blaster_support/martial_manipulation/reaction_time.json
 */

import type { Power } from '@/types';

export const ReactionTime: Power = {
  "name": "Reaction Time",
  "internalName": "Reaction_Time",
  "available": 19,
  "description": "You attune yourself to the world around you, moving with preternatural speed. All enemies nearby move slowly and have reduced recharge, and you can absorb small amounts of damage every 2 seconds. When Reaction Time is deactivated, you gain a burst of speed for a short duration, increasing your own recharge and move speed.Recharge: Moderate.",
  "shortHelp": "Toggle (PBAoE), Self Absorb over Time, +Recovery, Foe –Rech, - Move, Special",
  "icon": "martialmanipulation_reactiontime.png",
  "powerType": "Toggle",
  "targetType": "Self",
  "effectArea": "AoE",
  "stats": {
    "accuracy": 1,
    "radius": 30,
    "recharge": 10,
    "castTime": 1.83,
    "maxTargets": 10
  },
  "allowedEnhancements": [
    "EnduranceModification",
    "Slow",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Endurance Modification",
    "Healing",
    "Slow Movement"
  ],
  "maxSlots": 6,
  "effects": {
    "movement": {
      "runSpeed": {
        "scale": 1,
        "table": "Melee_SpeedRunning"
      },
      "flySpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    },
    "rechargeDebuff": {
      "scale": 0.4,
      "table": "Melee_Slow"
    },
    "slow": {
      "runSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "flySpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpSpeed": {
        "scale": 0.7,
        "table": "Melee_Slow"
      },
      "jumpHeight": {
        "scale": 0.7,
        "table": "Melee_Slow"
      }
    }
  }
};
