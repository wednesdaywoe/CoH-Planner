/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Soul Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\mastermind_soul_mastery
 */

const EPIC_MASTERMIND_SOUL_MASTERY = {
  "id": "mastermind_soul_mastery",
  "name": "Soul Mastery",
  "displayName": "Soul Mastery",
  "archetype": "mastermind",
  "description": "Ghost Widow has granted you access to the power of darkness and souls. She has shown you how to use the souls of your victims to destroy your enemies. This has granted you access to powers and abilities you have never had before.",
  "icon": "mastermind_soul_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Night Fall",
      "fullName": "Epic.Mastermind_Soul_Mastery.Night_Fall",
      "rank": 1,
      "available": 34,
      "description": "Unleashes a cone shaped burst of particles from the Netherworld. All targets within the modest range of this power take Negative Energy damage and have a reduced Accuracy.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe -ACC",
      "icon": "arachnos_patron_conedot.png",
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
        "Accurate To-Hit Debuff",
        "Ranged AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 20.0,
        "endurance": 16.38,
        "activationTime": 2.0,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.3491,
        "damage": {
          "type": "Negative",
          "scale": 0.0938,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Dark Embrace",
      "fullName": "Epic.Mastermind_Soul_Mastery.Dark_Embrace",
      "rank": 2,
      "available": 34,
      "description": "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Negative Energy and Toxic damage.<br><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
      "icon": "arachnos_patron_resistbuff.png",
      "powerType": "Toggle",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Blaster) || ($archetype == @Class_Mastermind))",
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
      "name": "Oppressive Gloom",
      "fullName": "Epic.Mastermind_Soul_Mastery.Oppressive_Gloom",
      "rank": 3,
      "available": 37,
      "description": "The Netherworld has many mutable properties, such as the Oppressive Gloom. This power allows you to use your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use. You must be level 38 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: PBAoE, Foe Disorient, Self -HP",
      "icon": "arachnos_patron_pbaoestun.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Stuns"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 16.0,
        "endurance": 0.195,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 12.0,
        "protection": {
          "stun": 2.0
        },
        "damage": {
          "type": "Special",
          "scale": 0.1,
          "table": "Melee_Damage"
        }
      }
    },
    {
      "name": "Soul Tentacles",
      "fullName": "Epic.Mastermind_Soul_Mastery.Soul_Tentacles",
      "rank": 4,
      "available": 40,
      "description": "You can create a cone shaped rift to the Netherworld that allows the souls of the damned to slip into our reality. These Soul Tentacles will snare all foes within range, Immobilizing them while they drain their life. You must be level 41 and have one other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Negative), Foe Immobilize",
      "icon": "arachnos_patron_coneimmobilize.png",
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
      "name": "Soul Storm",
      "fullName": "Epic.Mastermind_Soul_Mastery.Soul_Storm",
      "rank": 5,
      "available": 43,
      "description": "Like Ghost Widow, you can summon the souls of your victims to do your bidding. Soul Storm enraptures a single target Holding them while their life-force is drained from their body. You must be level 44 and have two other Soul Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Negative), Foe Hold",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['mastermind_soul_mastery'] = EPIC_MASTERMIND_SOUL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
