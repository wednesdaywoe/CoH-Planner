/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Fitness
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\fitness
 */

const POOL_FITNESS = {
  "id": "fitness",
  "name": "Fitness",
  "displayName": "Fitness",
  "description": "You become a pillar of fitness, and can receive a bonus to your basic physical attributes. These abilities are always on and do not cost any Endurance.",
  "icon": "fitness_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Swift",
      "fullName": "Pool.Fitness.Quick",
      "rank": 1,
      "available": 5,
      "description": "You can naturally run slightly faster than normal.<br><br>This ability is always on and does not cost any Endurance.",
      "shortHelp": "Auto: Self +SPD",
      "icon": "fitness_quick.png",
      "powerType": "Auto",
      "requires": "!Inherent.Fitness.Swift",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "runSpeed": {
          "scale": 0.1,
          "table": "Melee_SpeedRunning"
        },
        "flySpeed": {
          "scale": 0.1,
          "table": "Melee_SpeedFlying"
        }
      }
    },
    {
      "name": "Hurdle",
      "fullName": "Pool.Fitness.Hurdle",
      "rank": 2,
      "available": 5,
      "description": "You can naturally jump higher than normal.<br><br>This ability is always on and does not cost any Endurance.",
      "shortHelp": "Auto: Self +Leap",
      "icon": "fitness_hurdle.png",
      "powerType": "Auto",
      "requires": "!Inherent.Fitness.Hurdle",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Jump"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 0.06,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 0.5,
          "table": "Melee_SpeedJumping"
        }
      }
    },
    {
      "name": "Health",
      "fullName": "Pool.Fitness.Health",
      "rank": 3,
      "available": 13,
      "description": "You heal slightly faster than a normal person. Your improved Health also grants you resistance to Sleep.<br><br>This ability is always on and does not cost any Endurance.<br><br>You must be at least level 14 and have Swift or Hurdle before selecting Health.",
      "shortHelp": "Auto: Self +Regeneration, Res(Sleep)",
      "icon": "fitness_health.png",
      "powerType": "Auto",
      "requires": "!Inherent.Fitness.Health && (Pool.Fitness.Hurdle || Pool.Fitness.Quick)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 0.4,
          "table": "Melee_Ones"
        },
        "resistance": {}
      }
    },
    {
      "name": "Stamina",
      "fullName": "Pool.Fitness.Stamina",
      "rank": 4,
      "available": 19,
      "description": "You recover Endurance slightly more quickly than normal.<br><br>This ability is always on and does not cost any Endurance.<br><br>You must be at least level 20 and have two other Fitness Powers before selecting Stamina.",
      "shortHelp": "Auto: Self +Recovery",
      "icon": "fitness_stamina.png",
      "powerType": "Auto",
      "requires": "!Inherent.Fitness.Stamina && (Pool.Fitness.Health && Pool.Fitness.Hurdle || Pool.Fitness.Health && Pool.Fitness.Quick || Pool.Fitness.Hurdle && Pool.Fitness.Quick)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "recovery": {
          "scale": 0.25,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['fitness'] = POOL_FITNESS;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
