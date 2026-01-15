/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\defender_fire_mastery
 */

const EPIC_DEFENDER_FIRE_MASTERY = {
  "id": "defender_fire_mastery",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "defender",
  "description": "You have Mastery over Fire and Flame to control your foes and to add some much needed armor and defense.",
  "icon": "flame_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Consume",
      "fullName": "Epic.Defender_Fire_Mastery.Consume",
      "rank": 1,
      "available": 34,
      "description": "You can drain body heat from all nearby foes in order to replenish your own Endurance. The more foes affected, the more Endurance is gained. Foes suffer minimal Fire damage.",
      "shortHelp": "PBAoE, DMG(Fire), Self +End",
      "icon": "flamingshield_consume.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Defender",
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
    },
    {
      "name": "Char",
      "fullName": "Epic.Defender_Fire_Mastery.Char",
      "rank": 2,
      "available": 34,
      "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot.",
      "shortHelp": "Ranged, DoT (Fire), Foe Hold",
      "icon": "flamemastery_soot.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Defender",
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
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.07,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Fire",
          "scale": 0.4218,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Fire Shield",
      "fullName": "Epic.Defender_Fire_Mastery.Fire_Shield",
      "rank": 3,
      "available": 37,
      "description": "While this power is active, you get a good resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Fire, Lethal, Smash, Cold)",
      "icon": "flamingshield_flamingshield.png",
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
      "fullName": "Epic.Defender_Fire_Mastery.Rise_of_the_Phoenix",
      "rank": 4,
      "available": 40,
      "description": "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down. You will revive with about half of your Hit Points and Endurance. Rise of the Phoenix will actually leave you invulnerable for a brief time and protected from XP Debt for 20 seconds. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Self Rez, Special",
      "icon": "flamingshield_riseofthephoenix.png",
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
      "name": "Greater Fire Sword",
      "fullName": "Epic.Defender_Fire_Mastery.Greater_Fire_Sword",
      "rank": 5,
      "available": 43,
      "description": "Your mastery of fire allows you to create an enhanced Sword of Fire that can set foes ablaze. Successful attacks from the Greater Fire Sword will ignite your target, dealing damage over time. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Melee, DMG(Fire)",
      "icon": "firemastery_greaterfiresword.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 7.0,
        "recharge": 24.0,
        "endurance": 19.825,
        "activationTime": 1.37,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.2,
          "table": "Melee_Damage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['defender_fire_mastery'] = EPIC_DEFENDER_FIRE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
