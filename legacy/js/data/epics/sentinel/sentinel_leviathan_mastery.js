/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_leviathan_mastery
 */

const EPIC_SENTINEL_LEVIATHAN_MASTERY = {
  "id": "sentinel_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "sentinel",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you how to harness its power.",
  "icon": "sentinel_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "School of Sharks",
      "fullName": "Epic.Sentinel_Leviathan_Mastery.School_of_Sharks",
      "rank": 1,
      "available": 34,
      "description": "You can call forth a school of vicious Shark Spirits that will swim out in a cone formation and will encircle your foes, draining their spirit energy. The encircling Shark Spirits will immobilize most foes while they deal negative energy damage over time. Both you and the target must be Near the Ground for this power to activate.",
      "shortHelp": "Ranged (Cone), DoT(Negative), Foe Immobilize",
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
      "name": "Knockout Blow",
      "fullName": "Epic.Sentinel_Leviathan_Mastery.Knockout_Blow",
      "rank": 2,
      "available": 34,
      "description": "You can channel the massive strength of the Leviathan into a Knockout Blow. This punch does Superior damage, and has a great chance of Holding your target.",
      "shortHelp": "Melee, DMG(Smash), Foe Hold",
      "icon": "arachnos_patron_koblow.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Sentinel) && (Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron))",
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
      "name": "Spirit Shark Jaws",
      "fullName": "Epic.Sentinel_Leviathan_Mastery.Spirit_Shark_Jaws",
      "rank": 3,
      "available": 37,
      "description": "You can summon a massive Spirit Shark that will attack your foe from below. The Shark will grip your foe with its massive jaws and attempt to hold the target while it mauls it, dealing lethal Damage over Time. Flying Targets will likely be pulled to the ground. You must be level 38 and have one other Leviathan Mastery Powers before selecting this power.",
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
      "name": "Arctic Breath",
      "fullName": "Epic.Sentinel_Leviathan_Mastery.Arctic_Breath",
      "rank": 4,
      "available": 40,
      "description": "Sharks will eat anything, so their stomach acid must be powerful indeed. You can regurgitate this freezing acid and spew a corrosive spray of bile at a foe. Affected foes in the cone area will take cold damage over time, and have their Defense, movement rate, and recharge rate reduced. This ice will stick to foes, causing them to fall down occasionally. You must be level 41 and have one other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DoT(Cold), Foe -Speed, -Recharge, -DEF, knock down",
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
          "type": "Cold",
          "scale": 0.1208,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        },
        "resistance": {
          "smashing": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "lethal": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "fire": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "cold": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "energy": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "negative": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "psionic": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          },
          "toxic": {
            "scale": -1.5,
            "table": "Melee_Debuff_Res_Dmg"
          }
        },
        "defense": {
          "all": {
            "scale": 1.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Summon Coralax",
      "fullName": "Epic.Sentinel_Leviathan_Mastery.Summon_Coralax",
      "rank": 5,
      "available": 43,
      "description": "Captain Mako has shown you how to summon a Coralax Blue Hybrid to do your bidding. The Coralax are humans who have been infected with living coral. Your access to this Hybrid is very limited. You can only summon it once every 15 minutes and it will leave after 4 minutes, or if you exit a zone or mission. You must be level 44 and have two other Leviathan Mastery Powers before selecting this power.",
      "shortHelp": "Summon Hybrid: Ranged DMG(Lethal)",
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
        "Pet Damage",
        "Recharge Intensive Pets",
        "Slow Movement",
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
    EPIC_POOLS['sentinel_leviathan_mastery'] = EPIC_SENTINEL_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
