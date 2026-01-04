/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\fire_mastery
 */

const EPIC_FIRE_MASTERY = {
  "id": "fire_mastery",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Fire to blast your foes and to add some much needed armor and defense.",
  "icon": "fire_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Fire Blast",
      "fullName": "Epic.Fire_Mastery.Fire_Blast",
      "rank": 1,
      "available": 34,
      "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.",
      "shortHelp": "Ranged, DMG(Fire)",
      "icon": "fireblast_fireblast.png",
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
        "Ranged Damage",
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
          "scale": 1.889,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Fire Ball",
      "fullName": "Epic.Fire_Mastery.Fire_Ball",
      "rank": 2,
      "available": 34,
      "description": "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Smash)",
      "icon": "fireblast_fireball.png",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Fire",
          "scale": 0.1,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Fire Shield",
      "fullName": "Epic.Fire_Mastery.Fire_Shield",
      "rank": 3,
      "available": 37,
      "description": "While this power is active, you get a good resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Fire, Lethal, Smash, Cold)",
      "icon": "firemastery_flamingshield.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 8.0,
        "endurance": 0.1625,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Rise of the Phoenix",
      "fullName": "Epic.Fire_Mastery.Rise_of_the_Phoenix",
      "rank": 4,
      "available": 40,
      "description": "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down. You will revive with about half of your Hit Points and Endurance. Rise of the Phoenix will actually leave you invulnerable for a brief time and protected from XP Debt for 20 seconds. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Self Rez, Special",
      "icon": "firemastery_riseofthephoenix.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Recharge",
        "Heal",
        "Damage"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing",
        "Melee AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 300.0,
        "activationTime": 1.5,
        "effectArea": "Location",
        "damage": {
          "type": "Heal",
          "scale": 5.0,
          "table": "Melee_HealSelf"
        },
        "protection": {
          "immobilize": 50.0
        }
      }
    },
    {
      "name": "Consume",
      "fullName": "Epic.Fire_Mastery.Consume",
      "rank": 5,
      "available": 43,
      "description": "You can drain body heat from all nearby foes in order to replenish your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, DMG(Fire), Self +End",
      "icon": "firemastery_consume.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 360.0,
        "endurance": 0.65,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 20.0,
        "recovery": {
          "scale": 0.05,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['fire_mastery'] = EPIC_FIRE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
