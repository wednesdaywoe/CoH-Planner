/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Stalker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\stalker_leviathan_mastery
 */

const EPIC_STALKER_LEVIATHAN_MASTERY = {
  "id": "stalker_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "stalker",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you how to harness its power.",
  "icon": "stalker_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Spirit Shark",
      "fullName": "Epic.Stalker_Leviathan_Mastery.Spirit_Shark",
      "rank": 1,
      "available": 34,
      "description": "You are empowered with the Spirit of the Mako Shark. You can project this spirit to attack and maul your opponent. The Shark Spirit will manifest and attack your foe, quickly dealing heavy lethal damage over time. The damage over time increases the more hunger stacks you have. All hunger Leviathan Hunger stacks are consumed when you successfully hit an enemy with this power. When you own this power, most actions that cost endurance will have a chance of granting a Leviathan Hunger stack.",
      "shortHelp": "Ranged, DoT(Lethal), Foe Knockback, -Leviathan Hunger",
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
        "Knockback",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 13.0,
        "endurance": 9.1,
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Lethal",
          "scale": 1.0694,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Water Spout",
      "fullName": "Epic.Stalker_Leviathan_Mastery.Water_Spout",
      "rank": 2,
      "available": 34,
      "description": "Conjures up a Water Spout at a targeted location. The Water Spout will chase down your foes, tossing them into the air and hurling them great distances. The victims are left Disoriented and with reduced Defense. The Water Spout is a menacing sight, and can even cause panic among your foes.",
      "shortHelp": "Summon Water Spout: PBAoE DMG(Smash), Foe Knockback, Fear, Disorient, +Wet",
      "icon": "arachnos_patron_dropknockback.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage"
      ],
      "allowedSetCategories": [
        "Defense Debuff",
        "Knockback",
        "Ranged AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.3,
        "range": 60.0,
        "recharge": 180.0,
        "endurance": 26.0,
        "activationTime": 1.17,
        "effectArea": "Location"
      }
    },
    {
      "name": "Hibernate",
      "fullName": "Epic.Stalker_Leviathan_Mastery.Hibernate",
      "rank": 3,
      "available": 37,
      "description": "When you activate this power, you encase yourself in a block of solid ice, making yourself invulnerable, though you are frozen solid and cannot act. While Hibernating within this block of ice, you heal damage and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot Hibernate for more than 30 seconds. If you activate this power while in the air, you will fall. You must be level 38 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
      "icon": "arachnos_patron_selfbuffresistancephysical.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 240.0,
        "endurance": 0.1625,
        "activationTime": 0.07,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 10.0,
          "table": "Melee_Ones"
        },
        "recovery": {
          "scale": 4.0,
          "table": "Melee_Ones"
        },
        "resistance": {},
        "protection": {
          "knockup": 1.0,
          "knockback": 1.0,
          "immobilize": 1000.0
        }
      }
    },
    {
      "name": "Spirit Shark Jaws",
      "fullName": "Epic.Stalker_Leviathan_Mastery.Spirit_Shark_Jaws",
      "rank": 4,
      "available": 40,
      "description": "You can summon a massive Spirit Shark that will attack your foe from below. The Shark will grip your foe with its massive jaws and attempt to hold the target while it mauls it, dealing lethal Damage over Time. Flying Targets will likely be pulled to the ground. You must be level 41 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Lethal), Foe Hold, -Fly",
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
        "activationTime": 1.87,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Lethal",
          "scale": 0.2604,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Guardian",
      "fullName": "Epic.Stalker_Leviathan_Mastery.Summon_Guardian",
      "rank": 5,
      "available": 43,
      "description": "Captain Mako has shown you how to summon a Coralax Guardian Warder to do your bidding. These creatures are composed of living coral made from the sea-goddess Merulina. Your access to this Guardian is very limited. You can only summon it once every 15 minutes and it will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Summon Warder: Ranged DMG(Smashing)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Hold",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Holds",
        "Knockback",
        "Pet Damage",
        "Recharge Intensive Pets",
        "Slow Movement",
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
    EPIC_POOLS['stalker_leviathan_mastery'] = EPIC_STALKER_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
