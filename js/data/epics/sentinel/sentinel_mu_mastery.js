/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_mu_mastery
 */

const EPIC_SENTINEL_MU_MASTERY = {
  "id": "sentinel_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "sentinel",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "sentinel_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Electrifying Fences",
      "fullName": "Epic.Sentinel_Mu_Mastery.Electrifying_Fences",
      "rank": 1,
      "available": 34,
      "description": "The Electrifying Fences attempts to Immobilize a group of foes in an area. This power deals some energy damage over time as it slowly drains some Endurance.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Energy), Foe Immobilize, -END",
      "icon": "arachnos_patron_rangedaoeimmobilize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Thunder Strike",
      "fullName": "Epic.Sentinel_Mu_Mastery.Thunder_Strike",
      "rank": 2,
      "available": 34,
      "description": "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave, as well as have some endurance drained.",
      "shortHelp": "Melee (AoE), DMG(Smash, Energy), Foe Disorient, Knockback, -End",
      "icon": "arachnos_patron_thunderstrike.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Electric Shackles",
      "fullName": "Epic.Sentinel_Mu_Mastery.Electric_Shackles",
      "rank": 3,
      "available": 37,
      "description": "Electric Shackles binds a foes limbs, leaving the target held and helpless. The target is drained of some Endurance and some of that Endurance may be transferred back to you. You must be level 38 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
      "icon": "arachnos_patron_targetedhold.png",
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
    },
    {
      "name": "Static Discharge",
      "fullName": "Epic.Sentinel_Mu_Mastery.Static_Discharge",
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
          "type": "Energy",
          "scale": 1.1803,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Summon Adept",
      "fullName": "Epic.Sentinel_Mu_Mastery.Summon_Adept",
      "rank": 5,
      "available": 43,
      "description": "Scirocco has shown you how to call upon a mystical Mu Adept to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Adept is very limited. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Adept: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Healing",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_mu_mastery'] = EPIC_SENTINEL_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
