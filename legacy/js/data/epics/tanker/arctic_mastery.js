/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Tanker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\arctic_mastery
 */

const EPIC_ARCTIC_MASTERY = {
  "id": "arctic_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "tanker",
  "description": "You have Mastery over Ice and snow to blast your foes and control your foes.",
  "icon": "arctic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Chilblain",
      "fullName": "Epic.Arctic_Mastery.Chilblain",
      "rank": 1,
      "available": 34,
      "description": "Immobilizes your target in an icy trap. Deals some damage over time and slightly Slows the target's attack and movement speed. Useful for keeping villains at bay.",
      "shortHelp": "Ranged, DoT(Cold), Foe Immobilize, -SPD, -Recharge",
      "icon": "ice_mastery_chillblain.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
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
        "Ranged Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.0776,
          "table": "Ranged_Damage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Block of Ice",
      "fullName": "Epic.Arctic_Mastery.Block_of_Ice",
      "rank": 2,
      "available": 34,
      "description": "You can freeze a single foe in a Block of Ice. The target is frozen solid, helpless, and can be attacked. More powerful foes may not be held, but all affected targets will be Slowed.",
      "shortHelp": "Ranged, Foe Hold, -SPD, -Recharge",
      "icon": "ice_mastery_blockofice.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
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
          "type": "Fire",
          "scale": 0.45,
          "table": "Ranged_Damage"
        },
        "resistance": {}
      }
    },
    {
      "name": "Ice Blast",
      "fullName": "Epic.Arctic_Mastery.Ice_Blast",
      "rank": 3,
      "available": 37,
      "description": "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage. You must be level 38 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_iceblast.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.5357,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Shiver",
      "fullName": "Epic.Arctic_Mastery.Shiver",
      "rank": 4,
      "available": 40,
      "description": "You can blast forth a wide cone of chilling air that dramatically Slows the movement and attack rate of nearby foes. You must be level 41 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), Foe -SPD, -Recharge",
      "icon": "ice_mastery_shiver.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 15.6,
        "activationTime": 2.17,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 2.3562
      }
    },
    {
      "name": "Ice Storm",
      "fullName": "Epic.Arctic_Mastery.Ice_Storm",
      "rank": 5,
      "available": 43,
      "description": "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets movement and attack speed. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Location AoE), DoT(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_icestorm.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 2.0,
        "range": 60.0,
        "recharge": 120.0,
        "endurance": 19.5,
        "activationTime": 2.03,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['arctic_mastery'] = EPIC_ARCTIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
