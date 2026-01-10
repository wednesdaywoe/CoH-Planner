/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Concealment
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\invisibility
 */

const POOL_INVISIBILITY = {
  "id": "invisibility",
  "name": "Concealment",
  "displayName": "Concealment",
  "description": "These powers grant you Invisibility and Stealth.",
  "icon": "invisibility_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Stealth",
      "fullName": "Pool.Invisibility.Stealth",
      "rank": 1,
      "available": 0,
      "description": "You can bend light around yourself to become Invisible. While this power is active, you are almost impossible to detect. If, however, you attack while using this power, you will be discovered and will lose your Stealth and some of your Defense bonus.<br><br>Sending commands to pets, buffing or healing allies will also lower the defense and stealth granted by this power.",
      "shortHelp": "Toggle: Self Stealth, +DEF(All)",
      "icon": "invisibility_stealth.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Defense Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.1625,
        "activationTime": 0.73,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Grant Invisibility",
      "fullName": "Pool.Invisibility.Grant_Invisibility",
      "rank": 2,
      "available": 0,
      "description": "Grants a targeted teammate or leaguemate Invisibility. The Invisibility lasts about 2 minutes. While your ally is Invisible, he probably will not be detected unless he attacks a target. If he attacks, he is still hard to see and maintains some bonus to Defense to all attacks.<br><br>This power works with other Concealment related powers.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
      "shortHelp": "Ranged, Teammate Stealth, +DEF(All)",
      "icon": "invisibility_groupinvisibility.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Defense Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 3.0,
        "endurance": 15.6,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Infiltration",
      "fullName": "Pool.Invisibility.Invisibility",
      "rank": 3,
      "available": 4,
      "description": "You blend into your environment and swiftly make your way while attempting to stay undetected. Infiltration grants you a considerable boost to both your jump height and run speed. Even if discovered, you are hard to see and have a bonus to Defense from all attacks. If, however, you attack while using this power, you will be discovered and will lose your Stealth and Defense bonus provided by this power.<br><br>Infiltration can be active at the same time as other running and jumping toggles, but only the strongest run speed buff and strongest jumping buff will apply.",
      "shortHelp": "Toggle: Self, +Jump, +Run Speed, Self Stealth, +DEF(All)",
      "icon": "invisibility_infiltration.png",
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
        "Running",
        "Running & Sprints",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "jumpHeight": {
          "scale": 0.275,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 0.605,
          "table": "Melee_SpeedJumping"
        },
        "runSpeed": {
          "scale": 0.44,
          "table": "Melee_SpeedRunning"
        }
      }
    },
    {
      "name": "Phase Shift",
      "fullName": "Pool.Invisibility.Phase_Shift",
      "rank": 4,
      "available": 13,
      "description": "You can Phase Shift to become out of sync with normal space. Although you do not become completely Invisible, you are translucent and hard to see. You are intangible, and cannot affect or be affected by those in normal space. Although this power is a toggle, you cannot remain Phase Shifted for more than 30 seconds, even if you still have Endurance.<br><br>You must be at least level 14 and have two other Concealment Powers before selecting Phase Shift.<br><br><color #fcfc95>Notes: This power cannot be used with Rest.</color><br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Toggle: Self Intangible",
      "icon": "invisibility_phaseshift.png",
      "powerType": "Toggle",
      "requires": "Pool.Invisibility.Grant_Invisibility && Pool.Invisibility.Invisibility || Pool.Invisibility.Grant_Invisibility && Pool.Invisibility.Stealth || Pool.Invisibility.Invisibility && Pool.Invisibility.Stealth",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 180.0,
        "endurance": 0.325,
        "activationTime": 0.5,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Misdirection",
      "fullName": "Pool.Invisibility.Misdirection",
      "rank": 5,
      "available": 13,
      "description": "You redirect the anger of enemies around you, placating them. This causes them to break off their attacks. The momentary lack of awareness this causes also leads to reduced resistance to damage for a short time.<br><br>You must be at least level 14 and have trained any two other Concealment powers before you can train this power.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "PBAoE, Foe Placate, -Res(All)",
      "icon": "invisibility_placate.png",
      "powerType": "Click",
      "requires": "Pool.Invisibility.Grant_Invisibility && Pool.Invisibility.Invisibility || Pool.Invisibility.Grant_Invisibility && Pool.Invisibility.Phase_Shift || Pool.Invisibility.Grant_Invisibility && Pool.Invisibility.Stealth || Pool.Invisibility.Invisibility && Pool.Invisibility.Phase_Shift || Pool.Invisibility.Invisibility && Pool.Invisibility.Stealth || Pool.Invisibility.Phase_Shift && Pool.Invisibility.Stealth",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Threat Duration"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 240.0,
        "endurance": 9.75,
        "activationTime": 1.5,
        "effectArea": "AoE",
        "radius": 20.0,
        "resistance": {
          "smashing": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": -1.5,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['invisibility'] = POOL_INVISIBILITY;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
