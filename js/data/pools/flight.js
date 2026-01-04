/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Flight
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\flight
 */

const POOL_FLIGHT = {
  "id": "flight",
  "name": "Flight",
  "displayName": "Flight",
  "description": "Grants you various travel and flying combat abilities.",
  "icon": "flight_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Hover",
      "fullName": "Pool.Flight.Combat_Flight",
      "rank": 1,
      "available": 0,
      "description": "For hovering and aerial combat. This power is much slower than Fly, but provides some Defense to all attacks, offers good air control, costs little Endurance, and has none of the penalties associated with Fly. Switch to this mode when fighting other flying foes.<br><br>Hover can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
      "shortHelp": "Toggle: Self Fly, +DEF(All)",
      "icon": "flight_combatflight.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Flight",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.0975,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 0.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Air Superiority",
      "fullName": "Pool.Flight.Air_Superiority",
      "rank": 2,
      "available": 0,
      "description": "This two-handed overhead melee attack can knock a flying target to the ground.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Melee, Light DMG(Smash), Foe -Fly",
      "icon": "flight_arialassault.png",
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
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 4.0,
        "endurance": 6.5,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 1.61,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "knockup": 1.0
        }
      }
    },
    {
      "name": "Fly",
      "fullName": "Pool.Flight.Fly",
      "rank": 3,
      "available": 4,
      "description": "Fly allows you to travel large distances quickly. Fly also increases your maximum flying speed by 50% and gives you access to the Afterburner power whilst it is active.<br><br>If you attack a target while this power is on, your flight speed will be temporarily reduced to Hover speed.<br><br>Fly can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
      "shortHelp": "Toggle: Self Fly",
      "icon": "flight_travelflight.png",
      "powerType": "Toggle",
      "requires": "",
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
          "scale": 2.0475,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Afterburner",
      "fullName": "Pool.Flight.Fly_Boost",
      "rank": 4,
      "available": -1,
      "description": "Afterburner greatly increases your fly speed and maximum fly speed for a short period of time.<br><br><color #fcfc95>Notes: Afterburner is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Self +FlySpeed (Special)",
      "icon": "flight_afterburner.png",
      "powerType": "Toggle",
      "requires": "Pool.Flight.Fly",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 60.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 0.35,
          "table": "Ranged_SpeedFlying"
        }
      }
    },
    {
      "name": "Group Fly",
      "fullName": "Pool.Flight.Group_Fly",
      "rank": 5,
      "available": 13,
      "description": "You can endow your nearby teammates with Flight. Be mindful! Your friends will fall if you run out of Endurance or if they travel too far away from you. Group Fly travel speed is slower than Fly.<br><br>You must be at least level 14 and have two other Flight Powers before selecting Group Fly.",
      "shortHelp": "Toggle: Team Fly",
      "icon": "flight_groupfly.png",
      "powerType": "Toggle",
      "requires": "Pool.Flight.Air_Superiority && Pool.Flight.Combat_Flight || Pool.Flight.Air_Superiority && Pool.Flight.Fly || Pool.Flight.Combat_Flight && Pool.Flight.Fly",
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
        "endurance": 1.3,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 60.0,
        "flySpeed": {
          "scale": 0.5,
          "table": "Melee_SpeedFlying"
        }
      }
    },
    {
      "name": "Evasive Maneuvers",
      "fullName": "Pool.Flight.Afterburner",
      "rank": 6,
      "available": 13,
      "description": "While Fly, Hover or Group Fly are active, Evasive Maneuvers increases fly speed and movement control. It will also grant resistance against knockback and protection against -Fly and Immobilization.<br><br>Evasive Maneuvers' flight speed buff stacks with other flight powers, and isn't suppressed by combat.<br><br><color #fcfc95>Notes: Evasive Maneuvers provides a moderate amount of Defense even while on the ground, but this defense is lost if you attack, buff allies, give an order to pets or interact with a mission objective.<br><br>You must be at least level 14 and have two other Flight Powers before selecting Evasive Maneuvers.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Toggle: Self +FlySpeed, Res(-Fly, Immobilize, Knockback), +Def(Special), +Flight Control",
      "icon": "flight_evasivemaneuvers.png",
      "powerType": "Toggle",
      "requires": "Pool.Flight.Air_Superiority && Pool.Flight.Combat_Flight || Pool.Flight.Air_Superiority && Pool.Flight.Fly || Pool.Flight.Combat_Flight && Pool.Flight.Fly",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Flight",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "endurance": 0.052,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 0.4,
          "table": "Melee_SpeedFlying"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['flight'] = POOL_FLIGHT;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
