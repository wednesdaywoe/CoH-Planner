/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_ice_mastery
 */

const EPIC_SENTINEL_ICE_MASTERY = {
  "id": "sentinel_ice_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "sentinel",
  "description": "You have Mastery over Ice and snow to blast your foes and control your foes.",
  "icon": "sentinel_ice_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Frostbite",
      "fullName": "Epic.Sentinel_Ice_Mastery.Frostbite",
      "rank": 1,
      "available": 34,
      "description": "Immobilizes a group of foes in icy traps. Deals minimal Cold damage over time and slightly Slows the targets. Slower and less damaging than Chilblain, but can capture multiple targets. More resilient foes may only be Slowed.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Cold), Foe Immobilize, -SPD, -Recharge",
      "icon": "ice_mastery_frostbite.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 2.07,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Cold",
          "scale": 0.2553,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 5.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Ice Sword",
      "fullName": "Epic.Sentinel_Ice_Mastery.Ice_Sword",
      "rank": 2,
      "available": 34,
      "description": "You create a blade of solid ice that deals higher damage then Frozen Fists. Being hit by this Ice Sword will Slow a target's movement and attack speed, due to the intense chill.",
      "shortHelp": "Melee, DMG(Cold/Lethal), Foe -Recharge, -SPD",
      "icon": "ice_mastery_icesword.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 20.0,
        "endurance": 12.74,
        "activationTime": 1.33,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Cold",
          "scale": 2.131,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Block of Ice",
      "fullName": "Epic.Sentinel_Ice_Mastery.Block_of_Ice",
      "rank": 3,
      "available": 37,
      "description": "You can freeze a single foe in a Block of Ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be held, but all affected targets will be Slowed. You must be level 38 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, Foe Hold, -SPD, -Recharge",
      "icon": "ice_mastery_blockofice.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Holds",
        "Ranged Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.87,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0,
          "knockup": 1.0,
          "knockback": 1.0
        },
        "damage": {
          "type": "Cold",
          "scale": 2.669,
          "table": "Melee_PvPDamage"
        },
        "resistance": {}
      }
    },
    {
      "name": "Frozen Aura",
      "fullName": "Epic.Sentinel_Ice_Mastery.Frozen_Aura",
      "rank": 4,
      "available": 40,
      "description": "Your mastery of cold enables you to dramatically lower the temperature immediately around you. When you perform a Frozen Aura, nearby foes will be frozen within a fragile casing of ice and suffer a moderate amount of cold damage. These frozen foes will break free if attacked. Frozen Aura deals moderate damage. You must be level 41 and have one other Ice Mastery Powers before selecting this power.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "PBAoE, DMG(Cold), Foe Sleep",
      "icon": "ice_mastery_frozenaura.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee AoE Damage",
        "Sleep",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.1,
        "effectArea": "AoE",
        "radius": 10.0,
        "damage": {
          "type": "Cold",
          "scale": 1.388,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "sleep": 2.0
        }
      }
    },
    {
      "name": "Snow Storm",
      "fullName": "Epic.Sentinel_Ice_Mastery.Snow_Storm",
      "rank": 5,
      "available": 43,
      "description": "While active, the chill from this Snow Storm can dramatically Slow the attack and movement speed of the target and all nearby foes. The torrent winds of the Snow Storm are enough to bring down flying foes. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -Speed, -Recharge, -Fly",
      "icon": "ice_mastery_snowstorm.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Slow Movement"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 20.0,
        "endurance": 0.325,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 25.0
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_ice_mastery'] = EPIC_SENTINEL_ICE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
