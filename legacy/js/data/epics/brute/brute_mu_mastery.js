/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Brute
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\brute_mu_mastery
 */

const EPIC_BRUTE_MU_MASTERY = {
  "id": "brute_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "brute",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "brute_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mu Lightning",
      "fullName": "Epic.Brute_Mu_Mastery.Mu_Lightning",
      "rank": 1,
      "available": 34,
      "description": "You can send a large blast of Mu electrical energy at a foe, dealing heavy damage and draining some Endurance. Some of this Endurance may transfer back to you.",
      "shortHelp": "Ranged, DMG(Energy), Foe -End",
      "icon": "arachnos_patron_targetedrangedhighdmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 12.0,
        "endurance": 8.58,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.594,
          "table": "Ranged_Damage"
        },
        "recovery": {
          "scale": -3.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Electrifying Fences",
      "fullName": "Epic.Brute_Mu_Mastery.Electrifying_Fences",
      "rank": 2,
      "available": 34,
      "description": "The Electrifying Fences attempts to Immobilize a group of foes in an area. This power deals some energy damage over time as it slowly drains some Endurance.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe Immobilize, -END",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
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
          "type": "Fire",
          "scale": 0.0377,
          "table": "Ranged_Damage"
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
      "name": "Ball Lightning",
      "fullName": "Epic.Brute_Mu_Mastery.Ball_Lightning",
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
          "type": "Fire",
          "scale": 0.081,
          "table": "Ranged_Damage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Static Discharge",
      "fullName": "Epic.Brute_Mu_Mastery.Static_Discharge",
      "rank": 4,
      "available": 40,
      "description": "Hurls multiple bolts of Mu Electricity in an arc that deals damage and drains Endurance from all affected foes in the area. You must be level 41 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Energy), -END",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
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
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 18.98,
        "activationTime": 2.07,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Fire",
          "scale": 0.432,
          "table": "Ranged_Damage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Summon Striker",
      "fullName": "Epic.Brute_Mu_Mastery.Summon_Striker",
      "rank": 5,
      "available": 43,
      "description": "Scirocco has shown you how to call upon a mystical Mu Striker to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Striker is very limited. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Strike: Ranged DMG(Energy)",
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
    EPIC_POOLS['brute_mu_mastery'] = EPIC_BRUTE_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
