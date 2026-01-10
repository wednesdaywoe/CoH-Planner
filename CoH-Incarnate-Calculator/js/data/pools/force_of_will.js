/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Force of Will
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\force_of_will
 */

const POOL_FORCE_OF_WILL = {
  "id": "force_of_will",
  "name": "Force of Will",
  "displayName": "Force of Will",
  "description": "Force of Will grants you access to various powers that allow you to manifest your own willpower and use it to harm your foes. This power pool gives you access to Mighty Leap as your travel power, which allows you to leap great distances. Additionally, while Mighty Leap is active you gain access to Takeoff. Use the Takeoff power to knockdown nearby foes and boost your jumping speed for a short time.",
  "icon": "force_of_will_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Weaken Resolve",
      "fullName": "Pool.Force_of_Will.Weaken_Resolve",
      "rank": 1,
      "available": 0,
      "description": "You overwhelm your foe with sheer strength of will, reducing their defense, damage resistance, and chance to hit!<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged, Foe -Resist, -Defense, -To Hit",
      "icon": "forceofwill_weakenresolve.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Accurate To-Hit Debuff",
        "Defense Debuff",
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 30.0,
        "endurance": 7.8,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "lethal": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "fire": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "cold": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "energy": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "negative": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "psionic": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          },
          "toxic": {
            "scale": -1.0,
            "table": "Ranged_Res_Dmg"
          }
        },
        "defense": {
          "all": {
            "scale": 1.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Project Will",
      "fullName": "Pool.Force_of_Will.Project_Will",
      "rank": 2,
      "available": 0,
      "description": "You manifest your willpower into a blast and project it toward a distant foe, causing moderate psionic and smashing damage. Project Will has a fair chance to knock the target down.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Ranged, Light DMG(Psionic), Foe Knockdown",
      "icon": "forceofwill_projectwill.png",
      "powerType": "Click",
      "requires": "",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 5.0,
        "endurance": 7.54,
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Psionic",
          "scale": 2.049,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Mighty Leap",
      "fullName": "Pool.Force_of_Will.Mighty_Leap",
      "rank": 3,
      "available": 3,
      "description": "While this power is active you're able to leap great distances and jump incredibly high. In addition, while this power is active you're able to use Takeoff, which will knockdown nearby foes and increases jump speed. Mighty Leap also increases your maximum jumping speed by 35% whilst it is active.<br><br>Mighty Leap can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.",
      "shortHelp": "Toggle: Self Long Jump, (Special)",
      "icon": "forceofwill_mightyleap.png",
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
      "name": "Takeoff",
      "fullName": "Pool.Force_of_Will.Stomp",
      "rank": 4,
      "available": -1,
      "description": "You stomp your foot on the ground with tremendous force empowering your jump speed and height for a short time and shattering the earth beneath, knocking nearby foes off of their feet.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "PBAoE Melee, Self +Jump, Foe Knockdown",
      "icon": "forceofwill_stomp.png",
      "powerType": "Click",
      "requires": "Pool.Force_of_Will.Mighty_Leap",
      "maxSlots": 0,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 6.5,
        "activationTime": 2.1,
        "effectArea": "AoE",
        "radius": 10.0,
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Wall of Force",
      "fullName": "Pool.Force_of_Will.Wall_of_Force",
      "rank": 5,
      "available": 13,
      "description": "You project an unfocused blast of sheer force at foes in a short wide cone in front of you, dealing moderate psionic and smashing damage and potentially knocking targets down.<br><br>You must be at least level 14 and have two other Force of Will powers before selecting Wall of Force.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Ranged Cone, Minor DMG(Psionic/Smashing), Foe Knockdown",
      "icon": "forceofwill_wallofforce.png",
      "powerType": "Click",
      "requires": "Pool.Force_of_Will.Mighty_Leap + Pool.Force_of_Will.Project_Will + Pool.Force_of_Will.Unleash_Potential + Pool.Force_of_Will.Wall_of_Force + Pool.Force_of_Will.Weaken_Resolve > 1",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 10.0,
        "endurance": 13.0,
        "activationTime": 2.5,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 1.5708,
        "damage": {
          "type": "Psionic",
          "scale": 0.4194,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Unleash Potential",
      "fullName": "Pool.Force_of_Will.Unleash_Potential",
      "rank": 6,
      "available": 19,
      "description": "Unleashing your potential, you grant yourself a moderate boost to defense, regeneration rate, and recovery for a short time.<br><br>You must be at least level 20 and have two other Force of Will powers before selecting Unleash Potential.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Self, +Regen, +Recovery, +Defense",
      "icon": "forceofwill_unleashpotential.png",
      "powerType": "Click",
      "requires": "Pool.Force_of_Will.Mighty_Leap + Pool.Force_of_Will.Project_Will + Pool.Force_of_Will.Unleash_Potential + Pool.Force_of_Will.Wall_of_Force + Pool.Force_of_Will.Weaken_Resolve > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 600.0,
        "endurance": 2.6,
        "activationTime": 0.73,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 1.5,
          "table": "Melee_Ones"
        },
        "recovery": {
          "scale": 0.75,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['force_of_will'] = POOL_FORCE_OF_WILL;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
