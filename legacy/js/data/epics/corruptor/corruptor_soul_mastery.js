/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Corruptor
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\corruptor_soul_mastery
 */

const EPIC_CORRUPTOR_SOUL_MASTERY = {
  "id": "corruptor_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "corruptor",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "corruptor_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Soul Storm",
      "fullName": "Epic.Corruptor_Soul_Mastery.Soul_Storm",
      "rank": 1,
      "available": 34,
      "description": "Like Ghost Widow, you can summon the souls of your victims to do your bidding. Soul Storm enraptures a single target Holding them while their life-force is drained from their body. You must be level 41 and have Soul Drain or Dark Embrace before selecting this power.",
      "shortHelp": "Ranged, DoT(Negative), Foe Hold",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
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
        "activationTime": 2.17,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Negative",
          "scale": 0.2879,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Dark Embrace",
      "fullName": "Epic.Corruptor_Soul_Mastery.Dark_Embrace",
      "rank": 2,
      "available": 34,
      "description": "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
      "icon": "arachnos_patron_resistbuff.png",
      "powerType": "Toggle",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
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
      "name": "Power Boost",
      "fullName": "Epic.Corruptor_Soul_Mastery.Power_Boost",
      "rank": 3,
      "available": 37,
      "description": "Greatly boosts the secondary effects of your powers. Your powers effects like Disorients, Holds, Immobilizes, Heals, Defense Buffs, Endurance Drains, Knockbacks and more, are all improved. The effects of Power Boost last a short while, and only the next couple of attacks will be boosted. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Self +Special",
      "icon": "arachnos_patron_powerboost.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 9.75,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Soul Drain",
      "fullName": "Epic.Corruptor_Soul_Mastery.Soul_Drain",
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
          "scale": 0.6408,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Mistress",
      "fullName": "Epic.Corruptor_Soul_Mastery.Summon_Mistress",
      "rank": 5,
      "available": 43,
      "description": "Ghost Widow has assigned a Fortunata Mistress for you to command. Arguably, the most powerful of the Fortunatas, these rare few have mastered numerous psychic abilities and risen to the top of Lord Recluse's beautiful Black Widows. Your access to this Fortunata is very limited. You can only summon her once every 15 minutes and she will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Summon Fortunata Mistress: Ranged DMG(Psionic)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Immobilize",
        "Knockback",
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
        "activationTime": 3.2,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['corruptor_soul_mastery'] = EPIC_CORRUPTOR_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
