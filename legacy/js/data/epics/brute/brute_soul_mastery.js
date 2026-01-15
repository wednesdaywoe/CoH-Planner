/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Brute
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\brute_soul_mastery
 */

const EPIC_BRUTE_SOUL_MASTERY = {
  "id": "brute_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "brute",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "brute_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Gloom",
      "fullName": "Epic.Brute_Soul_Mastery.Gloom",
      "rank": 1,
      "available": 34,
      "description": "Gloom slowly drains a target of life, while reducing his Accuracy. Slower than Dark Blast, but deals more damage over time.",
      "shortHelp": "Ranged, DoT(Negative), Foe -ACC",
      "icon": "arachnos_patron_targetedrangedhighdmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 16.0,
        "endurance": 10.66,
        "activationTime": 1.1,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.099,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Soul Tentacles",
      "fullName": "Epic.Brute_Soul_Mastery.Soul_Tentacles",
      "rank": 2,
      "available": 34,
      "description": "You can create a cone shaped rift to the Netherworld that allows the souls of the damned to slip into our reality. These Soul Tentacles will snare all foes within range, Immobilizing them while they drain their life.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe Immobilize",
      "icon": "arachnos_patron_coneimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Brute) || ($archetype == @Class_Tanker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 20.0,
        "endurance": 12.74,
        "activationTime": 1.67,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.5236,
        "damage": {
          "type": "Fire",
          "scale": 0.045,
          "table": "Ranged_Damage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Darkest Night",
      "fullName": "Epic.Brute_Soul_Mastery.Darkest_Night",
      "rank": 3,
      "available": 37,
      "description": "While active, you channel Negative Energy onto a targeted foe. Darkest Night decreases the damage potential and chance to hit of the target, and all foes nearby, as long as you keep the power active. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG -To Hit",
      "icon": "arachnos_patron_aoedamagedebuff.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 20.0,
        "endurance": 0.325,
        "activationTime": 2.37,
        "effectArea": "AoE",
        "radius": 15.0
      }
    },
    {
      "name": "Dark Obliteration",
      "fullName": "Epic.Brute_Soul_Mastery.Dark_Obliteration",
      "rank": 4,
      "available": 40,
      "description": "You hurl a large blast of negative energy that violently explodes on impact, exposing the dark power of the Netherworld to all foes near the target. Dark Obliteration can reduce the Accuracy of all affected targets. You must be level 41 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Negative), Foe -ACC",
      "icon": "arachnos_patron_rangedaoemoderatedmg.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged AoE Damage",
        "To Hit Debuff",
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
          "scale": 0.405,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Summon Widow",
      "fullName": "Epic.Brute_Soul_Mastery.Summon_Widow",
      "rank": 5,
      "available": 43,
      "description": "Ghost Widow has assigned a beautiful but deadly Blood Widow assassins for you to command. Their weapons of choice include wrist retractable mounted razors and darts, all tipped in deadly poison. Your access to this Blood Widow is very limited, and you can only summon her once every 15 minutes and she will leave after 4 minutes, until defeated, or until you leave a zone or mission. You must be level 44 and have two other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Summon Blood Widow: Melee DMG(Lethal)",
      "icon": "arachnos_patron_summononepet.png",
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
        "Pet Damage",
        "Recharge Intensive Pets",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 3.2,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['brute_soul_mastery'] = EPIC_BRUTE_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
