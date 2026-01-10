/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\blaster_mu_mastery
 */

const EPIC_BLASTER_MU_MASTERY = {
  "id": "blaster_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "blaster",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "blaster_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Static Discharge",
      "fullName": "Epic.Blaster_Mu_Mastery.Static_Discharge",
      "rank": 1,
      "available": 34,
      "description": "Hurls multiple bolts of Mu Electricity in an arc that deals damage and drains Endurance from all affected foes in the area.",
      "shortHelp": "Ranged (Cone), DMG(Energy), -END",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Blaster) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 18.98,
        "activationTime": 2.07,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Energy",
          "scale": 1.3147,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Charged Armor",
      "fullName": "Epic.Blaster_Mu_Mastery.Charged_Armor",
      "rank": 2,
      "available": 34,
      "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage.<br><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
      "icon": "arachnos_patron_resistbuff.png",
      "powerType": "Toggle",
      "requires": "($archetype == @Class_Blaster) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Summon Adept",
      "fullName": "Epic.Blaster_Mu_Mastery.Thunder_Strike",
      "rank": 3,
      "available": 37,
      "description": "Scirocco has shown you how to call upon a mystical Mu Adept to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Adept is very limited. You must be level 38 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Adept: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
        "Pet Damage",
        "Recharge Intensive Pets",
        "Sleep",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 1.17,
        "effectArea": "Location"
      }
    },
    {
      "name": "Electrifying Fences",
      "fullName": "Epic.Blaster_Mu_Mastery.Electrifying_Fences",
      "rank": 4,
      "available": 40,
      "description": "The Electrifying Fences attempts to Immobilize a group of foes in an area. This power deals some energy damage over time as it slowly drains some Endurance. You must be level 41 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe Immobilize, -END",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.0929,
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
      "name": "Electric Shackles",
      "fullName": "Epic.Blaster_Mu_Mastery.Electric_Shackles",
      "rank": 5,
      "available": 43,
      "description": "Electric Shackles binds a foes limbs, leaving the target held and helpless. The target is drained of some Endurance and some of that Endurance may be transferred back to you. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "activationTime": 2.17,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Energy",
          "scale": 0.4113,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['blaster_mu_mastery'] = EPIC_BLASTER_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
