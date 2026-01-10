/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Arsenal Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\munitions_mastery
 */

const EPIC_MUNITIONS_MASTERY = {
  "id": "munitions_mastery",
  "name": "Arsenal Mastery",
  "displayName": "Arsenal Mastery",
  "archetype": "blaster",
  "description": "You have Mastery of a wide arsenal of weapons, giving you access to uncommon payloads and equipment.",
  "icon": "munitions_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Body Armor",
      "fullName": "Epic.Munitions_Mastery.Body_Armor",
      "rank": 1,
      "available": 34,
      "description": "You have Body Armor that will reduce all damage except Psionic. This power is always on, and costs no Endurance.",
      "shortHelp": "Auto: Self +Res (All but Psionic)",
      "icon": "munitionsmastery_bodyarmor.png",
      "powerType": "Auto",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance"
      ],
      "allowedSetCategories": [
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 1.25,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Cryo Freeze Ray",
      "fullName": "Epic.Munitions_Mastery.Cryo_Freeze_Ray",
      "rank": 2,
      "available": 34,
      "description": "Although this weapon deals very little damage, the Cryo Freeze Ray encases your foe in a block of ice, holding him helpless in place for a while.",
      "shortHelp": "Ranged, DMG(Cold), Foe Hold, -SPD, -Recharge",
      "icon": "munitionsmastery_cryofreezeray.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
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
        "accuracy": 1.05,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Cold",
          "scale": 2.529,
          "table": "Ranged_PvPDamage"
        },
        "resistance": {}
      }
    },
    {
      "name": "Sleep Grenade",
      "fullName": "Epic.Munitions_Mastery.Sleep_Grenade",
      "rank": 3,
      "available": 37,
      "description": "The Sleep Grenade can be launched at long range from beneath the barrel of your Assault Rifle. It releases a cloud of gas that will make enemies fall asleep. You must be level 35 and have one other Arsenal Mastery powers before selecting this power.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged (Targeted AoE), Minor DMG(Smash), Foe Sleep",
      "icon": "munitionsmastery_sleepgrenade.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Sleep",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 80.0,
        "recharge": 90.0,
        "endurance": 19.5,
        "activationTime": 1.87,
        "effectArea": "AoE",
        "radius": 15.0,
        "protection": {
          "sleep": 3.0
        },
        "damage": {
          "type": "Smashing",
          "scale": 0.1,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Surveillance",
      "fullName": "Epic.Munitions_Mastery.Surveillance",
      "rank": 4,
      "available": 40,
      "description": "When this power is activated, you focus your senses to analyze your target's defensive capabilities and discover their weaknesses. By sharing your knowledge of the target's weaknesses with your team mates, you effectively reduce their defense and resistance to damage. Your Combat Attributes Window will also show the combat attributes of the target. You must be level 41 and have one other Arsenal Mastery powers before selecting this power.",
      "shortHelp": "Ranged Foe -DEF, -RES (All)",
      "icon": "munitionsmastery_surveillance.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Defense Debuff"
      ],
      "effects": {
        "accuracy": 1.05,
        "range": 80.0,
        "recharge": 45.0,
        "endurance": 10.66,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "lethal": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "fire": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "cold": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "energy": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "negative": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "psionic": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "toxic": {
            "scale": -2.0,
            "table": "Ranged_Debuff_Res_Dmg"
          }
        },
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Melee_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "LRM Rocket",
      "fullName": "Epic.Munitions_Mastery.LRM_Rocket",
      "rank": 5,
      "available": 43,
      "description": "The LRM Rocket is a powerful piece of hardware. It is very accurate and has a very long range. The impressive round can knock down its target. The LRM Rocket is bulky, awkward to use and you must take your time to aim, so this attack can be interrupted. You must be level 44 and have two other Arsenal Mastery Powers before selecting this power. If you are engaged in battle this attack becomes instant-cast, but inflicts lower damage on a reduced area and range.",
      "shortHelp": "Interruptible (Targeted AoE), DMG(Lethal/Smash), Foe Knockback",
      "icon": "munitionsmastery_lrmrocket.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
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
        "accuracy": 1.05,
        "range": 150.0,
        "recharge": 240.0,
        "endurance": 22.75,
        "activationTime": 3.87,
        "effectArea": "AoE",
        "radius": 20.0
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['munitions_mastery'] = EPIC_MUNITIONS_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
