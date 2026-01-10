/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Earth Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\stone_mastery
 */

const EPIC_STONE_MASTERY = {
  "id": "stone_mastery",
  "name": "Earth Mastery",
  "displayName": "Earth Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Earth and Stone to attack your foes and to add some much needed armor and defense.",
  "icon": "stone_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Hurl Boulder",
      "fullName": "Epic.Stone_Mastery.Hurl_Boulder",
      "rank": 1,
      "available": 34,
      "description": "You are able to tear up a chunk of ground beneath your feet and Hurl it at an enemy. This attack is close ranged, deals high damage, and can knock foes back.",
      "shortHelp": "Ranged, DMG(Smash), Foe Knockback",
      "icon": "earth_mastery_hurlboulder.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Controller",
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
        "recharge": 16.0,
        "endurance": 10.66,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 2.44,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Fissure",
      "fullName": "Epic.Stone_Mastery.Fissure",
      "rank": 2,
      "available": 34,
      "description": "This powerful stomp can cause a seismic disturbance. This will crack the Earth itself and send a Fault towards a targeted foe. Affected targets take moderate damage and may be thrown in the air and possibly Disoriented.",
      "shortHelp": "Close (Targeted AoE), DMG(Lethal/Smash), Foe Knockback, Disorient",
      "icon": "earth_mastery_fissure.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Controller",
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
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 20.0,
        "recharge": 20.0,
        "endurance": 12.74,
        "activationTime": 2.1,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Smashing",
          "scale": 0.8215,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Rock Armor",
      "fullName": "Epic.Stone_Mastery.Stone_Armor",
      "rank": 3,
      "available": 37,
      "description": "Your skin becomes stone while this power is active. Stone Armor makes you highly resistant to Smashing and Lethal attacks. They are less likely to land and affect you. You must be level 38 and have one other Earth Mastery Powers before selecting this power.<br>",
      "shortHelp": "Toggle: Self +DEF(Lethal, Smashing)",
      "icon": "earth_mastery_rockarmor.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 4.0,
        "endurance": 0.1625,
        "activationTime": 0.73,
        "effectArea": "SingleTarget",
        "resistance": {
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Seismic Smash",
      "fullName": "Epic.Stone_Mastery.Seismic_Smash",
      "rank": 4,
      "available": 40,
      "description": "This massive attack hits with all the force of the Earth itself. It deals tremendous amounts of damage, and may Hold the target if they are not defeated outright. You must be level 41 and have one other Earth Mastery Powers before selecting this power.",
      "shortHelp": "Melee, DMG(Smash), Foe Hold",
      "icon": "earth_mastery_seismicsmash.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Hold",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Holds",
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 7.0,
        "recharge": 28.0,
        "endurance": 18.512,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 2.57,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "hold": 4.0
        }
      }
    },
    {
      "name": "Embrace of the Earth",
      "fullName": "Epic.Stone_Mastery.Earths_Embrace",
      "rank": 5,
      "available": 43,
      "description": "You are so connected to the Earth, you can draw upon its power to add to your own health. Activating this power increases your maximum Hit Points, and grants you resistance to Toxic Damage. You must be level 44 and have two other Earth Mastery Powers before selecting this power.",
      "shortHelp": "Self +HP",
      "icon": "earth_mastery_earthsembrace.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 360.0,
        "endurance": 13.0,
        "activationTime": 2.03,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Heal",
          "scale": 4.0,
          "table": "Melee_HealSelf"
        },
        "resistance": {
          "toxic": {
            "scale": 2.0,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['stone_mastery'] = EPIC_STONE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
