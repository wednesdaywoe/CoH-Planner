/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Energy Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\field_mastery
 */

const EPIC_FIELD_MASTERY = {
  "id": "field_mastery",
  "name": "Energy Mastery",
  "displayName": "Energy Mastery",
  "archetype": "mastermind",
  "description": "You have Mastery over Energy and Force to protect yourself and defeat your foes.",
  "icon": "field_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Temp Invulnerability",
      "fullName": "Epic.Field_Mastery.Personal_Force_Field",
      "rank": 1,
      "available": 34,
      "description": "When you toggle on this power, you become highly resistant to Smashing and Lethal damage.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
      "icon": "fieldmastery_tempinvulnerability.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Mastermind",
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
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Power Blast",
      "fullName": "Epic.Field_Mastery.Power_Blast",
      "rank": 2,
      "available": 34,
      "description": "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock him back.",
      "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
      "icon": "powerblast_powerblast.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
        "recharge": 8.0,
        "endurance": 10.66,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 0.3778,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Energy Torrent",
      "fullName": "Epic.Field_Mastery.Energy_Torrent",
      "rank": 3,
      "available": 37,
      "description": "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying. You must be level 38 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
      "icon": "primalforcesmastery_energytorrent.png",
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
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 14.82,
        "activationTime": 1.07,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Energy",
          "scale": 0.6203,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Explosive Blast",
      "fullName": "Epic.Field_Mastery.Repulsion_Bomb",
      "rank": 4,
      "available": 40,
      "description": "You hurl a blast of charged energy that violently explodes on impact, damaging all foes near the target. Explosive Blast may knock targets backwards. You must be level 41 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback",
      "icon": "powerblast_explosion.png",
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
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.6797,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0,
          "stun": 2.0
        }
      }
    },
    {
      "name": "Force of Nature",
      "fullName": "Epic.Field_Mastery.Foce_of_Nature",
      "rank": 5,
      "available": 43,
      "description": "When you activate this power, you become highly resistant to all damage types except psionics. Your endurance recovery is also increased. Force of Nature costs little endurance to activate, but when it wears off you are left exhausted, and drained of almost all endurance, and unable to recover endurance for a short while. You must be level 44 and have two other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Self, +Res(All DMG but Psionics)",
      "icon": "fieldmastery_forceofnature.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "activationTime": 3.1,
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
          "energy": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          }
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['field_mastery'] = EPIC_FIELD_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
