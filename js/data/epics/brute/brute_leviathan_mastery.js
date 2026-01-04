/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Brute
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\brute_leviathan_mastery
 */

const EPIC_BRUTE_LEVIATHAN_MASTERY = {
  "id": "brute_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "brute",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you how to harness its power.",
  "icon": "brute_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Spirit Shark",
      "fullName": "Epic.Brute_Leviathan_Mastery.Spirit_Shark",
      "rank": 1,
      "available": 34,
      "description": "You are empowered with the Spirit of the Mako Shark. You can project this spirit to attack and maul your opponent. The Shark Spirit will manifest and attack your foe, quickly dealing heavy lethal damage over time. The damage over time increases the more hunger stacks you have. All hunger Leviathan Hunger stacks are consumed when you successfully hit an enemy with this power. When you own this power, most actions that cost endurance will have a chance of granting a Leviathan Hunger stack.",
      "shortHelp": "Ranged, DoT(Lethal), Foe Knockback, -Leviathan Hunger",
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
          "type": "Fire",
          "scale": 0.063,
          "table": "Ranged_Damage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "School of Sharks",
      "fullName": "Epic.Brute_Leviathan_Mastery.School_of_Sharks",
      "rank": 2,
      "available": 34,
      "description": "You can call forth a school of vicious Shark Spirits that will swim out in a cone formation and will encircle your foes, draining their spirit energy. The encircling Shark Spirits will immobilize most foes while they deal negative energy damage over time. Both you and the target must be Near the Ground for this power to activate.",
      "shortHelp": "Ranged (Cone), DoT(Negative), Foe Immobilize",
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
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 2.37,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.5236,
        "damage": {
          "type": "Fire",
          "scale": 0.0377,
          "table": "Ranged_Damage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Bile Spray",
      "fullName": "Epic.Brute_Leviathan_Mastery.Chum_Spray",
      "rank": 3,
      "available": 37,
      "description": "Sharks will eat anything, so their stomach acid must be powerful indeed. You can regurgitate this acid and spew a corrosive spray of bile at a foe. Affected foes in the cone area will take toxic damage over time. You must be level 38 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DoT(Toxic)",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
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
          "type": "Fire",
          "scale": 0.045,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Arctic Breath",
      "fullName": "Epic.Brute_Leviathan_Mastery.Arctic_Breath",
      "rank": 4,
      "available": 40,
      "description": "Sharks will eat anything, so their stomach acid must be powerful indeed. You can regurgitate this freezing acid and spew a corrosive spray of bile at a foe. Affected foes in the cone area will take cold damage over time, and have their damage resistance, Defense, movement rate, and recharge rate reduced. This ice will stick to foes, causing them to fall down occasionally. You must be level 41 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DoT(Cold), Foe -Speed, -Recharge, -DEF -Res, knock down",
      "icon": "arachnos_patron_coneslow.png",
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
        "Accurate Defense Debuff",
        "Defense Debuff",
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 2.33,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.5236,
        "damage": {
          "type": "Fire",
          "scale": 0.045,
          "table": "Ranged_Damage"
        },
        "protection": {
          "knockback": 1.0
        },
        "resistance": {
          "smashing": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "lethal": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "fire": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "cold": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "energy": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "negative": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "psionic": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "toxic": {
            "scale": -1.5,
            "table": "Ranged_Debuff_Res_Dmg"
          }
        },
        "defense": {
          "all": {
            "scale": 1.5,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Summon Guardian",
      "fullName": "Epic.Brute_Leviathan_Mastery.Summon_Guardian",
      "rank": 5,
      "available": 43,
      "description": "Captain Mako has shown you how to summon a Coralax Guardian Sentinel to do your bidding. These creatures are composed of living coral made from the sea-goddess Merulina. Your access to this Guardian is very limited. You can only summon it once every 15 minutes and it will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Summon Sentinel: Ranged DMG(Smashing)",
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
    EPIC_POOLS['brute_leviathan_mastery'] = EPIC_BRUTE_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
