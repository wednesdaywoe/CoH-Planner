/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Teleportation
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\teleportation
 */

const POOL_TELEPORTATION = {
  "id": "teleportation",
  "name": "Teleportation",
  "displayName": "Teleportation",
  "description": "Grants you various teleportation abilities.",
  "icon": "teleportation_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Teleport Target",
      "fullName": "Pool.Teleportation.Recall_Friend",
      "rank": 1,
      "available": 0,
      "description": "You can Teleport a single foe or ally directly next to yourself. A successful hit must be made in order to Teleport the foes. Some powerful foes cannot be Teleported. Enemy players that are teleported will be temporarily out of phase, and cannot be targeted or damaged. This power can be interrupted while teleporting foes.<br><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Teleport Teammate or Foe",
      "icon": "teleportation_teleportfoe.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Teleport",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 10000.0,
        "recharge": 6.0,
        "endurance": 15.0,
        "activationTime": 5.93,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Combat Teleport",
      "fullName": "Pool.Teleportation.Teleport_Foe",
      "rank": 2,
      "available": 0,
      "description": "You can Teleport moderate distances extremely quickly. These quick teleports surprise foes, giving your next attack a small ToHit advantage. This power can be used up to 3 times in a row before it starts recharging.<br><br><color #fcfc95>Notes: Combat Teleport is unaffected by Range changes.</color><br><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Ranged (Location), Self Teleport, +ToHit",
      "icon": "combat_teleport.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Teleport",
        "To Hit Buff",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 100.0,
        "recharge": 6.0,
        "endurance": 5.5714,
        "activationTime": 0.67,
        "effectArea": "Location"
      }
    },
    {
      "name": "Teleport",
      "fullName": "Pool.Teleportation.Teleport",
      "rank": 3,
      "available": 4,
      "description": "You can Teleport long distances. Once at your destination, you will be stuck in between dimensions for up to 15s. While in this state, you will not be affected by gravity, and be able to execute additional teleportation jumps at a discounted endurance cost.<br><br>Moving or taking any non-teleport action, though, will snap you back into reality, and you will once more be affected by gravity. <br><br>Teleport has no recharge time, and can be reactivated without pause, as long as you have Endurance.",
      "shortHelp": "Ranged (Location), Self Teleport",
      "icon": "teleportation_teleport.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range"
      ],
      "allowedSetCategories": [
        "Teleport",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 350.0,
        "endurance": 13.0,
        "activationTime": 1.5,
        "effectArea": "Location"
      }
    },
    {
      "name": "Team Teleport",
      "fullName": "Pool.Teleportation.Team_Teleport",
      "rank": 4,
      "available": 13,
      "description": "You can Teleport yourself and your nearby teammates to a targeted location. Teammates must be in close proximity to you. Team Teleport costs slightly more Endurance than Teleport, but you can Teleport your entire team for no additional cost.<br><br>You must be at least level 14 and have two other Teleportation Powers before selecting Team Teleport.<br><br><color #fcfc95>Recharge: Very Fast.</color>",
      "shortHelp": "Ranged (Location), Team Teleport",
      "icon": "teleportation_groupteleport.png",
      "powerType": "Click",
      "requires": "Pool.Teleportation.Recall_Friend && Pool.Teleportation.Teleport || Pool.Teleportation.Recall_Friend && Pool.Teleportation.Teleport_Foe || Pool.Teleportation.Teleport && Pool.Teleportation.Teleport_Foe",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Teleport",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 25.0,
        "recharge": 1.5,
        "endurance": 16.0,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 30.0,
        "flySpeed": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Fold Space",
      "fullName": "Pool.Teleportation.Long_Range_Teleport",
      "rank": 5,
      "available": 13,
      "description": "Fold Space teleports enemies from up to 100ft away into melee range of the caster.<br><br>You must be at least level 14 and have two other Teleportation Powers before selecting Fold Space.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Melee (PBAoE), Foe Teleport",
      "icon": "pool_fold_space.png",
      "powerType": "Click",
      "requires": "Pool.Teleportation.Recall_Friend && Pool.Teleportation.Teleport || Pool.Teleportation.Recall_Friend && Pool.Teleportation.Teleport_Foe || Pool.Teleportation.Teleport && Pool.Teleportation.Teleport_Foe",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 13.52,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 100.0,
        "resistance": {}
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['teleportation'] = POOL_TELEPORTATION;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
