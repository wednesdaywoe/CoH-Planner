/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Stalker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\stalker_soul_mastery
 */

const EPIC_STALKER_SOUL_MASTERY = {
  "id": "stalker_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "stalker",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "stalker_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Dark Blast",
      "fullName": "Epic.Stalker_Soul_Mastery.Dark_Blast",
      "rank": 1,
      "available": 34,
      "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's Accuracy.",
      "shortHelp": "Ranged, DMG(Negative), Foe -ACC",
      "icon": "arachnos_patron_targetedrangedmoddmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
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
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 0.8575,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Moonbeam",
      "fullName": "Epic.Stalker_Soul_Mastery.Moonbeam",
      "rank": 2,
      "available": 34,
      "description": "An extremely long range and accurate beam of Negative Energy that deals tremendous damage and reduces the target's Accuracy.This is a sniper attack, and like most sniper attacks, is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast.",
      "shortHelp": "Sniper, DMG(Negative), Target -ACC",
      "icon": "arachnos_patron_targetedrangedsnipe.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged Damage",
        "Sniper Attacks",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 150.0,
        "recharge": 24.0,
        "endurance": 17.94,
        "activationTime": 1.33,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Shadow Meld",
      "fullName": "Epic.Stalker_Soul_Mastery.Shadow_Meld",
      "rank": 3,
      "available": 37,
      "description": "Your mastery over the shadows allows you to become a living shadow entity for a short time, increasing your defense to all attacks. You must be level 35 and have Dark Blast or Moonbeam before selecting this power. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Self: +Def(All)",
      "icon": "arachnos_patron_selfbuffresistancephysical.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 90.0,
        "endurance": 5.2,
        "activationTime": 3.0,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Soul Storm",
      "fullName": "Epic.Stalker_Soul_Mastery.Soul_Storm",
      "rank": 4,
      "available": 40,
      "description": "Like Ghost Widow, you can summon the souls of your victims to do your bidding. Soul Storm enraptures a single target Holding them while their life-force is drained from their body. You must be level 41 and have one other Soul Mastery Powers before selecting this power.",
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
          "type": "Fire",
          "scale": 0.0495,
          "table": "Melee_Damage"
        }
      }
    },
    {
      "name": "Summon Widow",
      "fullName": "Epic.Stalker_Soul_Mastery.Summon_Widow",
      "rank": 5,
      "available": 43,
      "description": "Ghost Widow has assigned a beautiful but deadly Blood Widow assassins for you to command. Their weapons of choice include wrist retractable mounted razors and darts, all tipped in deadly poison. Your access to this Blood Widow is very limited, and you can only summon her once every 15 minutes and she will leave after 4 minutes, until defeated, or until you leave a zone or mission. You must be level 44 and have two other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Summon Night Widow: Melee DMG(Lethal)",
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
        "Accurate To-Hit Debuff",
        "Pet Damage",
        "Recharge Intensive Pets",
        "To Hit Debuff",
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
    EPIC_POOLS['stalker_soul_mastery'] = EPIC_STALKER_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
