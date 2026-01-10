/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_soul_mastery
 */

const EPIC_SENTINEL_SOUL_MASTERY = {
  "id": "sentinel_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "sentinel",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "sentinel_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Soul Tentacles",
      "fullName": "Epic.Sentinel_Soul_Mastery.Soul_Tentacles",
      "rank": 1,
      "available": 34,
      "description": "You can create a cone shaped rift to the Netherworld that allows the souls of the damned to slip into our reality. These Soul Tentacles will snare all foes within range, Immobilizing them while they drain their life.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe Immobilize",
      "icon": "arachnos_patron_coneimmobilize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 1.67,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.5236,
        "damage": {
          "type": "Negative",
          "scale": 0.1588,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Midnight Grasp",
      "fullName": "Epic.Sentinel_Soul_Mastery.Midnight_Grasp",
      "rank": 2,
      "available": 34,
      "description": "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe, reduce their chance to hit and continuously drain their life force.",
      "shortHelp": "Melee, DMG(Negative), Foe Immobilize, -To Hit",
      "icon": "arachnos_patron_midnightgrasp.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Immobilize",
        "Melee Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 30.0,
        "endurance": 14.95,
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 2.499,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        }
      }
    },
    {
      "name": "Soul Storm",
      "fullName": "Epic.Sentinel_Soul_Mastery.Soul_Storm",
      "rank": 3,
      "available": 37,
      "description": "Like Ghost Widow, you can summon the souls of your victims to do your bidding. Soul Storm enraptures a single target Holding them while their life-force is drained from their body. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Negative), Foe Hold",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
      "name": "Darkest Night",
      "fullName": "Epic.Sentinel_Soul_Mastery.Darkest_Night",
      "rank": 4,
      "available": 40,
      "description": "While active, you channel Negative Energy onto a targeted foe. Darkest Night decreases the damage potential and chance to hit of the target, and all foes nearby, as long as you keep the power active. You must be level 41 and have one other Soul Mastery Powers before selecting this power.",
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
      "name": "Summon Mistress",
      "fullName": "Epic.Sentinel_Soul_Mastery.Summon_Mistress",
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
    EPIC_POOLS['sentinel_soul_mastery'] = EPIC_SENTINEL_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
