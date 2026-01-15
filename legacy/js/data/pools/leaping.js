/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Leaping
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\leaping
 */

const POOL_LEAPING = {
  "id": "leaping",
  "name": "Leaping",
  "displayName": "Leaping",
  "description": "Grants you various travel and combat jumping abilities. Jumping powers tend to be very efficient and use very little endurance compared to other travel powers.",
  "icon": "leaping_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Jump Kick",
      "fullName": "Pool.Leaping.Jump_Kick",
      "rank": 1,
      "available": 0,
      "description": "A good jumping kick attack that may knock foes down. Good if you are looking for another attack power.",
      "shortHelp": "Melee, DMG(Smash), Foe Knockdown",
      "icon": "jump_jumpkick.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 2.8,
        "endurance": 5.46,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 1.562,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "knockup": 1.0
        }
      }
    },
    {
      "name": "Combat Jumping",
      "fullName": "Pool.Leaping.Combat_Jumping",
      "rank": 2,
      "available": 0,
      "description": "While active, Combat Jumping increases your Defense to all attacks, and adds resistance to Immobilization. Moderately increases your jump height and distance while providing good air control.<br><br>Combat Jumping can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.",
      "shortHelp": "Toggle: Self +Jump, +DEF(All), Res(Immobilization)",
      "icon": "jump_combatjump.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Jump"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Leaping",
        "Leaping & Sprints",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.0325,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 2.0,
          "table": "Melee_Ones"
        },
        "jumpSpeed": {
          "scale": 0.01,
          "table": "Melee_Ones"
        },
        "protection": {
          "immobilize": 1.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Super Jump",
      "fullName": "Pool.Leaping.Long_Jump",
      "rank": 3,
      "available": 4,
      "description": "While this power is active, you can leap great distances and heights, easily jumping over buildings and from rooftop to rooftop! If you attack a target while this power is on, you will temporarily be reduced to a normal jump height. Super Jump also increases your maximum jumping speed by 35% and gives you access to the Double Jump power whilst it is active.<br><br>Super Jump can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.",
      "shortHelp": "Toggle: Self Long Jump",
      "icon": "jump_longjump.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Jump"
      ],
      "allowedSetCategories": [
        "Leaping",
        "Leaping & Sprints",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 1.0,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 1.65,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Double Jump",
      "fullName": "Pool.Leaping.Double_Jump",
      "rank": 4,
      "available": -1,
      "description": "Double Jump allows you to jump and gain altitude in mid air! This ability will automatically shut down after 30 seconds of continuous use.<br><br>In PvP, this power will detoggle after 10 seconds of continuous use, and disabled for 40 seconds.",
      "shortHelp": "Toggle: Self +Special",
      "icon": "jump_highjump.png",
      "powerType": "Toggle",
      "requires": "Pool.Leaping.Long_Jump",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 30.0,
        "endurance": 0.1179,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Acrobatics",
      "fullName": "Pool.Leaping.Leap",
      "rank": 5,
      "available": 13,
      "description": "While this power is active, you are very nimble and Acrobatic. You can avoid most Knockback effects and are resistant to Hold effects.<br><br>You must be at least level 14 and have two other Leaping Powers before selecting Acrobatics.<br><br><color #fcfc95>Notes: Knock enhancements on this power enhance it's magnitude protection</color>",
      "shortHelp": "Toggle: Self +Res(Knockback, Hold)",
      "icon": "jump_acrobatics.png",
      "powerType": "Toggle",
      "requires": "Pool.Leaping.Combat_Jumping && Pool.Leaping.Jump_Kick || Pool.Leaping.Combat_Jumping && Pool.Leaping.Long_Jump || Pool.Leaping.Jump_Kick && Pool.Leaping.Long_Jump",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "endurance": 0.26,
        "activationTime": 0.67,
        "effectArea": "SingleTarget",
        "protection": {
          "knockup": 1.0,
          "knockback": 1.0,
          "hold": 1.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Spring Attack",
      "fullName": "Pool.Leaping.Spring_Attack",
      "rank": 6,
      "available": 13,
      "description": "You leap into the air and smash down among ranks of foes in the blink of an eye. Using this power allows you to jump to a selected area to deal significant smashing damage to all foes near the location you teleport to, most foes that are struck by your Spring Attack will be knocked down.<br><br>You must be at least level 14 and have two other Leaping Powers before selecting Spring Attack.",
      "shortHelp": "PBAoE DMG(Smash), Foe Knockdown; Self Teleport",
      "icon": "jump_springattack.png",
      "powerType": "Click",
      "requires": "Pool.Leaping.Combat_Jumping && Pool.Leaping.Jump_Kick || Pool.Leaping.Combat_Jumping && Pool.Leaping.Long_Jump || Pool.Leaping.Jump_Kick && Pool.Leaping.Long_Jump",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 120.0,
        "endurance": 13.52,
        "activationTime": 1.5,
        "effectArea": "Location"
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['leaping'] = POOL_LEAPING;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
