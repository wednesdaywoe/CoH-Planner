/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Utility Belt
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\utility_belt
 */

const POOL_UTILITY_BELT = {
  "id": "utility_belt",
  "name": "Utility Belt",
  "displayName": "Utility Belt",
  "description": "This power pool option offers some tools that you can use to weaken your foes or quickly close the gap between you and your targets. The Utility Belt power pool features Free Running as its travel power. This power grants you the ability to quickly run and leap great heights. You can boost your leaping to even greater heights for short periods of time as well.",
  "icon": "utility_belt_set.png",
  "requires": "0",
  "powers": [
    {
      "name": "Bolas",
      "fullName": "Pool.Utility_Belt.Bolas",
      "rank": 1,
      "available": 0,
      "description": "You hurl a pair of bolas at your target entangling them and rendering them immobilized. For the duration of the effect the target may become knocked down.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Ranged, Foe Immobilize, Knockdown",
      "icon": "utilitybelt_bolas.png",
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
        "Immobilize"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 7.28,
        "activationTime": 1.87,
        "effectArea": "SingleTarget",
        "protection": {
          "immobilize": 3.0,
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Poisoned Dagger",
      "fullName": "Pool.Utility_Belt.Poisoned_Dagger",
      "rank": 2,
      "available": 0,
      "description": "You throw an envenomed blade at your target causing a moderate amount of lethal damage and causing them to suffer a fair amount of toxic damage over time. Foes struck by the Poisoned Dagger will also have their damage decreased.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Ranged, Moderate DMG(Lethal), Foe Light DoT(Toxic), -DMG",
      "icon": "utilitybelt_poisoneddagger.png",
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
        "recharge": 8.0,
        "endurance": 8.528,
        "activationTime": 1.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Lethal",
          "scale": 1.4199,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Freerunning",
      "fullName": "Pool.Utility_Belt.Freerunning",
      "rank": 3,
      "available": 3,
      "description": "You are skilled at using your environment to your advantage to quickly traverse any obstacles that you come across. Freerunning grants you a considerable boost to both your jump height and run speed. While this power is active, you will also have access to the Athletics power which when clicked will boost this power's effects for a short time.<br><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Toggle: Self, +Jump, +Run Speed, +Special",
      "icon": "utilitybelt_freerunning.png",
      "powerType": "Toggle",
      "requires": "char>accesslevel >= 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Jump"
      ],
      "allowedSetCategories": [
        "Leaping",
        "Leaping & Sprints",
        "Running",
        "Running & Sprints",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 4.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 0.25,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 0.55,
          "table": "Melee_SpeedJumping"
        },
        "runSpeed": {
          "scale": 0.4,
          "table": "Melee_SpeedRunning"
        }
      }
    },
    {
      "name": "Athletics",
      "fullName": "Pool.Utility_Belt.Athletics",
      "rank": 4,
      "available": -1,
      "description": "Activating this power will give you a massive burst of speed and jump power for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Click, Self +Run Speed, +Jump",
      "icon": "utilitybelt_athletics.png",
      "powerType": "Click",
      "requires": "Pool.Utility_Belt.Freerunning && (char>accesslevel >= 0)",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 6.5,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 0.3,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 0.66,
          "table": "Melee_SpeedJumping"
        },
        "runSpeed": {
          "scale": 0.5,
          "table": "Melee_SpeedRunning"
        }
      }
    },
    {
      "name": "Envenomed Barrage",
      "fullName": "Pool.Utility_Belt.Flying_Kick",
      "rank": 5,
      "available": 13,
      "description": "You unleash a barrage of throwing knives at foes in front of you dealing Moderate lethal damage and an additional amount of toxic damage over time. Affected foes will also have their damage reduced slightly.<br><br>You must be at least level 14 and have two other Utility Belt powers before selecting Envenomed Barrage.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged(Cone), Moderate DMG(Lethal), Foe Light DoT(Toxic), -DMG",
      "icon": null,
      "powerType": "Click",
      "requires": "(char>accesslevel >= 0) && (Pool.Utility_Belt.Bolas && Pool.Utility_Belt.Freerunning || Pool.Utility_Belt.Bolas && Pool.Utility_Belt.Poisoned_Dagger || Pool.Utility_Belt.Freerunning && Pool.Utility_Belt.Poisoned_Dagger)",
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
        "range": 60.0,
        "recharge": 14.0,
        "endurance": 13.52,
        "activationTime": 1.0,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.6981,
        "damage": {
          "type": "Lethal",
          "scale": 0.6434,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Life Support System",
      "fullName": "Pool.Utility_Belt.Life_Support_System",
      "rank": 6,
      "available": 19,
      "description": "Life Support System immediately heals you and causes you to recover a moderate amount of health over time. This power's potency increases as your health decreases.<br><br>You must be at least level 20 and have two other Utility Belt powers before selecting Life Support System.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Self, +HP, +Heal Over Time, +Special",
      "icon": "utilitybelt_lifesupportsystem.png",
      "powerType": "Click",
      "requires": "(char>accesslevel >= 0) && (Pool.Utility_Belt.Bolas && Pool.Utility_Belt.Freerunning || Pool.Utility_Belt.Bolas && Pool.Utility_Belt.Poisoned_Dagger || Pool.Utility_Belt.Freerunning && Pool.Utility_Belt.Poisoned_Dagger)",
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
        "recharge": 240.0,
        "endurance": 7.8,
        "activationTime": 1.27,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Heal",
          "scale": 1.0,
          "table": "Melee_HealSelf"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['utility_belt'] = POOL_UTILITY_BELT;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
