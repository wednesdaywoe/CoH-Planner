/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Electricity Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\electrical_mastery
 */

const EPIC_ELECTRICAL_MASTERY = {
  "id": "electrical_mastery",
  "name": "Electricity Mastery",
  "displayName": "Electricity Mastery",
  "archetype": "blaster",
  "description": "You have Mastery over Electricity to defeat your foes, and to add some much needed armor and defense.",
  "icon": "electrical_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Static Discharge",
      "fullName": "Epic.Electrical_Mastery.Static_Discharge",
      "rank": 1,
      "available": 34,
      "description": "Discharges a cone of Static Electricity that deals damage and drains Endurance from all affected foes in the area.",
      "shortHelp": "Ranged (Cone), DMG(Energy), -END",
      "icon": "electrical_mastery_static_discharge.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 18.98,
        "activationTime": 2.17,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Energy",
          "scale": 1.008,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Shocking Bolt",
      "fullName": "Epic.Electrical_Mastery.Shocking_Bolt",
      "rank": 2,
      "available": 34,
      "description": "Holds a distant foe by shocking him with electricity. The seized target is left writhing in agony and is unable to defend himself. Shocking Bolt also drains some Endurance from the target over time. A portion of drained Endurance may be returned to you.",
      "shortHelp": "Ranged, DoT(Energy), Foe Hold, -END",
      "icon": "electrical_mastery_shocking_bolt.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
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
        "activationTime": 2.0,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Energy",
          "scale": 0.552,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Charged Armor",
      "fullName": "Epic.Electrical_Mastery.Charged_Armor",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you are surrounded in a charged field that makes you highly resistant to Smashing, Lethal and Energy damage. You must be level 38 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Energy)",
      "icon": "electrical_mastery_charged_armor.png",
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
      "name": "Surge of Power",
      "fullName": "Epic.Electrical_Mastery.Surge_of_Power",
      "rank": 4,
      "available": 40,
      "description": "When you activate this power, you transform your body into living Electricity and become extremely resistant to all damage but Psionics. However, expending all this energy will leave you exhausted, and drained of all endurance. You must be level 41 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Self, +Res(Special)",
      "icon": "electrical_mastery_powersurge.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 1000.0,
        "endurance": 3.25,
        "activationTime": 1.96,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 6.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          }
        },
        "recovery": {
          "scale": -100.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "EM Pulse",
      "fullName": "Epic.Electrical_Mastery.EM_Pulse",
      "rank": 5,
      "available": 43,
      "description": "You can unleash a massive pulse of electromagnetic energy. This EMP will drain the endurance and HP regeneration of all affected targets and leave them incapacitated and Disoriented for a while. Additionally, most machines and robots will take moderate high damage. However, this power uses a lot of endurance and leaves you unable to recover endurance for a while. You must be level 44 and have two other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, Foe Disorient, -END, -Regen, Special vs. Robots; Self -Recovery",
      "icon": "electrical_mastery_em_pulse.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Stuns"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 800.0,
        "endurance": 26.0,
        "activationTime": 2.93,
        "effectArea": "AoE",
        "radius": 40.0,
        "protection": {
          "stun": 3.0
        },
        "regeneration": {
          "scale": -30.0,
          "table": "Ranged_Res_Boolean"
        },
        "damage": {
          "type": "Energy",
          "scale": 1.64,
          "table": "Ranged_Damage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['electrical_mastery'] = EPIC_ELECTRICAL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
