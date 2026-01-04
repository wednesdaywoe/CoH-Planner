/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Mu Mastery
 * Archetype: Corruptor
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\corruptor_mu_mastery
 */

const EPIC_CORRUPTOR_MU_MASTERY = {
  "id": "corruptor_mu_mastery",
  "name": "Mu Mastery",
  "displayName": "Mu Mastery",
  "archetype": "corruptor",
  "description": "Scirocco has taught you the ancient powers of the Mu. In their eternal struggle against the Oranbega, the Mu have unlocked many mystical powers, including their very signature crimson lightning. Now you possess their secrets.",
  "icon": "corruptor_mu_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Power Sink",
      "fullName": "Epic.Corruptor_Mu_Mastery.Power_Sink",
      "rank": 1,
      "available": 34,
      "description": "Power Sink leeches energy directly from the bodies of all nearby foes, draining their Endurance. Each foe you draw energy from increases your Endurance. If there are no foes within range, you will not gain any Endurance.",
      "shortHelp": "PBAoE, Self +End, Foe -End",
      "icon": "arachnos_patron_pbaoedrain.png",
      "powerType": "Click",
      "requires": "(Owned?(Beta_AutoLevel50) || Owned?(BloodInTheWaterPatron) || Owned?(MiragePatron) || Owned?(SpidersKissPatron) || Owned?(TheStingerPatron)) && (($archetype == @Class_Corruptor) || ($archetype == @Class_Defender))",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 16.25,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 10.0,
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Charged Armor",
      "fullName": "Epic.Corruptor_Mu_Mastery.Charged_Armor",
      "rank": 2,
      "available": 34,
      "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
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
          "energy": {
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
      "name": "Electric Shackles",
      "fullName": "Epic.Corruptor_Mu_Mastery.Electric_Shackles",
      "rank": 3,
      "available": 37,
      "description": "Electric Shackles binds a foes limbs, leaving the target held and helpless. The target is drained of some Endurance and some of that Endurance may be transferred back to you. You must be level 38 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
      "icon": "arachnos_patron_targetedhold.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
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
          "type": "Energy",
          "scale": 0.4113,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Energize",
      "fullName": "Epic.Corruptor_Mu_Mastery.Conserve_Power",
      "rank": 4,
      "available": 40,
      "description": "You can channel a tremendous amount of electricity through your body for a short period of time. Doing so will heal some hit points, reduce the endurance cost of your powers and boost your regeneration for a short time. You must be level 41 and have one other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Self Endurance Discount, Heal, +Regen",
      "icon": "arachnos_patron_conservepower.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 240.0,
        "endurance": 12.714,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 1.0,
          "table": "Melee_Ones"
        },
        "damage": {
          "type": "Heal",
          "scale": 2.5,
          "table": "Melee_HealSelf"
        }
      }
    },
    {
      "name": "Summon Adept",
      "fullName": "Epic.Corruptor_Mu_Mastery.Summon_Adept",
      "rank": 5,
      "available": 43,
      "description": "Scirocco has shown you how to call upon a mystical Mu Adept to assist you. The Mu pulse with the blood of their slaughtered ancestors in their veins, and are well practiced in the dark arts. Your access to this Adept is very limited. You must be level 44 and have two other Mu Mastery Powers before selecting this power.",
      "shortHelp": "Summon Mu Adept: Ranged DMG(Energy)",
      "icon": "arachnos_patron_summononepet.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Hold",
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Holds",
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
        "activationTime": 1.17,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['corruptor_mu_mastery'] = EPIC_CORRUPTOR_MU_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
