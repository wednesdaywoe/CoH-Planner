/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Psionic Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\psionic_mastery
 */

const EPIC_PSIONIC_MASTERY = {
  "id": "psionic_mastery",
  "name": "Psionic Mastery",
  "displayName": "Psionic Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Psionics and the mind to blast your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "psionic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mental Blast",
      "fullName": "Epic.Psionic_Mastery.Mental_Blast",
      "rank": 1,
      "available": 34,
      "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed.",
      "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
      "icon": "psychicblast_mentalblast.png",
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
        "range": 100.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Psionic",
          "scale": 1.889,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Indomitable Will",
      "fullName": "Epic.Psionic_Mastery.Indomitable_Will",
      "rank": 2,
      "available": 34,
      "description": "Activating this power greatly boosts your resistance to Sleep, Disorient, Fear and Hold effects for 90 seconds. Indomitable Will also grants a high defense to Psionic based attacks.",
      "shortHelp": "Self Res(Disorient, Hold, Sleep, Fear). DEF(Psionics)",
      "icon": "psionicmastery_indomitablewill.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Controller",
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
        "recharge": 360.0,
        "endurance": 19.5,
        "activationTime": 0.73,
        "effectArea": "SingleTarget",
        "protection": {
          "confuse": 1.0,
          "fear": 1.0,
          "hold": 1.0,
          "stun": 1.0,
          "sleep": 1.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Mind Over Body",
      "fullName": "Epic.Psionic_Mastery.Mind_Over_Body",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you empower your Mind Over Body to become highly resistant to Smashing, Lethal and Psionic damage. You must be level 38 and have one other Psionic Mastery Powers before selecting this power.<br>",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Psionics)",
      "icon": "psionicmastery_mindoverbody.png",
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
        "activationTime": 0.67,
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
          "psionic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 2.75,
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
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "World of Confusion",
      "fullName": "Epic.Psionic_Mastery.World_of_Confusion",
      "rank": 4,
      "available": 40,
      "description": "This toggle power allows you to cause psionic damage and cause confusion within a group of foes, creating chaos. The chance of confusing an enemy is lower than then chance of damaging them, and it may take multiple hits to affect stronger opponents. All affected foes within the area will turn and attack each other, ignoring all heroes. You will not receive any Experience Points for foes defeated by Confused enemies. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: PBAoE, DoT(Psionic), Foe Confuse",
      "icon": "psionicmastery_worldofconfusion.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Confuse",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Confuse",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 15.0,
        "endurance": 0.65,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 8.0,
        "protection": {
          "confuse": 1.0
        },
        "damage": {
          "type": "Psionic",
          "scale": 0.12,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Psionic Tornado",
      "fullName": "Epic.Psionic_Mastery.Psionic_Tornado",
      "rank": 5,
      "available": 43,
      "description": "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed. You must be level 44 and have two other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Psionic), Foe Knockback",
      "icon": "psychicblast_psionictornado.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 100.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 1.83,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Psionic",
          "scale": 0.8409,
          "table": "Ranged_PvPDamage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['psionic_mastery'] = EPIC_PSIONIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
