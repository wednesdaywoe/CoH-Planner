/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\dominator_soul_mastery
 */

const EPIC_DOMINATOR_SOUL_MASTERY = {
  "id": "dominator_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "dominator",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "dominator_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Dark Consumption",
      "fullName": "Epic.Dominator_Soul_Mastery.Dark_Consumption",
      "rank": 1,
      "available": 34,
      "description": "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
      "shortHelp": "PBAoE DMG(Negative), Self +End",
      "icon": "arachnos_patron_pbaoedrain.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Controller) || ($archetype == @Class_Dominator))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
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
        "activationTime": 1.03,
        "effectArea": "AoE",
        "radius": 8.0,
        "damage": {
          "type": "Negative",
          "scale": 0.9553,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Dark Embrace",
      "fullName": "Epic.Dominator_Soul_Mastery.Dark_Embrace",
      "rank": 2,
      "available": 34,
      "description": "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
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
          "negative": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
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
          "psionic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Dark Obliteration",
      "fullName": "Epic.Dominator_Soul_Mastery.Dark_Obliteration",
      "rank": 3,
      "available": 37,
      "description": "You hurl a large blast of negative energy that violently explodes on impact, exposing the dark power of the Netherworld to all foes near the target. Dark Obliteration can reduce the Accuracy of all affected targets. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
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
          "type": "Negative",
          "scale": 0.5299,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Soul Drain",
      "fullName": "Epic.Dominator_Soul_Mastery.Soul_Drain",
      "rank": 4,
      "available": 40,
      "description": "Using this power, you can drain the essence of all nearby foes' souls, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and Accuracy. You must be level 41 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE DMG(Negative), Self +DMG, +ACC",
      "icon": "arachnos_patron_pbaoebuffdamage.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee AoE Damage",
        "To Hit Buff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "recharge": 240.0,
        "endurance": 19.5,
        "activationTime": 2.37,
        "effectArea": "AoE",
        "radius": 10.0,
        "damage": {
          "type": "Negative",
          "scale": 0.5192,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Seer",
      "fullName": "Epic.Dominator_Soul_Mastery.Summon_Seer",
      "rank": 5,
      "available": 43,
      "description": "Ghost Widow has assigned a Fortunata Seer for you to command. Fortunata Seers can glimpse moments into the future. They use this ability to increase the Perception of their teammate. Your access to this Fortunata Seer is very limited. You can only summon her once every 15 minutes and she will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Summon Fortunata Seer: Ranged DMG(Psionic)",
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
        "Immobilize",
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
    EPIC_POOLS['dominator_soul_mastery'] = EPIC_DOMINATOR_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
