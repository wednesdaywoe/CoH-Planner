/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\mastermind_leviathan_mastery
 */

const EPIC_MASTERMIND_LEVIATHAN_MASTERY = {
  "id": "mastermind_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "mastermind",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you how to harness its power.",
  "icon": "mastermind_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "School of Sharks",
      "fullName": "Epic.Mastermind_Leviathan_Mastery.School_of_Sharks",
      "rank": 1,
      "available": 34,
      "description": "You can call forth a school of vicious Shark Spirits that will swim out in a cone formation and will encircle your foes, draining their spirit energy. The encircling Shark Spirits will immobilize most foes while they deal negative energy damage over time. Both you and the target must be Near the Ground for this power to activate.",
      "shortHelp": "Ranged (Cone), DoT(Negative), Foe Immobilize",
      "icon": "arachnos_patron_coneimmobilize.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Blaster) || ($archetype == @Class_Mastermind))",
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
          "type": "Negative",
          "scale": 0.1102,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Bile Spray",
      "fullName": "Epic.Mastermind_Leviathan_Mastery.Chum_Spray",
      "rank": 2,
      "available": 34,
      "description": "Sharks will eat anything, so their stomach acid must be powerful indeed. You can regurgitate this acid and spew a corrosive spray of bile at a foe. Affected foes in the cone area will take toxic damage over time.",
      "shortHelp": "Ranged (Cone), DoT(Toxic)",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Blaster) || ($archetype == @Class_Mastermind))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.6,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.5236,
        "damage": {
          "type": "Toxic",
          "scale": 0.0682,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Knockout Blow",
      "fullName": "Epic.Mastermind_Leviathan_Mastery.Knockout_Blow",
      "rank": 3,
      "available": 37,
      "description": "You can channel the massive strength of the Leviathan into a Knockout Blow. This punch does Superior damage, and has a great chance of Holding your target. You must be level 38 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Melee, DMG(Smash), Foe Hold",
      "icon": "arachnos_patron_koblow.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 13.2,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.23,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 3.561,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "hold": 3.0,
          "knockup": 1.0
        }
      }
    },
    {
      "name": "Shark Skin",
      "fullName": "Epic.Mastermind_Leviathan_Mastery.Shark_Skin",
      "rank": 4,
      "available": 40,
      "description": "The power of the Leviathan Mako has shown you seems to have no end. Shark Skin improves your damage resistance to Lethal, Smashing and cold damage. You must be level 41 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Cold)",
      "icon": "arachnos_patron_resistbuff.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
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
      "name": "Spirit Shark Jaws",
      "fullName": "Epic.Mastermind_Leviathan_Mastery.Spirit_Shark_Jaws",
      "rank": 5,
      "available": 43,
      "description": "You can summon a massive Spirit Shark that will attack your foe from below. The Shark will grip your foe with its massive jaws and attempt to hold the target while it mauls it, dealing lethal Damage over Time. Flying Targets will likely be pulled to the ground. You must be level 44 and have two other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Lethal), Foe Hold, -Fly",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['mastermind_leviathan_mastery'] = EPIC_MASTERMIND_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
