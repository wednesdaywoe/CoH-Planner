/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Leviathan Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\dominator_leviathan_mastery
 */

const EPIC_DOMINATOR_LEVIATHAN_MASTERY = {
  "id": "dominator_leviathan_mastery",
  "name": "Leviathan Mastery",
  "displayName": "Leviathan Mastery",
  "archetype": "dominator",
  "description": "Captain Mako has granted you access to the power of the Leviathan. The Leviathan is an ancient gargantuan entity who slumbers under Sharkhead Isle. Worshiped by the Coralax, the Leviathan has given Captain Mako many abilities and now he has taught you how to harness its power.",
  "icon": "dominator_leviathan_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Water Spout",
      "fullName": "Epic.Dominator_Leviathan_Mastery.Water_Spout",
      "rank": 1,
      "available": 34,
      "description": "Conjures up a Water Spout at a targeted location. The Water Spout will chase down your foes, tossing them into the air and hurling them great distances. The victims are left Disoriented and with reduced Defense. The Water Spout is a menacing sight, and can even cause panic among your foes.",
      "shortHelp": "Summon Water Spout: PBAoE DMG(Smash), Foe Knockback, Fear, Disorient, +Wet",
      "icon": "arachnos_patron_dropknockback.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Controller) || ($archetype == @Class_Dominator))",
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
      "name": "Bile Spray",
      "fullName": "Epic.Dominator_Leviathan_Mastery.Chum_Spray",
      "rank": 2,
      "available": 34,
      "description": "Sharks will eat anything, so their stomach acid must be powerful indeed. You can regurgitate this acid and spew a corrosive spray of bile at a foe. Affected foes in the cone area will take toxic damage over time.",
      "shortHelp": "Ranged (Cone), DoT(Toxic)",
      "icon": "arachnos_patron_rangedconemoderatedmg.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Controller) || ($archetype == @Class_Dominator))",
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
          "scale": 1.0219,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Hibernate",
      "fullName": "Epic.Dominator_Leviathan_Mastery.Hibernate",
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
      "name": "Shark Skin",
      "fullName": "Epic.Dominator_Leviathan_Mastery.Shark_Skin",
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
      "name": "Summon Coralax",
      "fullName": "Epic.Dominator_Leviathan_Mastery.Summon_Coralax",
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
        "Knockback",
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
    EPIC_POOLS['dominator_leviathan_mastery'] = EPIC_DOMINATOR_LEVIATHAN_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
