/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Electricity Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\charge_mastery
 */

const EPIC_CHARGE_MASTERY = {
  "id": "charge_mastery",
  "name": "Electricity Mastery",
  "displayName": "Electricity Mastery",
  "archetype": "mastermind",
  "description": "You have Mastery over Electrical power to defeat your foes, and to add some much needed armor and defense.",
  "icon": "charge_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Static Discharge",
      "fullName": "Epic.Charge_Mastery.Static_Discharge",
      "rank": 1,
      "available": 34,
      "description": "Discharges a cone of Static Electricity that deals damage and drains Endurance from all affected foes in the area.",
      "shortHelp": "Ranged (Cone), DMG(Energy), -END",
      "icon": "electrical_mastery_static_discharge.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
      "name": "Electric Shackles",
      "fullName": "Epic.Charge_Mastery.Electric_Shackles",
      "rank": 2,
      "available": 34,
      "description": "Electric Shackles binds a foes limbs, leaving the target held and helpless. The target is drained of some Endurance and some of that Endurance may be transferred back to you.",
      "shortHelp": "Ranged, DMG(Energy), Foe Hold, -End",
      "icon": "electrical_mastery_shocking_bolt.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
          "table": "Melee_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Thunder Strike",
      "fullName": "Epic.Charge_Mastery.Thunder_Strike",
      "rank": 3,
      "available": 37,
      "description": "A massive attack. You smash your foes with all the power of a lightning bolt. The pummeled victim takes tremendous damage and may be Disoriented. Any nearby foes may be knocked down and take some damage from the shockwave, as well as have some endurance drained. You must be level 38 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Melee (AoE), DMG(Smash, Energy), Foe Disorient, Knockback, -End",
      "icon": "chargemastery_thunderstrike.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Melee AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.53,
        "effectArea": "AoE",
        "radius": 10.0
      }
    },
    {
      "name": "Surge of Power",
      "fullName": "Epic.Charge_Mastery.Surge_of_Power",
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
      "name": "ESD",
      "fullName": "Epic.Charge_Mastery.EM_Pulse",
      "rank": 5,
      "available": 43,
      "description": "You can unleash a massive pulse of electromagnetic energy. This EMP will drain the endurance and HP regeneration of all affected targets and leave them incapacitated and Disoriented for a while. Additionally, most machines and robots will take moderate high damage. You must be level 44 and have two other Electricity Mastery Powers before selecting this power.",
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
        "recharge": 180.0,
        "endurance": 25.225,
        "activationTime": 2.93,
        "effectArea": "AoE",
        "radius": 25.0,
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
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['charge_mastery'] = EPIC_CHARGE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
