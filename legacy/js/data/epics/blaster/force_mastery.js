/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Force Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\force_mastery
 */

const EPIC_FORCE_MASTERY = {
  "id": "force_mastery",
  "name": "Force Mastery",
  "displayName": "Force Mastery",
  "archetype": "blaster",
  "description": "You have Mastery over Energy and Force to protect yourself and defeat your foes.",
  "icon": "force_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Personal Force Field",
      "fullName": "Epic.Force_Mastery.Personal_Force_Field",
      "rank": 1,
      "available": 34,
      "description": "The Personal Force Field is almost impenetrable to all attacks, even Psionics and Enemy Teleportation, although attacks from more powerful foes may get through more easily. Personal Force Field will also reduce the damage of almost any attacks that do get through. The Personal Force Field works both ways; while it is active, you can only use powers that affect yourself. Cannot be used with Rest.",
      "shortHelp": "Toggle: Self +Def, Res(All)",
      "icon": "forcefield_personalforcefield.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Defense Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 30.0,
        "endurance": 0.1625,
        "activationTime": 2.03,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 4.0,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Repulsion Field",
      "fullName": "Epic.Force_Mastery.Repulsion_Field",
      "rank": 2,
      "available": 34,
      "description": "This Toggle power creates a field that violently repels nearby foes. Each villain that is repelled costs you additional Endurance.",
      "shortHelp": "Toggle: PBAoE Knockback",
      "icon": "forcefield_repulsionfield.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Knockback"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 40.0,
        "endurance": 0.4875,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 9.0
      }
    },
    {
      "name": "Temp Invulnerability",
      "fullName": "Epic.Force_Mastery.Temp_Invulnerability",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you become highly resistant to Smashing and Lethal damage. You must be level 38 and have one other Force Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
      "icon": "forcemastery_temporaryinvulnerabilty.png",
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
      "name": "Force Bomb",
      "fullName": "Epic.Force_Mastery.Repulsion_Bomb",
      "rank": 4,
      "available": 40,
      "description": "A powerful Force Bomb is hurled at your foes dealing a moderate amount of damage and knocking them off of their feet. Foes struck by Repulsion Bomb have a chance to become disoriented, and the force of the blow will leave their armor shattered, lowering their damage resistance. You must be level 41 and have one other Force Mastery Powers before selecting this power.<br>",
      "shortHelp": "Ranged (Targeted AoE), DMG(Smash), Foe -Res, Knockdown, Disorient",
      "icon": "forcefield_repulsionbomb.png",
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
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 70.0,
        "recharge": 60.0,
        "endurance": 21.125,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 10.0,
        "damage": {
          "type": "Smashing",
          "scale": 0.7818,
          "table": "Ranged_Damage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Force of Nature",
      "fullName": "Epic.Force_Mastery.Foce_of_Nature",
      "rank": 5,
      "available": 43,
      "description": "When you activate this power, you become highly resistant to all damage types except psionics. Your endurance recovery is also increased. Force of Nature costs little endurance to activate, but when it wears off you are left exhausted, and drained of almost all endurance, and unable to recover endurance for a short while. You must be level 44 and have two other Force Mastery Powers before selecting this power.",
      "shortHelp": "Self, +Res(All DMG but Psionics)",
      "icon": "forcemastery_unstoppable.png",
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
    EPIC_POOLS['force_mastery'] = EPIC_FORCE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
