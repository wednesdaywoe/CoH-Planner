/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Leadership
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\leadership
 */

const POOL_LEADERSHIP = {
  "id": "leadership",
  "name": "Leadership",
  "displayName": "Leadership",
  "description": "Good leaders are rare. These powers can grant bonuses to your and your teammates.",
  "icon": "leadership_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Maneuvers",
      "fullName": "Pool.Leadership.Defense",
      "rank": 1,
      "available": 0,
      "description": "A good leader knows how to protect his team. While active, this power increases the Defense of yourself and all nearby teammates to all attacks.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Toggle: PBAoE, Team +DEF(All)",
      "icon": "leadership_defense.png",
      "powerType": "Toggle",
      "requires": "",
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
        "recharge": 15.0,
        "endurance": 0.78,
        "activationTime": 1.5,
        "effectArea": "AoE",
        "radius": 60.0
      }
    },
    {
      "name": "Assault",
      "fullName": "Pool.Leadership.Assault",
      "rank": 2,
      "available": 0,
      "description": "While this power is active, you and your nearby teammates deal more damage and are resistant to Taunt and Placate.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Toggle: PBAoE, Team +DMG, Res(Taunt, Placate)",
      "icon": "leadership_assault.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 15.0,
        "endurance": 0.78,
        "activationTime": 1.5,
        "effectArea": "AoE",
        "radius": 60.0,
        "resistance": {}
      }
    },
    {
      "name": "Tactics",
      "fullName": "Pool.Leadership.Tactics",
      "rank": 3,
      "available": 13,
      "description": "While this power is active, your chance to hit and that of all your nearby teammates is increased. Your advanced Tactics also protect you and your team from Confuse and Fear effects, as well as your Perception so you can detect Stealthy foes.<br><br>You must be at least level 14 and have one other Leadership powers before selecting Tactics.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Toggle: PBAoE, Team +To Hit, Res(Confuse, Fear), +Perception",
      "icon": "leadership_tactics.png",
      "powerType": "Toggle",
      "requires": "Pool.Leadership.Assault || Pool.Leadership.Defense",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Buff"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 15.0,
        "endurance": 0.78,
        "activationTime": 1.5,
        "effectArea": "AoE",
        "radius": 60.0,
        "resistance": {},
        "protection": {
          "confuse": 1.0
        }
      }
    },
    {
      "name": "Vengeance",
      "fullName": "Pool.Leadership.Vengeance",
      "rank": 4,
      "available": 13,
      "description": "The loss of a comrade enrages the team. When a teammate is defeated in combat, activate this power to grant you and your teammates a bonus to chance to hit, Damage and Defense to all attacks. A Vengeful team has no fear, and Vengeance protects you and your Teammates from Fear effects. It also gives you and your team great resistance to Sleep, Hold, Disorient, Immobilize, Confuse, Taunt, Placate and Knockback.<br><br>This power does not stack with multiple castings.<br><br>You must be at least level 14 and have two other Leadership powers before selecting Victory Rush.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Ranged (Targeted AoE), Teammates +DMG, +To Hit, +DEF(All), Res(Effects)",
      "icon": "leadership_vengence.png",
      "powerType": "Click",
      "requires": "Pool.Leadership.Assault && Pool.Leadership.Defense || Pool.Leadership.Assault && Pool.Leadership.Tactics || Pool.Leadership.Defense && Pool.Leadership.Tactics",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Range",
        "Heal"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Healing",
        "To Hit Buff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 300.0,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 100.0,
        "protection": {
          "fear": 1.0,
          "knockup": 1.0,
          "knockback": 1.0,
          "repel": 1.0
        },
        "resistance": {},
        "damage": {
          "type": "Heal",
          "scale": 1.0,
          "table": "Melee_Heal"
        }
      }
    },
    {
      "name": "Victory Rush",
      "fullName": "Pool.Leadership.Victory_Rush",
      "rank": 5,
      "available": 13,
      "description": "The defeat of an opponent gives your team a rush of adrenaline. The excitement of your victory increases the recovery and reduces the endurance cost of your powers. This effect extends to your teammates as well. The total strength of this bonus is dependent upon the rank of the enemy on which this is cast, with Archvillains and Giant Monsters providing the greatest benefit. This power does not stack with multiple castings.<br><br>You must be at least level 14 and have two other Leadership powers before selecting Victory Rush.<br><br><color #fcfc95>Notes: Victory Rush is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Ranged (Targeted AoE), Team +Recovery, -End Cost",
      "icon": "leadership_victoryrush.png",
      "powerType": "Click",
      "requires": "Pool.Leadership.Assault && Pool.Leadership.Defense || Pool.Leadership.Assault && Pool.Leadership.Tactics || Pool.Leadership.Assault && Pool.Leadership.Vengeance || Pool.Leadership.Defense && Pool.Leadership.Tactics || Pool.Leadership.Defense && Pool.Leadership.Vengeance || Pool.Leadership.Tactics && Pool.Leadership.Vengeance",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 300.0,
        "endurance": 9.75,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['leadership'] = POOL_LEADERSHIP;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
