/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Corruptor
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\corruptor_leviathan_mastery
 */

const EPIC_CORRUPTOR_LEVIATHAN_MASTERY = {
  "id": "corruptor_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "corruptor",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you ho",
  "icon": "corruptor_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "School of Sharks",
      "fullName": "Epic.Corruptor_Leviathan_Mastery.School_of_Sharks",
      "rank": 1,
      "available": 34,
      "description": "You can call forth a school of vicious Shark Spirits that will swim out in a cone formation and will encircle your foes, draining their spirit energy. The encircling Shark Spirits will immobilize most foes while they deal negative energy damage over time.",
      "shortHelp": "Ranged (Cone), DoT(Negative), Foe Immobilize",
      "icon": "arachnos_patron_coneimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
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
        "activationTime": 2.37,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.5236,
        "damage": {
          "type": "Lethal",
          "scale": 0.124,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Shark Skin",
      "fullName": "Epic.Corruptor_Leviathan_Mastery.Shark_Skin",
      "rank": 2,
      "available": 34,
      "description": "The power of the Leviathan Mako has shown you seems to have no end. Shark Skin improves your damage resistance to Lethal, Smashing and cold damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Cold)",
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
          "cold": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
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
      "name": "Hibernate",
      "fullName": "Epic.Corruptor_Leviathan_Mastery.Hibernate",
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
      "fullName": "Epic.Corruptor_Leviathan_Mastery.Spirit_Shark_Jaws",
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
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Summon Coralax",
      "fullName": "Epic.Corruptor_Leviathan_Mastery.Summon_Coralax",
      "rank": 5,
      "available": 43,
      "description": "Captain Mako has shown you how to summon a Coralax Red Hybrid to do your bidding. The Coralax are humans who have been infected with living coral. Your access to this Hybrid is very limited. You can only summon it once every 15 minutes and it will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Summon Hybrid: Ranged DMG(Psionic)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Knockback",
        "Pet Damage",
        "Recharge Intensive Pets",
        "Slow Movement",
        "Stuns",
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
    EPIC_POOLS['corruptor_leviathan_mastery'] = EPIC_CORRUPTOR_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
