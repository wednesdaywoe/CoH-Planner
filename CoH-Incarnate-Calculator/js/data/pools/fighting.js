/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Fighting
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\fighting
 */

const POOL_FIGHTING = {
  "id": "fighting",
  "name": "Fighting",
  "displayName": "Fighting",
  "description": "These powers are excellent for those who are looking for a few low cost powers to defend themselves. The combat powers Boxing, Kick and Cross Punch synergize with each other, such that ownership of each power will provide bonuses to the other two. Additionally, Fighting synergizes with the Brawl power, which will gain benefits for each of the combat powers owned from this set.",
  "icon": "fighting_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Boxing",
      "fullName": "Pool.Fighting.Boxing",
      "rank": 1,
      "available": 0,
      "description": "You strike your opponent with a strong punch that causes light smashing damage and has a small chance to stun foes.<br><br>If you have also trained Kick, this power's damage is increased by 15% and your chance to stun increases.<br><br>If you have also trained Cross Punch, this power's damage is increased by 15% and will fatigue the target, draining some endurance and lowering recovery slightly.<br><br>The synergy with Kick and Cross Punch stacks.<br><br><color #fcfc95>Damage: Minor.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
      "shortHelp": "Melee, DMG(Smash), Fighting Synergy, Foe Stun",
      "icon": "fighting_boxing.png",
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
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 2.5,
        "endurance": 4.42,
        "activationTime": 1.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 1.249,
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -0.05,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Kick",
      "fullName": "Pool.Fighting.Kick",
      "rank": 2,
      "available": 0,
      "description": "You strike your opponent with a forceful kick that causes moderate smashing damage and has a small chance to knock opponents down.<br><br>If you have also trained Boxing, this power's damage is increased by 15% and your chance to knockdown increases.<br><br>If you have also trained Cross Punch, this power's damage is increased by 15% and will fatigue the target, draining some endurance and lowering recovery slightly.<br><br>The synergy with Boxing and Cross Punch stacks.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
      "shortHelp": "Melee, DMG(Smash), Synergy, Foe Knockdown",
      "icon": "fighting_kick.png",
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
        "recharge": 3.0,
        "endurance": 4.94,
        "activationTime": 1.83,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 1.801,
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -0.05,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Tough",
      "fullName": "Pool.Fighting.Tough",
      "rank": 3,
      "available": 13,
      "description": "While active, you are tough and slightly resistant to Smashing and Lethal damage.<br><br>You must be at least level 14 and have one other Fighting Powers before selecting Tough.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Toggle: Self +Res(Smash/Lethal)",
      "icon": "fighting_tough.png",
      "powerType": "Toggle",
      "requires": "Pool.Fighting.Boxing || Pool.Fighting.Kick",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "endurance": 0.1625,
        "activationTime": 3.1,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Weave",
      "fullName": "Pool.Fighting.Weave",
      "rank": 4,
      "available": 13,
      "description": "While active, you bob and weave, increasing your Defense to all attacks, as well as your resistance to Immobilize.<br><br>You must be at least level 14 and have two other Fighting Powers before selecting Weave.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Toggle: Self +DEF(All), Res(Immobilize)",
      "icon": "fighting_weave.png",
      "powerType": "Toggle",
      "requires": "Pool.Fighting.Boxing && Pool.Fighting.Kick || Pool.Fighting.Boxing && Pool.Fighting.Tough || Pool.Fighting.Kick && Pool.Fighting.Tough",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Defense Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "endurance": 0.1625,
        "activationTime": 0.67,
        "effectArea": "SingleTarget",
        "resistance": {}
      }
    },
    {
      "name": "Cross Punch",
      "fullName": "Pool.Fighting.Cross_Punch",
      "rank": 5,
      "available": 13,
      "description": "You execute a sweeping right hook that can strike multiple targets in your frontal arc. This attack causes moderate smashing damage and has a chance to both knock down and stun foes.<br><br>If you have also trained Boxing, this power's damage is increased by 15% and will improve your recharge and accuracy briefly.<br><br>If you have also trained Kick, this power's damage is increased by 15% and will improve your recharge and accuracy briefly.<br><br>The synergy with Boxing and Kick stacks.<br><br>You must be at least level 14 and have two other Fighting Powers before selecting Cross Punch.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Melee (Cone), DMG(Smash), Fighting Synergy, Foe Knockdown, Stun",
      "icon": "fighting_crosspunch.png",
      "powerType": "Click",
      "requires": "Pool.Fighting.Boxing && Pool.Fighting.Kick || Pool.Fighting.Boxing && Pool.Fighting.Tough || Pool.Fighting.Boxing && Pool.Fighting.Weave || Pool.Fighting.Kick && Pool.Fighting.Tough || Pool.Fighting.Kick && Pool.Fighting.Weave || Pool.Fighting.Tough && Pool.Fighting.Weave",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Melee AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 8.0,
        "endurance": 10.66,
        "activationTime": 1.67,
        "effectArea": "Cone",
        "radius": 7.0,
        "arc": 0.8727,
        "damage": {
          "type": "Smashing",
          "scale": 1.4628,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "knockback": 1.0,
          "stun": 2.0
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['fighting'] = POOL_FIGHTING;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
