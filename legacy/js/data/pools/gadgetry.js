/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Gadgetry
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\gadgetry
 */

const POOL_GADGETRY = {
  "id": "gadgetry",
  "name": "Gadgetry",
  "displayName": "Gadgetry",
  "description": "Gadgetry gives you access to highly advanced technology to weaken or blast your foes. This power pool gives you access to a jetpack as your travel power. While your jetpack is active you gain access to a Turbo Charge power which allows you to fly even faster for a short time.",
  "icon": "gadgetry_set.png",
  "requires": "0",
  "powers": [
    {
      "name": "Nano Net",
      "fullName": "Pool.Gadgetry.Nano_Net",
      "rank": 1,
      "available": 0,
      "description": "You trap your foe in an energy net that significantly reduces their movement speed, attack rate and regeneration rate for a short time. Affected foes will also be knocked out of the sky.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Ranged, Foe -Speed, -Recharge, -Fly, -Regen",
      "icon": "gadgetry_nanonet.png",
      "powerType": "Click",
      "requires": "char>accesslevel >= 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Slow Movement"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 7.8,
        "activationTime": 1.37,
        "effectArea": "SingleTarget",
        "runSpeed": {
          "scale": 0.6,
          "table": "Ranged_Slow"
        },
        "resistance": {},
        "protection": {
          "knockup": 1.0,
          "knockback": 1.0
        },
        "jumpHeight": {
          "scale": -500.0,
          "table": "Ranged_Ones"
        },
        "regeneration": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Blaster Drone",
      "fullName": "Pool.Gadgetry.Wrist_Blaster",
      "rank": 2,
      "available": 0,
      "description": "You fire a series of blasts from a sophisticated energy drone. Wrist Blaster deals Moderate energy damage and will reduce the target's regeneration rate for a short time.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Ranged, Light DMG(Energy), Foe -Regen",
      "icon": "gadgetry_wristblaster.png",
      "powerType": "Click",
      "requires": "char>accesslevel >= 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 5.0,
        "endurance": 7.54,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 1.7689,
          "table": "Ranged_PvPDamage"
        },
        "regeneration": {
          "scale": -0.66,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Jetpack",
      "fullName": "Pool.Gadgetry.Jetpack",
      "rank": 3,
      "available": 3,
      "description": "By activating this power will you will be able to fly at high speeds. While this power is active you will have the ability to engage a Turbo Boost for a short time to further speed up your flight.",
      "shortHelp": "Toggle: Self Fly, (Special)",
      "icon": "gadgetry_jetpack.png",
      "powerType": "Toggle",
      "requires": "(char>accesslevel >= 0) && Ne($archtype, @Class_Peacebringer) && Ne($archtype, @Class_Warshade)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Flight",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 1.1788,
          "table": "Melee_SpeedFlying"
        }
      }
    },
    {
      "name": "Turbo Boost",
      "fullName": "Pool.Gadgetry.Turbo_Boost",
      "rank": 4,
      "available": -1,
      "description": "Activating this power will give you a massive burst to your flight speed for a short time.<br><br><color #fcfc95>Notes: Turbo Boost is unaffected by Endurance Discount changes.</color>",
      "shortHelp": "Click, Self +Fly Speed",
      "icon": "gadgetry_turboboost.png",
      "powerType": "Toggle",
      "requires": "Pool.Gadgetry.Jetpack && (char>accesslevel >= 0)",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "endurance": 1.0,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 10.0,
          "table": "Ranged_SpeedFlying"
        }
      }
    },
    {
      "name": "Drone Barrage",
      "fullName": "Pool.Gadgetry.Blaster_Barrage",
      "rank": 5,
      "available": 13,
      "description": "You fire off a barrage of energy blasts from an advanced energy drone dealing Moderate energy damage to foes in long cone in front of you.<br><br>You must be at least level 14 and have two other Gadgetry powers before selecting Drone Barrage.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged Cone, Light DMG(Energy), Foe -Regen",
      "icon": "gadgetry_blasterbarrage.png",
      "powerType": "Click",
      "requires": "(char>accesslevel >= 0) && (Pool.Gadgetry.Jetpack && Pool.Gadgetry.Nano_Net || Pool.Gadgetry.Jetpack && Pool.Gadgetry.Wrist_Blaster || Pool.Gadgetry.Nano_Net && Pool.Gadgetry.Wrist_Blaster)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 15.0,
        "endurance": 17.94,
        "activationTime": 2.5,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.8727,
        "damage": {
          "type": "Energy",
          "scale": 0.9942,
          "table": "Ranged_PvPDamage"
        },
        "regeneration": {
          "scale": -0.66,
          "table": "Ranged_Ones"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Force Barrier",
      "fullName": "Pool.Gadgetry.Force_Barrier",
      "rank": 6,
      "available": 19,
      "description": "You activate a force field around you for a short time that will absorb a high amount of damage before dissipating.<br><br>You must be at least level 20 and have two other Gadgetry powers before selecting Force Barrier.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Self, +Absorb",
      "icon": "gadgetry_forcebarrier.png",
      "powerType": "Click",
      "requires": "(char>accesslevel >= 0) && (Pool.Gadgetry.Jetpack && Pool.Gadgetry.Nano_Net || Pool.Gadgetry.Jetpack && Pool.Gadgetry.Wrist_Blaster || Pool.Gadgetry.Nano_Net && Pool.Gadgetry.Wrist_Blaster)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 150.0,
        "endurance": 10.4,
        "activationTime": 2.03,
        "effectArea": "SingleTarget"
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['gadgetry'] = POOL_GADGETRY;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
