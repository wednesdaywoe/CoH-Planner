/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\dominator_mu_mastery
 */

const EPIC_DOMINATOR_MU_MASTERY = {
  "id": "dominator_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "dominator",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "dominator_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Power Sink",
      "fullName": "Epic.Dominator_Mu_Mastery.Power_Sink",
      "rank": 1,
      "available": 34,
      "description": "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.",
      "shortHelp": "PBAoE, Self +End, Foe -End",
      "icon": "arachnos_patron_pbaoedrain.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Controller) || ($archetype == @Class_Dominator))",
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
        "radius": 10.0,
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Charged Armor",
      "fullName": "Epic.Dominator_Mu_Mastery.Charged_Armor",
      "rank": 2,
      "available": 34,
      "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
      "icon": "arachnos_patron_resistbuff.png",
      "powerType": "Toggle",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Controller) || ($archetype == @Class_Dominator))",
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
      "name": "Ball Lightning",
      "fullName": "Epic.Dominator_Mu_Mastery.Ball_Lightning",
      "rank": 3,
      "available": 37,
      "description": "Hurls a highly charged ball of Mu lightning that explodes on contact. Ball Lightning deals good damage in an area of effect, and drains some Endurance from each target it hits. You must be level 38 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe -End",
      "icon": "arachnos_patron_rangedaoemoderatedmg.png",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.07,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.7474,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Surge of Power",
      "fullName": "Epic.Dominator_Mu_Mastery.Surge_of_Power",
      "rank": 4,
      "available": 40,
      "description": "When you activate this power, you transform your body into living Electricity and become extremely resistant to all damage but Psionics, and your endurance recovery is also increased. Expending all this energy will leave you exhausted, drained of all your endurance and unable to recover endurance for a short time. You must be level 41 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Self, +Res(Special)",
      "icon": "arachnos_patron_selfbuffresistancephysical.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 1000.0,
        "endurance": 3.25,
        "activationTime": 1.96,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 6.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          }
        },
        "recovery": {
          "scale": -100.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Summon Guardian",
      "fullName": "Epic.Dominator_Mu_Mastery.Summon_Guardian",
      "rank": 5,
      "available": 43,
      "description": "Scirocco has shown you how to call upon a mystical Mu Guardian to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Guardian is very limited. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Guardian: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing",
        "Holds",
        "Pet Damage",
        "Recharge Intensive Pets",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['dominator_mu_mastery'] = EPIC_DOMINATOR_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
