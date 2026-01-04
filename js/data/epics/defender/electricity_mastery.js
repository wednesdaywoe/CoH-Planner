/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Electricity Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\electricity_mastery
 */

const EPIC_ELECTRICITY_MASTERY = {
  "id": "electricity_mastery",
  "name": "Electricity Mastery",
  "displayName": "Electricity Mastery",
  "archetype": "defender",
  "description": "You have Mastery over Electricity to defeat your foes, and to add some much needed armor and defense.",
  "icon": "electricity_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Electric Fence",
      "fullName": "Epic.Electricity_Mastery.Electric_Fence",
      "rank": 1,
      "available": 34,
      "description": "Surrounds and Immobilizes a single target in an Electric Fence. Deals some damage over time and slowly drains some Endurance. Useful for keeping villains at bay.",
      "shortHelp": "Ranged, DoT(Energy), Foe Immobilize, -End",
      "icon": "electricitymanipulation_electricfence.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Immobilize",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 0.3778,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {},
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Thunder Strike",
      "fullName": "Epic.Electricity_Mastery.Thunder_Strike",
      "rank": 2,
      "available": 34,
      "description": "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave.",
      "shortHelp": "Melee (AoE), DMG(Smash, Energy), Foe Disorient, Knockback",
      "icon": "electricitymanipulation_thunderstrike.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
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
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.53,
        "effectArea": "AoE",
        "radius": 10.0
      }
    },
    {
      "name": "Charged Armor",
      "fullName": "Epic.Electricity_Mastery.Charged_Armor",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage. You must be level 38 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
      "icon": "electricitymastery_chargedarmor.png",
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
          "energy": {
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
      "name": "Shocking Bolt",
      "fullName": "Epic.Electricity_Mastery.Shocking_Bolt",
      "rank": 4,
      "available": 40,
      "description": "Holds a distant foe by shocking him with electricity. The seized target is left writhing in agony and is unable to defend himself. Shocking Bolt also drains some Endurance from the target over time. A portion of drained Endurance may be returned to you. You must be level 41 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Energy), Foe Hold, -END",
      "icon": "electricitymastery_shockingbolt.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Energy",
          "scale": 0.552,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Power Sink",
      "fullName": "Epic.Electricity_Mastery.Power_Sink",
      "rank": 5,
      "available": 43,
      "description": "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance. You must be level 44 and have two other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, Self +End, Foe -End",
      "icon": "electricitymanipulation_powersink.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 16.25,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 12.0,
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['electricity_mastery'] = EPIC_ELECTRICITY_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
